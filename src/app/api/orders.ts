import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/db'; // Corrected path
import Order from '../../models/Order'; // Corrected path

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { serviceName, instructions, userId } = req.body;

    // Validate input
    if (!serviceName || !instructions || !userId) {
      return res.status(400).json({ message: 'Service name, instructions, and userId are required.' });
    }

    try {
      // Connect to the database
      await dbConnect();

      // Here you can add logic to determine the price based on the serviceName
      const servicePrice = 100; // Replace this with your actual pricing logic

      // Create a new order
      const newOrder = new Order({
        userId,
        items: [{
          id: serviceName, // Ensure serviceName is unique if used as id
          name: serviceName,
          price: servicePrice,
          quantity: 1,
        }],
        total: servicePrice,
        status: 'pending',
        createdAt: new Date(),
      });

      // Save the order to the database
      await newOrder.save();

      return res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
      console.error('Error creating order:', error);
      if (error instanceof Error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
      } else {
        return res.status(500).json({ message: 'Internal server error' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
