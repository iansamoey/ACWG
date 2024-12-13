import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Menu, Users, FileText, LogOut, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Session } from 'next-auth';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

interface SidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarMenuProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarMenuItemProps {
  children: React.ReactNode;
}

interface SidebarMenuButtonProps {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className, isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <>
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-50 md:hidden"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <DialogTitle asChild>
            <VisuallyHidden>Sidebar Navigation</VisuallyHidden>
          </DialogTitle>
          <div className={`h-full bg-gray-800 text-white ${className}`}>
            {children}
          </div>
        </SheetContent>
      </Sheet>
      <div className={`w-64 h-full bg-gray-800 text-white fixed top-0 bottom-0 left-0 transition-transform duration-300 ease-in-out transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${className}`}>
        {children}
      </div>
    </>
  );
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ children, className }) => (
  <div className={`bg-gray-700 p-2 ${className}`}>{children}</div>
);

export const SidebarContent: React.FC<SidebarContentProps> = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ children, className }) => (
  <ul className={`space-y-2 ${className}`}>{children}</ul>
);

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ children }) => (
  <li>{children}</li>
);

export const SidebarMenuButton: React.FC<SidebarMenuButtonProps> = ({ children, asChild, onClick, className }) => {
  const Comp = asChild ? Slot : Button;
  return (
    <Comp
      variant="ghost"
      className={cn("w-full justify-start text-white hover:text-white hover:bg-gray-700", className)}
      onClick={onClick}
    >
      {children}
    </Comp>
  );
}

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex">{children}</div>
);

interface DashboardSidebarProps {
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  session: Session | null;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  cartItems: number;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  setActiveTab, 
  onLogout, 
  session,
  isSidebarOpen,
  setIsSidebarOpen,
  cartItems
}) => {

  const handleLogout = () => {
    onLogout();
    setIsSidebarOpen(false);
  };

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
      <SidebarHeader>
        <h2 className="text-xl font-bold">{session?.user?.isAdmin ? 'Admin Dashboard' : 'Dashboard'}</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {session?.user?.isAdmin ? (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleSetActiveTab('ManageUsers')}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Manage Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleSetActiveTab('ManageContent')}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Manage Content</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleSetActiveTab('ViewOrders')}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>View Orders</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleSetActiveTab('CreateAdmin')}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Create Admin</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          ) : (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleSetActiveTab('cart-status')}>
                  <div className="flex items-center w-full">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>View Cart Status</span>
                    {cartItems > 0 && (
                      <Badge
                        variant="destructive"
                        className={cn(
                          'ml-auto',
                          cartItems > 99 ? 'w-7' : 'w-5',
                        )}
                      >
                        {cartItems > 99 ? '99+' : cartItems}
                      </Badge>
                    )}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleSetActiveTab('order-summary')}>
                  Order Summary
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleSetActiveTab('services')}>
                  Services
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleSetActiveTab('order-form')}>
                  Request a Service
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleSetActiveTab('order-history')}>
                  Order History
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleSetActiveTab('profile-update')}>
                  Profile Management
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
          {session && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="text-red-500 hover:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
