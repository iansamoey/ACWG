import express from 'express';
import User from '../models/User'; // Adjust the path if necessary

const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });

    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error: any) {  // Explicitly typing error
        res.status(400).json({ message: error.message }); // Access message safely
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error: any) {  // Explicitly typing error
        res.status(500).json({ message: error.message }); // Access message safely
    }
});

export default router;
