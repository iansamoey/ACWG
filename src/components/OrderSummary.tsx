import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types';
import { PayPalButtons } from '@paypal/react-paypal-js';

// Define custom types based on PayPal SDK structure
type CreateOrderData = Record<string, unknown>;
type OnApproveData = { orderID: string };
type OnApproveActions = { order: { capture: () => Promise<any> } };
type CreateOrderActions = { order: { create: (orderDetails: any) => Promise<string> } };

const OrderSummary: React.FC<{ cartItems: CartItem[] }> = ({ cartItems }) => {
  const { state } = useCart();
  const router = useRouter();

  const totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

  const userId = 'currentUserId'; // Replace with actual userId from session/context

  const handleProceedToCardPayment = () => {
    router.push('/card-payment');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
      {/* Render cart items */}
      <div className="mt-4">
        <PayPalButtons
          createOrder={(data: CreateOrderData, actions: CreateOrderActions) => {
            return actions.order.create({
              purchase_units: [{
                amount: { value: totalPrice.toFixed(2) },
              }],
            });
          }}
          onApprove={async (data: OnApproveData, actions: OnApproveActions) => {
            const details = await actions.order.capture();

            // Save order in the database
            await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId,  // Include userId
                service: 'Service Name Here',  // Customize as needed
                date: new Date().toISOString(),
                details: 'Order details from cart',
                total: totalPrice,
              }),
            });

            console.log('Transaction completed by ' + details.payer.name.given_name);
          }}
          onError={(err: unknown) => console.error('PayPal Checkout Error', err)}
        />
        <button onClick={handleProceedToCardPayment} className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Pay with Card
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
