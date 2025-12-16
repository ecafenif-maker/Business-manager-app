import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

const Stock = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', price: '', quantity: '', category: '' });

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products', formData);
            setShowForm(false);
            setFormData({ name: '', price: '', quantity: '', category: '' });
            fetchProducts();
        } catch (error) {
            alert('Error adding product');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure?')) {
            await api.delete(`/products/${id}`);
            fetchProducts();
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Stock Management</h2>
                    <p className="text-gray-500">Track and manage your inventory</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus size={20} />
                    Add Item
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-fade-in">
                    <h3 className="font-bold mb-4">Add New Item</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            placeholder="Item Name"
                            className="px-4 py-2 border rounded-lg"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Category"
                            className="px-4 py-2 border rounded-lg"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            className="px-4 py-2 border rounded-lg"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            className="px-4 py-2 border rounded-lg"
                            value={formData.quantity}
                            onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                            required
                        />
                        <div className="md:col-span-2 flex justify-end gap-2">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
                        <tr>
                            <th className="px-6 py-3">Item Name</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">In Stock</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map(product => (
                            <tr key={product._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 text-gray-500">{product.category || '-'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.quantity < 5 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                                        }`}>
                                        {product.quantity} units
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-900">${product.price}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-primary mr-3"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(product._id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Stock;
