import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Spinner } from "react-bootstrap";

interface Order {
  _id: string;
  userId: string;
  serviceName: string;
  description: string;
  price: number;
  total: number;
  status: string;
  createdAt: Date;
}

const OrderHistory: React.FC = () => {
  const { state: userState } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders for the current user
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const userId = userState.user?.id;

        if (!userId) {
          setError("User ID not found");
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/orders/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch order history");

        const ordersData: Order[] = await response.json();
        const sortedOrders = ordersData.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message || "An unexpected error occurred");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [userState.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-500 text-white p-4 rounded shadow-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Order ID</th>
              <th className="py-2 px-4 border">Service</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border text-right">Price</th>
              <th className="py-2 px-4 border text-right">Total</th>
              <th className="py-2 px-4 border text-center">Status</th>
              <th className="py-2 px-4 border text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="py-2 px-4 border">{order._id}</td>
                <td className="py-2 px-4 border">{order.serviceName}</td>
                <td className="py-2 px-4 border">{order.description}</td>
                <td className="py-2 px-4 border text-right">
                  ${order.price && !isNaN(order.price) ? order.price.toFixed(2) : "N/A"}
                </td>
                <td className="py-2 px-4 border text-right">
                  ${order.total && !isNaN(order.total) ? order.total.toFixed(2) : "N/A"}
                </td>
                <td className="py-2 px-4 border text-center">{order.status}</td>
                <td className="py-2 px-4 border text-center">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;
