import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db'; // Adjust the import based on your actual db connection file
import Order from '../../../models/Order'; // Make sure the path is correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const newOrder = new Order(req.body);
            const savedOrder = await newOrder.save();
            res.status(201).json(savedOrder);
        } catch (error) {
            console.error('Error saving order:', error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
