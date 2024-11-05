import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const orderData = req.body; // Adjust based on your frontend data structure
            
            // Log incoming order data for debugging
            console.log('Received order data:', orderData);

            const order = new Order(orderData);
            await order.save();
            res.status(201).json(order); // Return the saved order
        } catch (error: unknown) { // Explicitly typing error as unknown
            console.error('Error saving order:', error);

            // Type guard to check if error is an instance of Error
            if (error instanceof Error) {
                res.status(500).json({ message: 'Error saving order', error: error.message });
            } else {
                res.status(500).json({ message: 'Error saving order', error: 'An unknown error occurred.' });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
