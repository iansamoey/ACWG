"use client";

import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";

interface SidebarProps {
  children: React.ReactNode;
  className?: string; // Added className prop
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
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className }) => (
  <div className={`w-64 h-full bg-gray-800 text-white fixed top-0 bottom-0 ${className}`}>
    {children}
  </div>
);

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

export const SidebarMenuButton: React.FC<SidebarMenuButtonProps> = ({ children, asChild }) => (
  <Slot>{children}</Slot>
);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex">{children}</div>
);
