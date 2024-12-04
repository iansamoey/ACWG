"use client";

import { useState, useEffect } from "react";
import React from 'react';
import { useUser } from "@/context/UserContext";
import ManageUsers from "@/app/dashboard/manage-users/page";
import ManageContent from "@/app/dashboard/manage-content/page";
import ViewOrders from "@/app/dashboard/view-orders/page";
import CreateAdmin from "@/app/dashboard/create-admin/page";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Users, FileText, ShoppingCart, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import { withAuth } from '@/components/auth/with-auth';

function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("ManageUsers");
  const router = useRouter();
  const { data: session } = useSession();
  const { state: userState } = useUser();
  const [userName, setUserName] = useState<string | null>(null);

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

  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar className="fixed left-0 top-0 h-full z-10">
          <SidebarHeader className="p-4">
            <h2 className="text-xl font-bold">Admin Menu</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#" onClick={() => setCurrentPage("ManageUsers")} className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Manage Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#" onClick={() => setCurrentPage("ManageContent")} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Manage Content</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#" onClick={() => setCurrentPage("ViewOrders")} className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>View Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#" onClick={() => setCurrentPage("CreateAdmin")} className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Create Admin</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {session && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button 
                      onClick={handleSignOut} 
                      className="flex items-center gap-2 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 ml-64 p-4 min-h-screen flex flex-col items-start justify-start relative z-0">
          <h1 className="text-3xl font-bold mb-4">
            Welcome, {userName || ":)"}
          </h1>
          {renderContent()}
        </div>
      </div>
    </SidebarProvider>
  );
}

export default withAuth(AdminDashboard, { requireAdmin: true });

