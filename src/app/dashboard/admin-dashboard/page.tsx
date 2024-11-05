"use client"; 

import { useState } from "react";
import ManageUsers from "@/app/dashboard/manage-users/page";
import ManageContent from "@/app/dashboard/manage-content/page";
import ViewOrders from "@/app/dashboard/view-orders/page";
import CreateAdmin from "@/app/dashboard/create-admin/page"; // Import the CreateAdmin component
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
import { Users, FileText, ShoppingCart, LogOut } from "lucide-react"; // Import LogOut icon
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("ManageUsers");
  const router = useRouter(); // Initialize useRouter

  const renderContent = () => {
    switch (currentPage) {
      case "ManageUsers":
        return <ManageUsers />;
      case "ManageContent":
        return <ManageContent />;
      case "ViewOrders":
        return <ViewOrders />;
      case "CreateAdmin": // Add a case for the new CreateAdmin page
        return <CreateAdmin />;
      default:
        return null;
    }
  };

  const handleSignOut = () => {
    // Clear any user data if needed and redirect to the main page
    router.push('/'); // Redirect to the main page (src/app/page.tsx)
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
              {/* Add the new Create Admin menu item */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#" onClick={() => setCurrentPage("CreateAdmin")} className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Create Admin</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Add Sign Out menu item */}
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
