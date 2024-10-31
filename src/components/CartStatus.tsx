import React from 'react';
import { useCart } from '../context/CartContext';

const CartStatus: React.FC = () => {
  const { state: cartState } = useCart();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Cart Status</h2>
      {cartState.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartState.items.map((item) => (
            <li key={item.id} className="flex justify-between border-b py-2">
              <span>{item.name} (x{item.quantity})</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 font-bold">
        Total: ${cartState.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
      </div>
    </div>
  );
};

export default CartStatus;
