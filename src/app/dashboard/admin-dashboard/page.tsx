"use client";

import { useState, useEffect } from "react";
import React from 'react';
import ManageUsers from "@/app/dashboard/manage-users/page";
import ManageContent from "@/app/dashboard/manage-content/page";
import ViewOrders from "@/app/dashboard/view-orders/page";
import CreateAdmin from "@/app/dashboard/create-admin/page";
import Sidebar from "@/components/Sidebar";
import { useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import { withAuth } from '@/components/auth/with-auth';
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';
import { useCart } from "@/context/CartContext";
import { Session } from "next-auth";

function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("ManageUsers");
  const router = useRouter();
  const { data: session } = useSession();
  const [userName, setUserName] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { state: cartState } = useCart();

  useEffect(() => {
    if (session?.user) {
      setUserName(session.user.name || session.user.email || "Admin");
    }
  }, [session]);

  const renderContent = () => {
    switch (currentPage) {
      case "ManageUsers":
        return <ManageUsers />;
      case "ManageContent":
        return <ManageContent />;
      case "ViewOrders":
        return <ViewOrders />;
      case "CreateAdmin":
        return <CreateAdmin />;
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
        setActiveTab={setCurrentPage} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        cartItems={cartItems}
        onLogout={handleSignOut}
        session={session as Session | null}
        closeSidebar={closeSidebar}
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
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
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
}

export default withAuth(AdminDashboard, { requireAdmin: true });

