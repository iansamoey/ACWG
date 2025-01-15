"use client";

import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import OrderSummary from "@/components/OrderSummary";
import CartStatus from "@/components/CartStatus";
import Services from "@/app/services/page";
import OrderForm from "@/components/OrderForm";
import OrderHistory from "@/components/OrderHistory";
import ProfileUpdate from "@/components/ProfileUpdate";
import { withAuth } from '@/components/auth/with-auth';
import { useSession, signOut } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import { useCart } from "@/context/CartContext";
import { useRouter } from 'next/navigation';
import MessageSystem from "@/components/MessageSystem";

const UserDashboard: React.FC = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("order-summary");
  const [userName, setUserName] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { state: cartState } = useCart();
  const router = useRouter();
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (session?.user) {
      setUserName(session.user.name || session.user.email || "User");
    }
  }, [session]);

  const handleUnreadMessagesChange = useCallback((count: number) => {
    setUnreadMessages(count);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "order-summary":
        return <OrderSummary />;
      case "cart-status":
        return <CartStatus setActiveTab={setActiveTab} />;
      case "services":
        return <Services setActiveTab={setActiveTab} />;
      case "order-form":
        return <OrderForm />;
      case "order-history":
        return <OrderHistory />;
      case "profile-update":
        return <ProfileUpdate />;
      case "Messages":
        return <MessageSystem isAdmin={false} onUnreadMessagesChange={handleUnreadMessagesChange} />;
      default:
        return null;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const cartItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        setActiveTab={setActiveTab} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        cartItems={cartItems}
        onLogout={handleSignOut}
        session={session}
        closeSidebar={closeSidebar}
        unreadMessages={unreadMessages}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-semibold">User Dashboard</h1>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <h2 className="text-3xl font-bold mb-6">
            Welcome, {userName || ":)"}
          </h2>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default withAuth(UserDashboard);

