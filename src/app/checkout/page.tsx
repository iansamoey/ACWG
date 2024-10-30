// src/app/checkout/page.tsx
"use client";

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import OrderSummary from '../../components/OrderSummary';
import { CartItem } from '../../types';

const Checkout: React.FC = () => {
  const { state: cartState } = useCart();
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Checkout details:", billingInfo);
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-semibold mb-6">Checkout</h1>
      <OrderSummary cartItems={cartState.items} /> {/* Pass the cartItems prop */}
      <form onSubmit={handleCheckout} className="mt-6">
        {/* Billing information inputs here */}
      </form>
    </div>
  );
};

export default Checkout;
