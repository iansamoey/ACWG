"use client";

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
        if (!response.ok) {
          throw new Error("Failed to fetch order history");
        }

        const responseData = await response.json();
        
        // Handle different API response structures
        const ordersData: Order[] = Array.isArray(responseData)
          ? responseData
          : responseData.orders || [];

        // Ensure we have an array before sorting
        if (!Array.isArray(ordersData)) {
          throw new Error("Invalid order data format received");
        }

        // Sort orders by createdAt date in descending order (most recent first)
        const sortedOrders = ordersData.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setOrders(sortedOrders);
      } catch (error: any) {
        setError(error.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [userState.user?.id]);

  // Loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Spinner animation="border" role="status" className="text-primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Error message
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-500 text-white p-4 rounded shadow-md">
          {error}
        </div>
      </div>
    );
  }

  // Render order history
  return (
    <div className="w-full max-w-4xl bg-white rounded shadow-md p-6 mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b text-left">Order ID</th>
              <th className="py-2 px-4 border-b text-left">Service Name</th>
              <th className="py-2 px-4 border-b text-left">Description</th>
              <th className="py-2 px-4 border-b text-right">Price</th>
              <th className="py-2 px-4 border-b text-right">Total</th>
              <th className="py-2 px-4 border-b text-center">Status</th>
              <th className="py-2 px-4 border-b text-center">Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b text-left">{order._id}</td>
                <td className="py-2 px-4 border-b text-left">
                  {order.serviceName}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {order.description}
                </td>
                <td className="py-2 px-4 border-b text-right">
                  ${order.price.toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b text-right">
                  ${order.total.toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {order.status}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;
