import express from 'express';
import Transaction from '../models/Transaction.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/transactions
// @access  Private
// Create Transaction (Sale, Income, Expense, Transfer)
router.post('/', protect, async (req, res) => {
    const { type, items, amount } = req.body; // ...others

    try {
        // Handle Stock Update for Sales
        if (type === 'sale' && items && items.length > 0) {
            for (const item of items) {
                const product = await Product.findById(item.product);
                if (product) {
                    if (product.quantity < item.quantity) {
                        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
                    }
                    product.quantity -= item.quantity;
                    await product.save();
                }
            }
        }

        const transaction = new Transaction({
            ...req.body,
            user: req.user._id,
        });

        const createdTransaction = await transaction.save();
        res.status(201).json(createdTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   GET /api/transactions
// @access  Private
// Filter by date, type
router.get('/', protect, async (req, res) => {
    const { type, startDate, endDate, limit } = req.query;
    const query = { user: req.user._id };

    if (type) query.type = type;
    if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    try {
        const transactions = await Transaction.find(query)
            .sort({ date: -1 })
            .limit(limit ? parseInt(limit) : 100);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/transactions/stats
// @access  Private
// Dashboard Stats
router.get('/stats', protect, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Daily Totals
        const dailySales = await Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                    type: 'sale',
                    date: { $gte: today }
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const dailyIncome = await Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                    type: 'income',
                    date: { $gte: today }
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Net Balance (Global)
        // Income + Sales - Expenses
        // Note: 'transfer' handling depends if it's internal. 
        // Assuming Transfers are neutral or handled specifically, usually 'transfer' is moving money, 
        // but if it's Incoming vs Outgoing, we might need a direction or use 'income'/'expense'.
        // Simplified: Balance = (Income + Sales) - Expenses

        const allStats = await Transaction.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const stats = {
            dailySales: dailySales[0]?.total || 0,
            dailyIncome: dailyIncome[0]?.total || 0,
            breakdown: allStats
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
