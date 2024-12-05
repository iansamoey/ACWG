'use client';

import React, { createContext, useReducer, useContext } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  pages: number;
  title: string;
}

interface CartState {
  items: CartItem[];
}

type Action =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_ITEM_PAGES'; payload: { id: string; pages: number } }
  | { type: 'UPDATE_ITEM_TITLE'; payload: { id: string; title: string } };

const initialState: CartState = {
  items: [],
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<Action>;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateItemPages: (id: string, pages: number) => void;
  updateItemTitle: (id: string, title: string) => void;
}>({
  state: initialState,
  dispatch: () => null,
  removeFromCart: () => null,
  clearCart: () => null,
  updateItemPages: () => null,
  updateItemTitle: () => null,
});

const cartReducer = (state: CartState, action: Action) => {
  switch (action.type) {
    case 'ADD_ITEM':
    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
          pages: action.payload.pages,
          price: action.payload.price,
          title: action.payload.title,
        };
        return { ...state, items: updatedItems };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    case 'UPDATE_ITEM_PAGES':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, pages: action.payload.pages, price: (item.price / item.pages) * action.payload.pages }
            : item
        ),
      };
    case 'UPDATE_ITEM_TITLE':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, title: action.payload.title }
            : item
        ),
      };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const updateItemPages = (id: string, pages: number) => {
    dispatch({ type: 'UPDATE_ITEM_PAGES', payload: { id, pages } });
  };

  const updateItemTitle = (id: string, title: string) => {
    dispatch({ type: 'UPDATE_ITEM_TITLE', payload: { id, title } });
  };

  return (
    <CartContext.Provider value={{ state, dispatch, removeFromCart, clearCart, updateItemPages, updateItemTitle }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};

