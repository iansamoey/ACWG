// src/app/checkout/page.tsx

import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useCart } from '../../context/CartContext';

const Checkout: React.FC = () => {
  const { state } = useCart();
  const totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
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

        {/* PayPal Button */}
        <PayPalScriptProvider
          options={{
            "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
            currency: "USD",
          }}
        >
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Payment Options</h3>
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
              onApprove={(data: any, actions: any) => {
                return actions.order.capture().then((details: any) => {
                  alert('Transaction completed by ' + details.payer.name.given_name);
                  // Here you could also dispatch an action to save the order details in your database
                });
              }}
              onError={(err: any) => {
                console.error('PayPal Checkout onError', err);
                alert('An error occurred during the payment process.');
              }}
            />
          </div>
        </PayPalScriptProvider>

        
        
      </div>
    </div>
  );
};

export default Checkout;
