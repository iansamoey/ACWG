"use client";

import { useEffect, useState, useCallback } from "react"
import { useUser } from "@/context/UserContext"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Attachment {
  filename: string;
  path: string;
}

interface Order {
  _id: string
  userId: string
  serviceName: string
  description: string
  price: number
  total: number
  status: string
  createdAt: Date
  attachments: Attachment[]
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

  const fetchUserOrders = useCallback(async () => {
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
  }, [userState.user?.id])

  useEffect(() => {
    fetchUserOrders()
  }, [fetchUserOrders])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (userState.user?.id) {
        fetchUserOrders()
      }
    }, 30000)

    return () => clearInterval(intervalId)
  }, [userState.user?.id, fetchUserOrders])

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
    <Card className="w-full max-w-6xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
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
                <TableHead className="text-center">Attachments</TableHead>
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
                  <TableCell className="text-center">
                    {order.attachments && order.attachments.length > 0 ? (
                      order.attachments.map((attachment, index) => (
                        <Button
                          key={index}
                          variant="link"
                          className="p-0 h-auto font-normal"
                          onClick={() => window.open(attachment.path, '_blank')}
                        >
                          {attachment.filename}
                        </Button>
                      ))
                    ) : (
                      "No attachments"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}