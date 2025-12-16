import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Note: Netlify functions are served at /.netlify/functions/api usually if configured in toml
// The router should handle the path relative to the function mount point.
// If toml rewrites /api/* -> /.netlify/functions/api, then req.path in app starts from /
const router = express.Router();

router.get('/status', (req, res) => res.send({ status: 'API is running' }));

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/transactions', transactionRoutes);

app.use('/.netlify/functions/api', router); // For Netlify environment
app.use('/api', router); // Fallback for local dev if not rewritten

export const handler = serverless(app);
