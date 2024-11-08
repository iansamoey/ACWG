"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap"; // Importing a spinner for better UX

interface Order {
  _id: string;
  userId: string;
  serviceName: string;
  description: string;
  price: number;
  total: number;
  status: string;
  createdAt: Date;
  user?: {
    username: string;
    email: string;
  };
}

const ViewOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders and user details
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const ordersData: Order[] = await response.json();

        // Fetch user details for each order based on userId
        const ordersWithUserDetails = await Promise.all(
          ordersData.map(async (order) => {
            try {
              const userResponse = await fetch(`/api/users/${order.userId}`);
              if (userResponse.ok) {
                const userData = await userResponse.json();
                return {
                  ...order,
                  user: {
                    username: userData.username,
                    email: userData.email,
                  },
                };
              }
            } catch (userError) {
              console.error("Error fetching user details:", userError);
            }
            return order; // Return order without user details if fetching fails
          })
        );

        setOrders(ordersWithUserDetails);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Spinner animation="border" />
      </div>
    );
  }

  // Error message
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-500 text-white p-4 rounded">{error}</div>
      </div>
    );
  }

  // Render orders
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl bg-white rounded shadow-md p-6 ml-80">
        <h1 className="text-2xl font-bold mb-4">View Orders</h1>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">User Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Service Name</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Total</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{order._id}</td>
                <td className="py-2 px-4 border-b">
                  {order.user?.username || "N/A"}
                </td>
                <td className="py-2 px-4 border-b">
                  {order.user?.email || "N/A"}
                </td>
                <td className="py-2 px-4 border-b">{order.serviceName}</td>
                <td className="py-2 px-4 border-b">{order.description}</td>
                <td className="py-2 px-4 border-b">
                  ${order.price ? order.price.toFixed(2) : "0.00"}
                </td>
                <td className="py-2 px-4 border-b">
                  ${order.total ? order.total.toFixed(2) : "0.00"}
                </td>
                <td className="py-2 px-4 border-b">{order.status}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewOrders;
