"use client";

import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

const OrderForm: React.FC = () => {
  const { state } = useUser();
  const { user } = state;
  const router = useRouter();

  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to submit an order');
      return;
    }

    // Construct the orderData with the required fields
    const orderData = {
      userId: user.id,
      items: [{ serviceName, description, price }],
      total: price, // or calculate total as needed
    };

    const response = await fetch(`/api/orders/user/${user.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      alert('Order submitted successfully');
      // Navigate back to the user dashboard
      router.push('/dashboard/userDashboard');
    } else {
      alert('Error submitting order');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Request a Service</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">Service Name</label>
          <input
            id="serviceName"
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="Enter the service name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a brief description"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Enter the price"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
