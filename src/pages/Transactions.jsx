import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Plus, Filter } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [typeFilter, setTypeFilter] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [type, setType] = useState('sale');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchTransactions();
        fetchProducts();
    }, [typeFilter]);

    const fetchTransactions = async () => {
        let url = '/transactions';
        if (typeFilter) url += `?type=${typeFilter}`;
        const { data } = await api.get(url);
        setTransactions(data);
    };

    const fetchProducts = async () => {
        const { data } = await api.get('/products');
        setProducts(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            type,
            amount: Number(amount),
            description,
            date: new Date()
        };

        if (type === 'sale') {
            // Find product price if not manually entered, but usually sales are calculated.
            // Simplified: Single item sale for now or manual amount
            if (selectedProduct) {
                const prod = products.find(p => p._id === selectedProduct);
                payload.items = [{
                    product: selectedProduct,
                    name: prod.name,
                    quantity: Number(quantity),
                    price: prod.price
                }];
                // Recalculate amount based on product price * qty if user didn't override
                if (!amount) payload.amount = prod.price * quantity;
            }
        }

        try {
            await api.post('/transactions', payload);
            setShowModal(false);
            fetchTransactions();
            // Reset form
            setAmount(''); setDescription(''); setSelectedProduct('');
        } catch (error) {
            alert('Error creating transaction: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
                    <p className="text-gray-500">History of sales, expenses, and transfers</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus size={20} />
                    New Entry
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {['', 'sale', 'expense', 'income', 'transfer'].map(t => (
                    <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize border ${typeFilter === t
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        {t || 'All'}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {transactions.map(tx => (
                            <tr key={tx._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 capitalize font-medium">{tx.type}</td>
                                <td className="px-6 py-4 text-gray-500">
                                    {tx.description}
                                    {tx.items?.length > 0 && <span className="text-xs ml-2 text-gray-400">({tx.items[0].name} x{tx.items[0].quantity})</span>}
                                </td>
                                <td className={`px-6 py-4 text-right font-semibold ${['expense', 'transfer'].includes(tx.type) ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                    {['expense', 'transfer'].includes(tx.type) ? '-' : '+'}${tx.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">New Transaction</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select
                                    className="w-full border rounded-lg p-2"
                                    value={type}
                                    onChange={e => setType(e.target.value)}
                                >
                                    <option value="sale">Sale</option>
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                    <option value="transfer">Transfer</option>
                                </select>
                            </div>

                            {type === 'sale' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium mb-1">Product</label>
                                        <select
                                            className="w-full border rounded-lg p-2"
                                            value={selectedProduct}
                                            onChange={e => setSelectedProduct(e.target.value)}
                                        >
                                            <option value="">Select Product...</option>
                                            {products.map(p => (
                                                <option key={p._id} value={p._id}>{p.name} (${p.price})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Quantity</label>
                                        <input
                                            type="number"
                                            className="w-full border rounded-lg p-2"
                                            value={quantity}
                                            onChange={e => setQuantity(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">Amount ($)</label>
                                <input
                                    type="number"
                                    className="w-full border rounded-lg p-2"
                                    value={amount}
                                    placeholder={type === 'sale' && selectedProduct ? 'Auto-calculated' : 'Enter amount'}
                                    onChange={e => setAmount(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <input
                                    className="w-full border rounded-lg p-2"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Notes..."
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Save Transaction</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
