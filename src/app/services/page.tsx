"use client";

import React, { useEffect, useState } from 'react';
import ServiceItem from '../../components/ServiceItem';
import Navbar from '../../components/Navbar'; // Import Navbar
import { Service } from '../../types'; // Import the Service type

export default function Services() {
  const [services, setServices] = useState<Service[]>([]); // Define services state with Service type

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services'); // Fetching from the API
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setServices(data); // Updating state with the fetched services
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchServices(); // Call the function to fetch services
  }, []); // Empty dependency array to run once on mount

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /> {/* Add Navbar component */}
      <div className="p-10">
        <h1 className="text-4xl font-semibold mb-6 text-center">Our Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {services.map((service) => (
            <ServiceItem
              key={service._id} // Use the MongoDB _id
              id={service._id}
              name={service.name}
              description={service.description}
              price={service.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
