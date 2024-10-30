import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import essayRequestRoutes from './routes/essayRequestRoutes';

const app = express();

// Middleware
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'your_connection_string_here'; // Use your connection string here

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Database connection error:', err));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/essay-requests', essayRequestRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
