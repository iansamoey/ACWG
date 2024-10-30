// src/app/dashboard/userDashboard/page.tsx

"use client";

import React from 'react';
import { useUser } from '../../../context/UserContext';
import { useCart } from '../../../context/CartContext';
import OrderSummary from '../../../components/OrderSummary'; // Adjust the import path as needed
import Sidebar from '../../../components/Sidebar'; // Import the Sidebar component

const UserDashboard: React.FC = () => {
  const { state: userState } = useUser();
  const { state: cartState } = useCart();

  return (
    <div className="flex p-10">
      <Sidebar /> {/* Render the Sidebar component here */}
      <div className="ml-64 w-full"> {/* Add left margin to accommodate the sidebar */}
        <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
        <OrderSummary cartItems={cartState.items} /> {/* Pass cartItems to OrderSummary */}
        <div>
          <h2 className="text-2xl font-semibold mt-6">Your Requests</h2>
          <p>{userState.user?.requests.length || 0} requests found.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
