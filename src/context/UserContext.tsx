"use client"; // Mark this file as a client component

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the type for your user state
export interface Request {
  id: string;
  description: string;
  status: string; // You can adjust these fields as necessary
}

export interface User {
  id: string; // Added this line to include the id field derived from _id
  _id: string; // Make sure _id is included for MongoDB compatibility
  email: string; // Add any other properties you want
  isAdmin: boolean; // Add admin property if applicable
  requests: Request[]; // Include requests array
}

interface UserState {
  user: User | null; // Make user nullable
}

// Define the context type
interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<any>; // Replace `any` with the actual action type if possible
}

// Default state
const initialState: UserState = {
  user: null,
};

// Create context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Reducer to manage user state
const userReducer = (state: UserState, action: any): UserState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: { ...action.payload, id: action.payload._id }, // Set user on login with derived id
      };
    case 'LOGOUT':
      return { ...state, user: null }; // Reset user state on logout
    default:
      return state;
  }
};

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
