"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import OrderSummary from "@/components/OrderSummary";
import { ArrowLeft, Trash2 } from 'lucide-react';

interface CartStatusProps {
  onBack?: () => void;
  setActiveTab: (tab: string) => void;
}

const CartStatus: React.FC<CartStatusProps> = ({ onBack, setActiveTab }) => {
  const { state: cartState, dispatch } = useCart();
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const handleUpdatePages = (id: string, pages: number) => {
    dispatch({ type: "UPDATE_ITEM_PAGES", payload: { id, pages: Math.max(1, pages) } });
  };

  const handleUpdateTitle = (id: string, title: string) => {
    dispatch({ type: "UPDATE_ITEM_TITLE", payload: { id, title: title.slice(0, 250) } });
  };

  const handleProceedToCheckout = () => {
    setShowOrderSummary(true);
  };

  const handleBackToCart = () => {
    setShowOrderSummary(false);
  };

  const handleContinueShopping = () => {
    setActiveTab('services');
  };

  if (showOrderSummary) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
          <Button variant="ghost" onClick={handleBackToCart}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
          </Button>
        </CardHeader>
        <CardContent>
          <OrderSummary />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Cart Status</CardTitle>
        {onBack && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {cartState.items.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="space-y-6">
            {cartState.items.map((item) => (
              <li key={item.id} className="flex flex-col border-b pb-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{item.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center mt-2">
                  <label htmlFor={`pages-${item.id}`} className="mr-2">
                    Pages:
                  </label>
                  <Input
                    id={`pages-${item.id}`}
                    type="number"
                    min="1"
                    value={item.pages}
                    onChange={(e) => handleUpdatePages(item.id, parseInt(e.target.value) || 1)}
                    className="w-20 mr-2"
                  />
                  <span className="text-sm text-gray-600 ml-2">{item.totalWords} words</span>
                </div>
                <div className="mt-2">
                  <label htmlFor={`title-${item.id}`} className="block mb-1">
                    Description/Title:
                  </label>
                  <Textarea
                    id={`title-${item.id}`}
                    value={item.title}
                    onChange={(e) => handleUpdateTitle(item.id, e.target.value)}
                    className="w-full"
                    rows={2}
                    maxLength={250}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span>Quantity: {item.quantity}</span>
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch">
        <div className="flex justify-between items-center w-full mb-4">
          <span className="font-semibold">Total Items: {totalItems}</span>
          <span className="font-semibold">Total Price: ${totalPrice.toFixed(2)}</span>
        </div>
        <Button onClick={handleProceedToCheckout} className="w-full mb-2">
          Proceed to Checkout
        </Button>
        <Button onClick={handleContinueShopping} variant="outline" className="w-full">
          Continue Shopping
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartStatus;

