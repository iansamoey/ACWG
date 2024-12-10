"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

export interface Request {
  id: string;
  description: string;
  status: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  requests: Request[];
}

interface UserState {
  user: User | null;
  loading: boolean;
}

type UserAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean };

interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
}

const initialState: UserState = {
  user: null,
  loading: true,
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'CLEAR_USER':
      return { ...state, user: null, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      dispatch({ type: 'SET_LOADING', payload: true });
    } else if (status === 'authenticated' && session?.user) {
      dispatch({
        type: 'SET_USER',
        payload: {
          id: session.user.id as string,
          username: session.user.name as string,
          email: session.user.email as string,
          isAdmin: session.user.isAdmin as boolean,
          requests: [], // You might want to fetch this data separately
        },
      });
    } else {
      dispatch({ type: 'CLEAR_USER' });
    }
  }, [session, status]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

