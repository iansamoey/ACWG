import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const CartStatus: React.FC = () => {
  const { state: cartState, removeFromCart } = useCart();
  const router = useRouter();

  const handleProceedToCheckout = async () => {
    const total = cartState.items.reduce((total, item) => total + item.price * item.quantity, 0);
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartState.items,
          total,
        }),
      });

      if (response.ok) {
        // Clear the cart or redirect to order summary
        // Here you might want to clear the cart or redirect
        router.push('/OrderSummary'); // Redirect to OrderSummary page
      } else {
        console.error('Failed to create order:', await response.json());
      }
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Cart Status</h2>
      {cartState.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cartState.items.map((item) => (
              <li key={item.id} className="flex justify-between border-b py-2">
                <span>{item.name} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <button
                  onClick={() => removeFromCart(item.id)} // Add button to remove item
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 font-bold">
            Total: ${cartState.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
          </div>
          <button onClick={handleProceedToCheckout} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartStatus;
