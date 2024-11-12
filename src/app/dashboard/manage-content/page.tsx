"use client";

import React, { useEffect, useState } from 'react';

// Define a type for the service object
interface Service {
  _id: string;
  name: string;
  description: string;
  price: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | null;
}

const ManageContent: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]); // Array of services with specific type
  const [service, setService] = useState<Service>({ _id: '', name: '', description: '', price: '' }); // Typed service state
  const [notification, setNotification] = useState<Notification>({ message: '', type: null }); // Notification state

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const response = await fetch('/api/services');
    const data: Service[] = await response.json(); // Typed response
    setServices(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = service._id ? 'PATCH' : 'POST';
    const response = await fetch('/api/services', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });

    if (response.ok) {
      fetchServices(); // Refresh the list
      setNotification({ message: service._id ? 'Service updated successfully!' : 'Service created successfully!', type: 'success' });
      setTimeout(() => setNotification({ message: '', type: null }), 3000); // Clear notification after 3 seconds
      setService({ _id: '', name: '', description: '', price: '' }); // Reset form
    } else {
      setNotification({ message: 'Failed to save service.', type: 'error' });
    }
  };

  const handleEdit = (srv: Service) => { // Edited to accept a Service type
    setService(srv);
  };

  const handleDelete = async (id: string) => { // ID as string is sufficient for delete
    const response = await fetch('/api/services', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      fetchServices(); // Refresh the list
      setNotification({ message: 'Service deleted successfully!', type: 'success' });
      setTimeout(() => setNotification({ message: '', type: null }), 3000); // Clear notification after 3 seconds
    } else {
      setNotification({ message: 'Failed to delete service.', type: 'error' });
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Manage Services</h1>

      {/* Notification Popup */}
      {notification.message && (
        <div className={`p-4 mb-4 text-white rounded-md ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={service.name}
          onChange={e => setService({ ...service, name: e.target.value })}
          placeholder="Service Name"
          required
          className="border border-gray-300 rounded-md p-2 mb-2 w-full"
        />
        <textarea
          value={service.description}
          onChange={e => setService({ ...service, description: e.target.value })}
          placeholder="Description"
          required
          className="border border-gray-300 rounded-md p-2 mb-2 w-full"
        />
        <input
          type="number"
          value={service.price}
          onChange={e => setService({ ...service, price: e.target.value })}
          placeholder="Price"
          required
          className="border border-gray-300 rounded-md p-2 mb-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white rounded-md p-2">
          {service._id ? 'Update' : 'Create'} Service
        </button>
      </form>

      <ul className="space-y-2">
        {services.map((srv) => (
          <li key={srv._id} className="flex justify-between items-center bg-white rounded-md p-2 shadow-sm">
            <div>
              <strong>{srv.name}</strong> - ${srv.price}
            </div>
            <div>
              <button onClick={() => handleEdit(srv)} className="text-blue-600 hover:underline mx-2">
                Edit
              </button>
              <button onClick={() => handleDelete(srv._id)} className="text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageContent;
