import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';

dbConnect(); // Ensure database connection is established

// Handler function for POST (creating a new order) and GET (retrieving orders)
export async function POST(req: Request) {
  try {
    const { userId, items, total } = await req.json();

    // Create a new order
    const newOrder = new Order({
      userId,
      items,
      total,
    });

    // Save the order to the database
    await newOrder.save();

    return new Response(JSON.stringify(newOrder), { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(JSON.stringify({ message: 'Error creating order' }), { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('user-id'); // Get user ID from headers or adjust this to your method of retrieving user ID

    if (!userId) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), { status: 400 });
    }

    // Retrieve all orders associated with the userId
    const orders = await Order.find({ userId });
    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ message: 'Error fetching orders' }), { status: 500 });
  }
}
