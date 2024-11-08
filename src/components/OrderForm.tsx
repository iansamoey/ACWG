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
    <div>
      <h2>Request a Service</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder="Service Name"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Price"
          required
        />
        <button type="submit">Submit Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
