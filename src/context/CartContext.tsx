'use client'; // Add this line to indicate this is a client component

import React, { createContext, useReducer, useContext } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type Action =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string } // Assuming payload is the id of the item
  | { type: 'ADD_TO_CART'; payload: CartItem }; // Updated action type

const initialState: CartState = {
  items: [],
};

// Update the context type to include the removeFromCart function
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<Action>;
  removeFromCart: (id: string) => void; // Add removeFromCart to the type
}>({
  state: initialState,
  dispatch: () => null,
  removeFromCart: () => null, // Default implementation for type safety
});

const cartReducer = (state: CartState, action: Action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        items: [...state.items, action.payload], // Append the new item to the cart
      };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Function to remove an item from the cart
  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  return (
    <CartContext.Provider value={{ state, dispatch, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = () => {
  return useContext(CartContext);
};
