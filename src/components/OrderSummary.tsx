"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Toast } from "@/components/ui/toast";

interface PayPalOrderData {
  orderID: string;
}

interface PayPalActions {
  order: {
    create: (orderDetails: {
      purchase_units: Array<{ amount: { value: string } }>;
    }) => Promise<{ id: string }>;
    capture: () => Promise<{
      payer: { name: { given_name: string }; payer_id: string };
    }>;
  };
}

const OrderSummary: React.FC = () => {
  const { state: cartState, clearCart } = useCart();
  const { state: userState } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = cartState.items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCreateOrder = async (data: Record<string, unknown>, actions: PayPalActions) => {
    return actions.order.create({
      purchase_units: [{
        amount: { value: totalPrice.toFixed(2) },
      }],
    });
  };

  const handleApprove = async (data: PayPalOrderData, actions: PayPalActions) => {
    setIsProcessing(true);
    try {
      const details = await actions.order.capture();
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userState.user?.id,
          items: cartState.items,
          total: totalPrice,
          status: 'pending',
          paypalOrderId: data.orderID,
          paypalPayerId: details.payer.payer_id,
        }),
      });

      if (response.ok) {
        clearCart();
        router.push('/order-confirmation');
      } else {
        throw new Error('Failed to save order');
      }
    } catch (error) {
      console.error('Error processing order:', error);
      setError('Failed to process your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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
            createOrder={handleCreateOrder}
            onApprove={handleApprove}
            style={{ layout: "vertical" }}
          />
        )}
        {error && <Toast variant="destructive">{error}</Toast>}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;