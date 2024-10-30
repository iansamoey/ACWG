// src/context/UserContext.tsx
"use client"; // Mark this file as a client component

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the type for your user state
interface User {
  id: string; // or number, depending on your actual structure
  name: string;
  requests: any[]; // Adjust this to your request structure
}

interface UserState {
  user: User | null; // Make user nullable
}

// Define the context type
interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<any>; // Replace `any` with the actual action type
}

// Default state
const initialState: UserState = {
  user: null,
};

// Create context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

const userReducer = (state: UserState, action: any): UserState => {
  switch (action.type) {
    // Define your cases
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
