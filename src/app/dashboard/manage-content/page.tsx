"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Service {
  _id: string
  name: string
  description: string
  price: string
  category: string
}

interface Category {
  _id: string
  name: string
  description: string
}

interface Notification {
  message: string
  type: "success" | "error" | null
}

const ManageContent: React.FC = () => {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [service, setService] = useState<Service>({ _id: "", name: "", description: "", price: "", category: "" })
  const [category, setCategory] = useState<Category>({ _id: "", name: "", description: "" })
  const [notification, setNotification] = useState<Notification>({ message: "", type: null })
  const [activeTab, setActiveTab] = useState<"services" | "categories">("services")

  useEffect(() => {
    fetchServices()
    fetchCategories()
  }, [])

  const fetchServices = async () => {
    const response = await fetch("/api/services")
    const data: Service[] = await response.json()
    setServices(data)
  }

  const fetchCategories = async () => {
    const response = await fetch("/api/categories")
    const data: Category[] = await response.json()
    setCategories(data)
  }

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = service._id ? "PATCH" : "POST"
    const response = await fetch("/api/services", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    })

    if (response.ok) {
      fetchServices()
      setNotification({
        message: service._id ? "Service updated successfully!" : "Service created successfully!",
        type: "success",
      })
      setTimeout(() => setNotification({ message: "", type: null }), 3000)
      setService({ _id: "", name: "", description: "", price: "", category: "" })
    } else {
      setNotification({ message: "Failed to save service.", type: "error" })
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = category._id ? "PATCH" : "POST"
    const response = await fetch("/api/categories", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })

    if (response.ok) {
      fetchCategories()
      setNotification({
        message: category._id ? "Category updated successfully!" : "Category created successfully!",
        type: "success",
      })
      setTimeout(() => setNotification({ message: "", type: null }), 3000)
      setCategory({ _id: "", name: "", description: "" })
    } else {
      setNotification({ message: "Failed to save category.", type: "error" })
    }
  }

  const handleServiceEdit = (srv: Service) => {
    setService(srv)
  }

  const handleCategoryEdit = (cat: Category) => {
    setCategory(cat)
  }

  const handleServiceDelete = async (id: string) => {
    const response = await fetch("/api/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    if (response.ok) {
      fetchServices()
      setNotification({ message: "Service deleted successfully!", type: "success" })
      setTimeout(() => setNotification({ message: "", type: null }), 3000)
    } else {
      setNotification({ message: "Failed to delete service.", type: "error" })
    }
  }

  const handleCategoryDelete = async (id: string) => {
    const response = await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    if (response.ok) {
      fetchCategories()
      setNotification({ message: "Category deleted successfully!", type: "success" })
      setTimeout(() => setNotification({ message: "", type: null }), 3000)
    } else {
      setNotification({ message: "Failed to delete category.", type: "error" })
    }
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Manage Content</h1>

      {notification.message && (
        <div
          className={`p-4 mb-4 text-white rounded-md ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {notification.message}
        </div>
      )}

      <div className="mb-4">
        <Button
          onClick={() => setActiveTab("services")}
          variant={activeTab === "services" ? "default" : "outline"}
          className="mr-2"
        >
          Manage Services
        </Button>
        <Button onClick={() => setActiveTab("categories")} variant={activeTab === "categories" ? "default" : "outline"}>
          Manage Categories
        </Button>
      </div>

      {activeTab === "services" && (
        <Card>
          <CardHeader>
            <CardTitle>{service._id ? "Edit Service" : "Create Service"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <Input
                type="text"
                value={service.name}
                onChange={(e) => setService({ ...service, name: e.target.value })}
                placeholder="Service Name"
                required
              />
              <Textarea
                value={service.description}
                onChange={(e) => setService({ ...service, description: e.target.value })}
                placeholder="Description"
                required
              />
              <Input
                type="number"
                value={service.price}
                onChange={(e) => setService({ ...service, price: e.target.value })}
                placeholder="Price"
                required
              />
              <Select onValueChange={(value) => setService({ ...service, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit">{service._id ? "Update" : "Create"} Service</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === "categories" && (
        <Card>
          <CardHeader>
            <CardTitle>{category._id ? "Edit Category" : "Create Category"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <Input
                type="text"
                value={category.name}
                onChange={(e) => setCategory({ ...category, name: e.target.value })}
                placeholder="Category Name"
                required
              />
              <Textarea
                value={category.description}
                onChange={(e) => setCategory({ ...category, description: e.target.value })}
                placeholder="Description"
              />
              <Button type="submit">{category._id ? "Update" : "Create"} Category</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === "services" && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Services List</h2>
          <ul className="space-y-2">
            {services.map((srv) => (
              <li key={srv._id} className="flex justify-between items-center bg-white rounded-md p-2 shadow-sm">
                <div>
                  <strong>{srv.name}</strong> - ${srv.price} - Category:{" "}
                  {categories.find((cat) => cat._id === srv.category)?.name || "N/A"}
                </div>
                <div>
                  <Button onClick={() => handleServiceEdit(srv)} variant="outline" size="sm" className="mr-2">
                    Edit
                  </Button>
                  <Button onClick={() => handleServiceDelete(srv._id)} variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "categories" && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Categories List</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat._id} className="flex justify-between items-center bg-white rounded-md p-2 shadow-sm">
                <div>
                  <strong>{cat.name}</strong>
                </div>
                <div>
                  <Button onClick={() => handleCategoryEdit(cat)} variant="outline" size="sm" className="mr-2">
                    Edit
                  </Button>
                  <Button onClick={() => handleCategoryDelete(cat._id)} variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ManageContent

