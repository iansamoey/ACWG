// src/components/OrderSummary.tsx

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types'; 
import { PayPalButtons } from '@paypal/react-paypal-js';

const OrderSummary: React.FC<{ cartItems: CartItem[] }> = ({ cartItems }) => {
  const { state } = useCart();
  const router = useRouter();

  const totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleProceedToCardPayment = () => {
    router.push('/card-payment'); 
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
      {state.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {state.items.map(item => (
              <li key={item.id} className="flex justify-between border-b py-2">
                <span>{item.name} (x{item.quantity})</span>
                <span>${item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold mt-4">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}
      <div className="mt-4">
        <PayPalButtons
          createOrder={(data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: totalPrice.toFixed(2),
                },
              }],
            });
          }}
          onApprove={async (data: any, actions: any) => {
            const details = await actions.order.capture();
            console.log('Transaction completed by ' + details.payer.name.given_name);
            // Add logic here to save the order to your database
          }}
          onError={(err: any) => {
            console.error('PayPal Checkout Error', err);
          }}
        />
        <button onClick={handleProceedToCardPayment} className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Pay with Card
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
