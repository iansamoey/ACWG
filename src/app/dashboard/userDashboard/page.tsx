"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Sidebar from "@/components/Sidebar";
import OrderSummary from "@/components/OrderSummary";
import CartStatus from "@/components/CartStatus";
import Services from "@/app/services/page";
import OrderForm from "@/components/OrderForm";
import OrderHistory from "@/components/OrderHistory";
import ProfileUpdate from "@/components/ProfileUpdate";
import { withAuth } from '@/components/auth/with-auth';
import { useSession } from 'next-auth/react';

const UserDashboard: React.FC = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("order-summary");
  const [userName, setUserName] = useState<string | null>(null);

  // Fetch user data if available
  useEffect(() => {
    if (session?.user) {
      setUserName(session.user.name || session.user.email || "User");
    }
  }, [session]);

  return (
    <div className="flex p-10">
      {/* Sidebar Component */}
      <Sidebar setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="ml-64 w-full">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {userName || ":)"}
        </h1>

        {/* Conditional Rendering for Different Tabs */}
        {activeTab === "order-summary" && <OrderSummary />}
        {activeTab === "cart-status" && <CartStatus />}
        {activeTab === "services" && <Services />}
        {activeTab === "order-form" && <OrderForm />}
        {activeTab === "order-history" && <OrderHistory />}
        {activeTab === "profile-update" && <ProfileUpdate />}
      </div>
    </div>
  );
};

export default withAuth(UserDashboard);

