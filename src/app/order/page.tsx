// src/app/order/page.tsx

"use client";
import React, { useState } from 'react';

export default function Order() {
  const [service, setService] = useState('Essay Writing');
  const [details, setDetails] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userId = "some-user-id"; // Replace with actual user ID from context/session
    const items = [
      {
        id: "1", // Sample item ID
        name: service,
        price: 50,
        quantity: 1,
      },
    ];

    const order = {
      userId,
      items,
      total: 50, // Calculate total based on items
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const data = await response.json();
      console.log('Order submitted successfully:', data);
      setSuccessMessage('Order submitted successfully!');
      setError(null); // Reset error state on success

      setService('Essay Writing');
      setDetails('');
      setDeadline('');
    } catch (error: any) {
      console.error('Error submitting order:', error);
      setError(error.message || 'An error occurred while submitting the order.');
      setSuccessMessage(null); // Reset success message on error
    }
  };

  return (
    <div className="p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-semibold mb-4 text-center">Place Your Order</h1>
      <form className="max-w-lg mx-auto mt-6 bg-gray-100 p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Service</label>
          <select 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" 
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option>Essay Writing</option>
            <option>Research Paper</option>
            <option>Dissertation</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Details</label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={4}
            placeholder="Describe your requirements..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Deadline</label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit Order
        </button>
        {error && <div className="mt-4 text-red-600">{error}</div>}
        {successMessage && <div className="mt-4 text-green-600">{successMessage}</div>}
      </form>
    </div>
  );
}
