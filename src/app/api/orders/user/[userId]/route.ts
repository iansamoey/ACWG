import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import OrderModel, { IOrder } from '@/models/Order';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();

    const { userId } = req.query;

    switch (req.method) {
        case 'GET':
            try {
                const ordersData = await OrderModel.find({ userId }).lean();

                // Map ordersData to a plain array without type assertion
                const orders = ordersData.map(order => ({
                    _id: order._id.toString(),
                    title: order.title,
                    status: order.status,
                    userId: order.userId,
                }));

                res.status(200).json(orders);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error fetching orders for user' });
            }
            break;

        // You can add other cases here (e.g., POST, PUT, DELETE) as needed

        default:
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
            break;
    }
};

export default handler;
