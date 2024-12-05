"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import OrderSummary from "@/components/OrderSummary";

export default function CartStatus() {
  const { state: cartState, removeFromCart, updateItemPages, updateItemTitle } = useCart();
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const handleProceedToCheckout = () => {
    setShowOrderSummary(true);
  };

  const handleBackToCart = () => {
    setShowOrderSummary(false);
  };

  const handleUpdatePages = (id: string, pages: number) => {
    updateItemPages(id, Math.max(1, pages));
  };

  const handleUpdateTitle = (id: string, title: string) => {
    updateItemTitle(id, title.slice(0, 250)); // Limit to 50 words (approx. 250 characters)
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
            <ul className="space-y-6">
              {cartState.items.map((item) => (
                <li key={item.id} className="flex flex-col border-b pb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.name} (x{item.quantity})</span>
                    <Button
                      onClick={() => removeFromCart(item.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="flex items-center mt-2">
                    <label htmlFor={`pages-${item.id}`} className="mr-2">Pages:</label>
                    <Input
                      id={`pages-${item.id}`}
                      type="number"
                      min="1"
                      value={item.pages}
                      onChange={(e) => handleUpdatePages(item.id, parseInt(e.target.value) || 1)}
                      className="w-20 mr-2"
                    />
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="mt-2">
                    <label htmlFor={`title-${item.id}`} className="block mb-1">Description/Title:</label>
                    <Textarea
                      id={`title-${item.id}`}
                      value={item.title}
                      onChange={(e) => handleUpdateTitle(item.id, e.target.value)}
                      className="w-full"
                      rows={2}
                      maxLength={250}
                    />
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

