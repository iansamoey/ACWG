'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Service } from '@/types';
import ServiceItem from '@/components/ServiceItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from '@/context/CartContext';

interface ServicesProps {
  setActiveTab: (tab: string) => void;
}

export default function Services({ setActiveTab }: ServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const { state: cartState } = useCart();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleViewCart = () => {
    setActiveTab('cart-status');
  };

  const handleAddToCart = () => {
    setActiveTab('cart-status');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Our Services
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            Explore our range of academic writing services designed to support your success.
          </p>
        </motion.div>

        <div className="flex justify-end mb-4">
          <Button onClick={handleViewCart} variant="outline">
            View Cart ({cartState.items.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ServiceItem
                id={service._id}
                name={service.name}
                description={service.description}
                price={service.price}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          ))}
        </div>

        {services.length === 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>No Services Available</CardTitle>
              <CardDescription>Please check back later for our updated service offerings.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">We are working on adding new services. Stay tuned for updates!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

