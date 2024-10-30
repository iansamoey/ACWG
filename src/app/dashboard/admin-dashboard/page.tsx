"use client";

import { useState } from "react";
import ManageUsers from "@/app/dashboard/manage-users/page";
import ManageContent from "@/app/dashboard/manage-content/page";
import ViewOrders from "@/app/dashboard/view-orders/page";
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
import { Users, FileText, ShoppingCart } from "lucide-react";

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("ManageUsers");

  const renderContent = () => {
    switch (currentPage) {
      case "ManageUsers":
        return <ManageUsers />;
      case "ManageContent":
        return <ManageContent />;
      case "ViewOrders":
        return <ViewOrders />;
      default:
        return null;
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
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 ml-64 p-4 min-h-screen flex items-center justify-center relative z-0">
          {renderContent()}
        </div>
      </div>
    </SidebarProvider>
  );
}
