'use client'

import { useEffect, useState } from "react"
import { useUser } from "@/context/UserContext"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface Order {
  _id: string
  userId: string
  serviceName: string
  description: string
  price: number
  total: number
  status: string
  createdAt: Date
}

const statusColors = {
  pending: "bg-yellow-200 text-yellow-800",
  "in-progress": "bg-blue-200 text-blue-800",
  completed: "bg-green-200 text-green-800",
  cancelled: "bg-red-200 text-red-800",
}

export default function OrderHistory() {
  const { state: userState } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserOrders = async () => {
    try {
      const userId = userState.user?.id

      if (!userId) {
        setError("User ID not found")
        setLoading(false)
        return
      }

      const response = await fetch(`/api/orders/user/${userId}`)
      if (!response.ok) throw new Error("Failed to fetch order history")

      const ordersData: Order[] = await response.json()
      const sortedOrders = ordersData.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setOrders(sortedOrders)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchUserOrders()
  }, [userState.user?.id])

  // Polling for updates every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (userState.user?.id) {
        fetchUserOrders()
      }
    }, 30000)

    return () => clearInterval(intervalId)
  }, [userState.user?.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-mono">{order._id}</TableCell>
                <TableCell>{order.serviceName}</TableCell>
                <TableCell>{order.description}</TableCell>
                <TableCell className="text-right">
                  ${order.price && !isNaN(order.price) ? order.price.toFixed(2) : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  ${order.total && !isNaN(order.total) ? order.total.toFixed(2) : "N/A"}
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}