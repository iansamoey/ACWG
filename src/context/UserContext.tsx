"use client"; // Mark this file as a client component

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the type for your user state
export interface Request {
  id: string;
  description: string;
  status: string; // You can adjust these fields as necessary
}

export interface User {
  _id: string; // Make sure _id is included
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

const userReducer = (state: UserState, action: any): UserState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload }; // Set user on login
    case 'LOGOUT':
      return { ...state, user: null }; // Reset user state on logout
    default:
      return state;
  }
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

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
