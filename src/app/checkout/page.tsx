'use client';

import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { useRouter } from 'next/navigation';

interface OrderDetails {
  userId: string | null;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  paymentStatus: string;
}

interface PayPalOrderData {
  orderID: string;
}

interface PayPalActions {
  order: {
    create: (data: Record<string, unknown>) => Promise<{ id: string }>;
    capture: () => Promise<{
      payer: {
        name: { given_name: string };
      };
    }>;
  };
}

const Checkout: React.FC = () => {
  const { state } = useCart();
  const { state: userState } = useUser();
  const router = useRouter();
  const totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleOrderSubmission = async (orderDetails: OrderDetails) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderDetails,
          paymentStatus: 'paid',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const data = await response.json();
      console.log('Order submitted successfully:', data);
      router.push('/dashboard/userDashboard');
    } catch (error: unknown) {
      console.error('Error submitting order:', error);
      alert('There was an error processing your order. Please try again.');
    }
  };

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

        <PayPalScriptProvider
          options={{
            "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
            currency: "USD",
          }}
        >
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Payment Options</h3>
            <PayPalButtons
              createOrder={(data: PayPalOrderData, actions: PayPalActions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: totalPrice.toFixed(2),
                    },
                  }],
                });
              }}
              onApprove={async (data: PayPalOrderData, actions: PayPalActions) => {
                const details = await actions.order.capture();
                
                const payerName = details.payer.name.given_name;
                alert('Transaction completed by ' + payerName);

                const orderDetails: OrderDetails = {
                  userId: userState.user ? userState.user.id : null,
                  items: state.items,
                  total: totalPrice,
                  paymentStatus: 'paid',
                };

                if (orderDetails.userId) {
                  await handleOrderSubmission(orderDetails);
                } else {
                  alert('User not authenticated. Please log in.');
                }
              }}
              onError={(err: Error) => {
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

