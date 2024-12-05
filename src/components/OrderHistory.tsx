"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Order {
  _id: string;
  serviceName: string;
  description: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface OrdersResponse {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  totalOrders: number;
}

const OrderHistory: React.FC = () => {
  const { data: session, status } = useSession();
  const [ordersData, setOrdersData] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserOrders = useCallback(async (page: number) => {
    if (status !== 'authenticated' || !session?.user?.id) {
      setError("You must be logged in to view order history");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/orders/user/${session.user.id}?page=${page}&limit=10`);
      if (!response.ok) throw new Error("Failed to fetch order history");

      const data: OrdersResponse = await response.json();
      setOrdersData(data);
      setError(null);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      setOrdersData(null);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, status]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserOrders(currentPage);
    }
  }, [fetchUserOrders, currentPage, status]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserOrders(currentPage);
    setRefreshing(false);
  };

  if (status === 'loading' || loading) {
    return <Spinner />;
  }

  if (status === 'unauthenticated') {
    return (
      <Alert variant="destructive">
        <AlertDescription>You must be logged in to view order history.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto my-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Order History</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!ordersData || ordersData.orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersData.orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.serviceName}</TableCell>
                    <TableCell>{order.description}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {ordersData.totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="mx-4">Page {ordersData.currentPage} of {ordersData.totalPages}</span>
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, ordersData.totalPages))}
                  disabled={currentPage === ordersData.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderHistory;

