// src/components/ServiceItem.tsx

import React from 'react';
import { useCart } from '../context/CartContext';

interface ServiceItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ id, name, description, price }) => {
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({
      type: 'ADD_TO_CART', // Use the new action type
      payload: {
        id,
        name,
        price,
        quantity: 1,
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      <p>{description}</p>
      <p className="mt-2 text-lg font-semibold">${price}</p>
      <button
        onClick={addToCart}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ServiceItem;
