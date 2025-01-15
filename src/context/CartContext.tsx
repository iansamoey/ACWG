'use client';

import React, { createContext, useReducer, useContext, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  pages: number;
  title: string;
  totalWords?: number;
  attachment?: string;
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
  | { type: 'UPDATE_ITEM_TITLE'; payload: { id: string; title: string } }
  | { type: 'UPDATE_ITEM_TOTAL_WORDS'; payload: { id: string; totalWords: number } }
  | { type: 'UPDATE_ITEM_ATTACHMENT'; payload: { id: string; attachment: string } }
  | { type: 'LOAD_CART'; payload: CartItem[] };

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
  updateItemTotalWords: (id: string, totalWords: number) => void;
  updateItemAttachment: (id: string, attachment: string) => void;
}>({
  state: initialState,
  dispatch: () => null,
  removeFromCart: () => null,
  clearCart: () => null,
  updateItemPages: () => null,
  updateItemTitle: () => null,
  updateItemTotalWords: () => null,
  updateItemAttachment: () => null,
});

const cartReducer = (state: CartState, action: Action) => {
  let newState: CartState;
  switch (action.type) {
    case 'ADD_ITEM':
    case 'ADD_TO_CART': {
      // Generate a unique ID for each item added to the cart
      const newItemId = `${action.payload.id}-${Date.now()}`;
      const newItem = { ...action.payload, id: newItemId };
      newState = {
        ...state,
        items: [...state.items, newItem],
      };
      break;
    }
    case 'REMOVE_ITEM':
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
      break;
    case 'CLEAR_CART':
      newState = {
        ...state,
        items: [],
      };
      break;
    case 'UPDATE_ITEM_PAGES':
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, pages: action.payload.pages, price: (item.price / item.pages) * action.payload.pages }
            : item
        ),
      };
      break;
    case 'UPDATE_ITEM_TITLE':
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, title: action.payload.title }
            : item
        ),
      };
      break;
    case 'UPDATE_ITEM_TOTAL_WORDS':
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, totalWords: action.payload.totalWords }
            : item
        ),
      };
      break;
    case 'UPDATE_ITEM_ATTACHMENT':
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, attachment: action.payload.attachment }
            : item
        ),
      };
      break;
    case 'LOAD_CART':
      newState = {
        ...state,
        items: action.payload,
      };
      break;
    default:
      return state;
  }
  localStorage.setItem('cart', JSON.stringify(newState.items));
  return newState;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

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

  const updateItemTotalWords = (id: string, totalWords: number) => {
    dispatch({ type: 'UPDATE_ITEM_TOTAL_WORDS', payload: { id, totalWords } });
  };

  const updateItemAttachment = (id: string, attachment: string) => {
    dispatch({ type: 'UPDATE_ITEM_ATTACHMENT', payload: { id, attachment } });
  };

  return (
    <CartContext.Provider value={{ state, dispatch, removeFromCart, clearCart, updateItemPages, updateItemTitle, updateItemTotalWords, updateItemAttachment }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};

