import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, unique: true, sparse: true },
    price: { type: Number, required: true },
    cost: { type: Number },
    quantity: { type: Number, required: true, default: 0 },
    category: { type: String },
    lowStockThreshold: { type: Number, default: 5 },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
