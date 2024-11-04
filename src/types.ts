// src/types.ts

export interface Order {
  _id: string;
  id: string; // Assuming `id` is a string
  title: string; // The title of the order
  status: string; // The status of the order (e.g., "pending", "completed")
  // Add any other fields that your Order model includes
}

export interface CartItem {
  id: string;      // The service ID
  name: string;    // The service name
  price: number;   // The price of the service
  quantity: number; // Quantity of the service
}

export interface User {
  _id: string; 
  id: string; // Ensure the id property is defined
  email: string;
  isAdmin?: boolean; // Optional if it's not always set
}