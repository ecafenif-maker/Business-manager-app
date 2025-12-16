import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['sale', 'income', 'expense', 'transfer']
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },

    // For Sales
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        quantity: Number,
        price: Number
    }],
    paymentMethod: { type: String, enum: ['cash', 'transfer', 'pos', 'other'] },

    // For Expenses/Income
    category: { type: String }, // e.g., Rent, Salaries, Sales Revenue

    // For Transfers
    reference: { type: String },

    // Auth
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
