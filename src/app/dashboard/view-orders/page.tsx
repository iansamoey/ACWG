// src/app/dashboard/view-orders/page.tsx

"use client";

import React from "react";

const ViewOrders: React.FC = () => {
  // Sample orders data
  const orders = [
    { id: 1, customer: "John Doe", status: "Completed", total: "$100" },
    { id: 2, customer: "Jane Smith", status: "Pending", total: "$150" },
    { id: 3, customer: "Bob Johnson", status: "Shipped", total: "$200" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded shadow-md p-6 ml-80"> {/* Add left margin */}
        <h1 className="text-2xl font-bold mb-4">View Orders</h1>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-2 px-4 border-b">{order.id}</td>
                <td className="py-2 px-4 border-b">{order.customer}</td>
                <td className="py-2 px-4 border-b">{order.status}</td>
                <td className="py-2 px-4 border-b">{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewOrders;
