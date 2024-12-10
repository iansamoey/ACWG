"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const OrderSummary: React.FC = () => {
  const { state: cartState, clearCart } = useCart();
  const { state: userState } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const totalPrice = cartState.items.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    if (!userState.loading && !userState.user) {
      router.push('/login');
    }
  }, [userState, router]);

  const createOrder = async () => {
    try {
      const response = await fetch('/api/orders/create-paypal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartState.items,
          total: totalPrice,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      const order = await response.json();
      return order.id;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create order. Please try again.",
      });
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    setIsProcessing(true);
    try {
      if (!userState.user?.id) {
        throw new Error('User is not authenticated');
      }

      const response = await fetch('/api/orders/capture-paypal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: data.orderID,
          userId: userState.user.id,
          items: cartState.items,
          total: totalPrice,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to capture order');
      }

      const orderData = await response.json();
      if (orderData.success) {
        setOrderConfirmed(true);
        setOrderId(orderData.order._id);
        clearCart();
      } else {
        throw new Error(orderData.error || 'Failed to capture order');
      }
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process your order. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (userState.loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent>
          <div className="flex justify-center items-center">
            <Spinner className="mr-2" />
            <span>Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userState.user) {
    return null; // This will be handled by the useEffect hook above
  }

  if (orderConfirmed) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Order Confirmation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">Thank you for your order!</p>
          <p className="mb-2">Your order ID is: <span className="font-bold">{orderId}</span></p>
          <p className="mb-4">We've received your order and it's currently pending. We'll process it shortly and send you an email with further details.</p>
          <Button onClick={() => router.push('/')}>Return to Home</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-4">
          {cartState.items.map((item) => (
            <li key={item.id} className="flex justify-between border-b pb-2">
              <span>{item.name} (x{item.quantity})</span>
              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="text-xl font-bold mb-6 text-right">
          Total: ${totalPrice.toFixed(2)}
        </div>
        {isProcessing ? (
          <div className="flex justify-center items-center">
            <Spinner className="mr-2" />
            <span>Processing payment...</span>
          </div>
        ) : (
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            style={{ layout: "vertical" }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;

