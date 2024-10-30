import express from 'express';
import EssayRequest from '../models/EssayRequest';

const router = express.Router();

// Create a new essay request
router.post('/', async (req, res) => {
    const { userId, content } = req.body;
    const essayRequest = new EssayRequest({ userId, content });
    try {
        const savedRequest = await essayRequest.save();
        res.status(201).json(savedRequest);
    } catch (error: any) {  // Explicitly typing error
        res.status(400).json({ message: error.message }); // Access message safely
    }
});

// Get all essay requests
router.get('/', async (req, res) => {
    try {
        const requests = await EssayRequest.find().populate('userId');
        res.status(200).json(requests);
    } catch (error: any) {  // Explicitly typing error
        res.status(500).json({ message: error.message }); // Access message safely
    }
});

export default router;
