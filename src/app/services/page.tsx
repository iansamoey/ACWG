"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { Service } from "@/types"
import ServiceItem from "@/components/ServiceItem"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import CartStatus from "@/components/CartStatus"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Category {
  _id: string
  name: string
  description?: string
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const { state: cartState } = useCart()
  const [activeTab, setActiveTab] = useState("services")

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesResponse = await fetch("/api/services")
        const categoriesResponse = await fetch("/api/categories")
        if (!servicesResponse.ok || !categoriesResponse.ok) {
          throw new Error("Network response was not ok")
        }
        const servicesData = await servicesResponse.json()
        const categoriesData = await categoriesResponse.json()
        setServices(servicesData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }

    fetchServices()
  }, [])

  const handleViewCart = () => {
    setActiveTab("cart-status")
  }

  const handleAddToCart = () => {
    setActiveTab("cart-status")
  }

  const renderActiveTabContent = () => {
    if (activeTab === "cart-status") {
      return <CartStatus setActiveTab={setActiveTab} onBack={() => setActiveTab("services")} />
    }

    return (
      <Tabs defaultValue={categories[0]?._id}>
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger key={category._id} value={category._id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category._id} value={category._id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services
                .filter((service) => service.category === category._id)
                .map((service) => (
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
          </TabsContent>
        ))}
      </Tabs>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Our Services
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            Explore our range of academic writing services designed to support your success.
          </p>
        </motion.div>

        {activeTab === "services" && (
          <div className="flex justify-end mb-4">
            <Button onClick={handleViewCart} variant="outline">
              View Cart ({cartState.items.length})
            </Button>
          </div>
        )}

        {renderActiveTabContent()}

        {services.length === 0 && activeTab === "services" && (
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
  )
}

