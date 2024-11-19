'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  setActiveTab: (tab: string) => void
}

export default function Component({ setActiveTab }: SidebarProps) {
  const { dispatch } = useUser()
  const { state: cartState } = useCart()
  const router = useRouter()

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    router.push('/')
  }

  const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="bg-gray-800 text-white h-full w-64 p-4 fixed top-0 left-0">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <ul className="space-y-2">
        <li>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:text-white hover:bg-gray-700"
            onClick={() => setActiveTab('cart-status')}
          >
            <div className="flex items-center w-full">
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>View Cart Status</span>
              {totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className={cn(
                    "ml-auto",
                    totalItems > 99 ? "w-7" : "w-5",
                  )}
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </Badge>
              )}
            </div>
          </Button>
        </li>

        <li>
          <Button 
            variant="ghost"
            className="w-full justify-start text-white hover:text-white hover:bg-gray-700"
            onClick={() => setActiveTab('order-summary')}
          >
            Order Summary
          </Button>
        </li>

        <li>
          <Button 
            variant="ghost"
            className="w-full justify-start text-white hover:text-white hover:bg-gray-700"
            onClick={() => setActiveTab('services')}
          >
            Services
          </Button>
        </li>

        <li>
          <Button 
            variant="ghost"
            className="w-full justify-start text-white hover:text-white hover:bg-gray-700"
            onClick={() => setActiveTab('order-form')}
          >
            Request a Service
          </Button>
        </li>

        <li>
          <Button 
            variant="ghost"
            className="w-full justify-start text-white hover:text-white hover:bg-gray-700"
            onClick={() => setActiveTab('order-history')}
          >
            Order History
          </Button>
        </li>

        <li>
          <Button 
            variant="ghost"
            className="w-full justify-start text-white hover:text-white hover:bg-gray-700"
            onClick={() => setActiveTab('profile-update')}
          >
            Profile Management
          </Button>
        </li>

        <li>
          <Button 
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-gray-700"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </li>
      </ul>
    </div>
  )
}