// src/components/OrderSummary.tsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types'; // Ensure this is imported

interface OrderSummaryProps {
  cartItems: CartItem[]; // Accept cartItems as a prop
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems }) => {
  const totalPrice = cartItems.reduce((total, item: CartItem) => total + item.price * item.quantity, 0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item: CartItem) => (
              <li key={item.id} className="flex justify-between border-b py-2">
                <span>{item.name} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold mt-4">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default OrderSummary;
