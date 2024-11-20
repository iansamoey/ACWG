"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderSummary from "@/components/OrderSummary";

export default function CartStatus() {
  const { state: cartState, removeFromCart } = useCart();
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const handleProceedToCheckout = () => {
    setShowOrderSummary(true);
  };

  const handleBackToCart = () => {
    setShowOrderSummary(false);
  };

  const total = cartState.items.reduce((total, item) => total + item.price * item.quantity, 0);

  if (showOrderSummary) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <Button variant="outline" onClick={handleBackToCart}>Back to Cart</Button>
        </CardHeader>
        <CardContent>
          <OrderSummary />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Cart Status</CardTitle>
      </CardHeader>
      <CardContent>
        {cartState.items.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div>
            <ul className="space-y-2">
              {cartState.items.map((item) => (
                <li key={item.id} className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">{item.name} (x{item.quantity})</span>
                  <div>
                    <span className="mr-2 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    <Button
                      onClick={() => removeFromCart(item.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 font-bold text-right text-lg">
              Total: ${total.toFixed(2)}
            </div>
            <Button onClick={handleProceedToCheckout} className="w-full mt-4">
              Proceed to Checkout
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}