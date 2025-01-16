"use client";

import React from 'react';
import { DashboardSidebar } from '@/components/ui/sidebar';
import { Session } from 'next-auth';

interface SidebarProps {
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  cartItems: number;
  onLogout: () => void;
  session: Session | null;
  closeSidebar: () => void;
}

export default function Sidebar({ 
  setActiveTab, 
  isSidebarOpen, 
  setIsSidebarOpen, 
  cartItems, 
  onLogout, 
  session,
  closeSidebar
}: SidebarProps) {
  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    closeSidebar();
  };

  return (
    <DashboardSidebar 
      setActiveTab={handleSetActiveTab}
      isSidebarOpen={isSidebarOpen} 
      setIsSidebarOpen={setIsSidebarOpen}
      cartItems={cartItems}
      onLogout={onLogout}
      session={session}
    />
  );
}

