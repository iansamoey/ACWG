"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Menu, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface SidebarProps {
  children: React.ReactNode
  className?: string
}

interface SidebarHeaderProps {
  children: React.ReactNode
  className?: string
}

interface SidebarContentProps {
  children: React.ReactNode
  className?: string
}

interface SidebarMenuProps {
  children: React.ReactNode
  className?: string
}

interface SidebarMenuItemProps {
  children: React.ReactNode
}

interface SidebarMenuButtonProps {
  children: React.ReactNode
  asChild?: boolean
  onClick?: () => void
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
          <div className={`h-full bg-gray-800 text-white ${className}`}>
            {children}
          </div>
        </SheetContent>
      </Sheet>
      <div className={`w-64 h-full bg-gray-800 text-white fixed top-0 bottom-0 hidden md:block ${className}`}>
        {children}
      </div>
    </>
  )
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ children, className }) => (
  <div className={`bg-gray-700 p-2 ${className}`}>{children}</div>
)

export const SidebarContent: React.FC<SidebarContentProps> = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
)

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ children, className }) => (
  <ul className={`space-y-2 ${className}`}>{children}</ul>
)

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ children }) => (
  <li>{children}</li>
)

export const SidebarMenuButton: React.FC<SidebarMenuButtonProps> = ({ children, asChild, onClick, className }) => {
  const Comp = asChild ? Slot : Button
  return (
    <Comp
      variant="ghost"
      className={cn("w-full justify-start text-white hover:text-white hover:bg-gray-700", className)}
      onClick={onClick}
    >
      {children}
    </Comp>
  )
}

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex">{children}</div>
)

interface DashboardSidebarProps {
  setActiveTab: (tab: string) => void
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ setActiveTab }) => {
  const { state: cartState } = useCart()
  const router = useRouter()
  const { data: session } = useSession()

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-xl font-bold">Dashboard</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setActiveTab('cart-status')}>
              <div className="flex items-center w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>View Cart Status</span>
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className={cn(
                      'ml-auto',
                      totalItems > 99 ? 'w-7' : 'w-5',
                    )}
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </Badge>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setActiveTab('order-summary')}>
              Order Summary
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setActiveTab('services')}>
              Services
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setActiveTab('order-form')}>
              Request a Service
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setActiveTab('order-history')}>
              Order History
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setActiveTab('profile-update')}>
              Profile Management
            </SidebarMenuButton>
          </SidebarMenuItem>
          {session && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="text-red-500 hover:text-red-400"
              >
                Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

