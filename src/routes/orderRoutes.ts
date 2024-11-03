import express from 'express';
import Order from '../models/Order'; // Adjust the path if necessary

const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
    const { userId, items, total } = req.body;
    const newOrder = new Order({ userId, items, total });

    try {
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Get all orders (for admin use)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find(); // Fetch all orders
        res.status(200).json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
