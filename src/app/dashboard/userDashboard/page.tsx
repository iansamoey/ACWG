"use client";

import React, { useState } from 'react';
import { useUser } from '../../../context/UserContext';
import { useCart } from '../../../context/CartContext';
import OrderSummary from '../../../components/OrderSummary';
import Sidebar from '../../../components/Sidebar';
import OrderStatus from '@/components/OrderStatus';
import CartStatus from '@/components/CartStatus';
import Services from '../../../app/services/page';
import OrderForm from '@/components/OrderForm'; // Import the OrderForm component

const UserDashboard: React.FC = () => {
  const { state: userState } = useUser();
  const { state: cartState } = useCart();
  const [activeTab, setActiveTab] = useState('order-summary');

  // Extract user details (only email)
  const userEmail = userState.user?.email || 'User';

  return (
    <div className="flex p-10">
      <Sidebar setActiveTab={setActiveTab} />
      <div className="ml-64 w-full">
        <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
        
        {/* Conditional Rendering for Content Based on Selected Tab */}
        {activeTab === 'order-summary' && <OrderSummary />}
        {activeTab === 'order-status' && <OrderStatus />}
        {activeTab === 'cart-status' && <CartStatus />}
        {activeTab === 'services' && <Services />}
        {activeTab === 'order-form' && <OrderForm />} {/* Render OrderForm when activeTab is 'order-form' */}
      </div>
    </div>
  );
};

export default UserDashboard;
