"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the type for your user state
export interface Request {
  id: string;
  description: string;
  status: string;
}

export interface User {
  id: string; // Use only one id field for simplicity
  email: string;
  isAdmin: boolean;
  requests: Request[]; // Include requests array
}

interface UserState {
  user: User | null; // User can be null until logged in
}

// Define action types for better type safety
type UserAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' };

interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<UserAction>; // Use UserAction type
}

// Initial state
const initialState: UserState = {
  user: null,
};

// Reducer function to manage user state
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload, // Set user on login
      };
    case 'LOGOUT':
      return { ...state, user: null }; // Reset user on logout
    default:
      return state;
  }
};

// Create the UserContext with the default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
