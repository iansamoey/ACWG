"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import Sidebar from "@/components/Sidebar";
import OrderSummary from "@/components/OrderSummary";
import OrderStatus from "@/components/OrderStatus";
import CartStatus from "@/components/CartStatus";
import Services from "@/app/services/page";
import OrderForm from "@/components/OrderForm";
import OrderHistory from "@/components/OrderHistory";
import ProfileUpdate from "@/components/ProfileUpdate";

const UserDashboard: React.FC = () => {
  const { state: userState } = useUser();
  const [activeTab, setActiveTab] = useState("order-summary");

  return (
    <div className="flex p-10">
      <Sidebar setActiveTab={setActiveTab} />
      <div className="ml-64 w-full">
        <h1 className="text-3xl font-bold mb-4">Welcome, {userState.user?.email}</h1>
        {activeTab === "order-summary" && <OrderSummary />}
        {activeTab === "order-status" && <OrderStatus />}
        {activeTab === "cart-status" && <CartStatus />}
        {activeTab === "services" && <Services />}
        {activeTab === "order-form" && <OrderForm />}
        {activeTab === "order-history" && <OrderHistory />}
        {activeTab === "profile-update" && <ProfileUpdate />}
      </div>
    </div>
  );
};

export default UserDashboard;
