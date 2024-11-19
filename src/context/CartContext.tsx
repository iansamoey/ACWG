'use client';

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
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'CLEAR_CART' }; // New action type for clearing the cart

const initialState: CartState = {
  items: [],
};

// Update the context type to include the clearCart function
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<Action>;
  removeFromCart: (id: string) => void;
  clearCart: () => void; // Add clearCart to the type
}>({
  state: initialState,
  dispatch: () => null,
  removeFromCart: () => null,
  clearCart: () => null, // Default implementation for type safety
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
        items: [...state.items, action.payload],
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [], // Clear all items from the cart
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

  // Function to clear the entire cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, dispatch, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = () => {
  return useContext(CartContext);
};