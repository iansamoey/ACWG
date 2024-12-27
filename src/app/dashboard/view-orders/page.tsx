"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSupabaseStorage } from '@/lib/supabase-hooks';

interface Attachment {
  filename: string;
  path: string;
}

interface UserDetails {
  username: string;
  email: string;
}

interface Order {
  _id: string;
  userId: string;
  serviceName: string;
  description: string;
  price: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: Date;
  attachments: Attachment[];
  userDetails: UserDetails;
  paypalOrderId: string;
  paypalTransactionId: string;
  pages: number;
  totalWords: number;
}

const statusColors = {
  pending: "bg-yellow-200 text-yellow-800",
  "in-progress": "bg-blue-200 text-blue-800",
  completed: "bg-green-200 text-green-800",
  cancelled: "bg-red-200 text-red-800",
};

const paymentStatusColors: { [key: string]: string } = {
  paid: "bg-green-200 text-green-800",
  unpaid: "bg-yellow-200 text-yellow-800",
};

const AttachmentList: React.FC<{ attachments: Attachment[] }> = ({ attachments }) => {
  return (
    <div className="flex flex-col space-y-1">
      {attachments.map((attachment, index) => {
        const { publicUrl, error } = useSupabaseStorage('attachments', attachment.filename);
        return (
          <div key={index}>
            {publicUrl ? (
              <Button
                variant="link"
                className="p-0 h-auto font-normal text-left"
                onClick={() => window.open(publicUrl, '_blank')}
              >
                {attachment.filename}
              </Button>
            ) : (
              <span>{attachment.filename}</span>
            )}
            {error && <p className="text-red-500 text-sm">Error: {error.message}</p>}
          </div>
        );
      })}
    </div>
  );
};

export default function ViewOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const ordersData: Order[] = await response.json();
      setOrders(ordersData);
    } catch (error) {
      console.error("Error in fetchOrders:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  }, []);

  const filteredOrders = useMemo(() => 
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter),
    [orders, statusFilter]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-7xl mx-auto my-8">
      <CardHeader>
        <CardTitle>View Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Service Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Total Words</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>PayPal Order ID</TableHead>
                <TableHead>PayPal Transaction ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Attachments</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono">{order._id}</TableCell>
                  <TableCell>{order.userDetails?.username || "N/A"}</TableCell>
                  <TableCell>{order.userDetails?.email || "N/A"}</TableCell>
                  <TableCell>{order.serviceName}</TableCell>
                  <TableCell>{order.description}</TableCell>
                  <TableCell>{order.pages}</TableCell>
                  <TableCell>{order.totalWords}</TableCell>
                  <TableCell>${order.price?.toFixed(2)}</TableCell>
                  <TableCell>${order.total?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={paymentStatusColors[order.paymentStatus] || paymentStatusColors.unpaid}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.paypalOrderId || "N/A"}</TableCell>
                  <TableCell>{order.paypalTransactionId || "N/A"}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    {order.attachments && order.attachments.length > 0 ? (
                      <AttachmentList attachments={order.attachments} />
                    ) : (
                      "No attachments"
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value: string) => updateOrderStatus(order._id, value)}
                      disabled={updatingStatus === order._id}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

