import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useCart } from '../context/CartContext';
import { CartItem } from '../types'; // Ensure CartItem is imported
import { PayPalButtons } from '@paypal/react-paypal-js'; // Import PayPalButtons

const OrderSummary: React.FC<{ cartItems: CartItem[] }> = ({ cartItems }) => {
  const { state } = useCart();
  const router = useRouter(); // Initialize useRouter

  const totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleProceedToCardPayment = () => {
    router.push('/card-payment'); // Navigate to debit/credit card payment interface
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
        {/* PayPal Buttons */}
        <PayPalButtons
          createOrder={(data: any, actions: any) => {  // Use 'any' for actions
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: totalPrice.toFixed(2),
                },
              }],
            });
          }}
          onApprove={async (data: any, actions: any) => {  // Use 'any' for actions
            const details = await actions.order.capture();
            console.log('Transaction completed by ' + details.payer.name.given_name);
            // Add any additional logic here (like updating the order in your database)
            // Optionally redirect or display a success message
          }}
          onError={(err: any) => {  // Use 'any' for error
            console.error('PayPal Checkout Error', err);
            // Handle error
          }}
        />
        
      </div>
    </div>
  );
};

export default OrderSummary;
