import express from 'express';
import Order from '../models/Order'; // Adjust the path if necessary

const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
    const { userId, essayRequestId, status } = req.body;
    const order = new Order({ userId, essayRequestId, status });

    try {
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error: any) {  // Explicitly typing error
        res.status(400).json({ message: error.message }); // Access message safely
    }
});

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('userId essayRequestId');
        res.status(200).json(orders);
    } catch (error: any) {  // Explicitly typing error
        res.status(500).json({ message: error.message }); // Access message safely
    }
});

export default router;
