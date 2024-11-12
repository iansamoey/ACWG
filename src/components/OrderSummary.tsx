import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { PayPalButtons } from '@paypal/react-paypal-js';

const OrderSummary: React.FC = () => {
  const { state } = useCart();
  const router = useRouter();

  // Calculate total price from cart items
  const totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // Replace with actual userId from session/context
  const userId = 'currentUserId'; 

  const handleProceedToCardPayment = () => {
    router.push('/card-payment');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
      <ul>
        {state.items.map((item) => (
          <li key={item.id} className="flex justify-between border-b py-2">
            <span>{item.name} (x{item.quantity})</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 font-bold">Total: ${totalPrice.toFixed(2)}</div>

      <div className="mt-4">
        <PayPalButtons
          createOrder={(data: Record<string, unknown>, actions: { order: { create: (orderDetails: any) => Promise<string> } }) => {
            return actions.order.create({
              purchase_units: [{
                amount: { value: totalPrice.toFixed(2) },
              }],
            });
          }}
          onApprove={async (data: { orderID: string }, actions: { order: { capture: () => Promise<any> } }) => {
            const details = await actions.order.capture();

            // Create the order in your database after capturing payment
            await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId, // Use the actual user ID
                items: state.items, // Send all items in the cart
                total: totalPrice, // Total price
                createdAt: new Date().toISOString(),
                status: 'Completed', // Adjust as needed
              }),
            });

            console.log('Transaction completed by ' + details.payer.name.given_name);
          }}
          onError={(err: unknown) => console.error('PayPal Checkout Error', err)}
        />
      </div>

      
    </div>
  );
};

export default OrderSummary;