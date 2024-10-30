// src/app/services/page.tsx

"use client";

import React from 'react';
import ServiceItem from '../../components/ServiceItem';

export default function Services() {
  const services = [
    { id: '1', name: 'Essay Writing', description: 'High-quality essays tailored to your academic needs.', price: 50 },
    { id: '2', name: 'Research Papers', description: 'Thoroughly researched papers with accurate citations.', price: 70 },
    { id: '3', name: 'Dissertations', description: 'Comprehensive dissertations from topic selection to conclusion.', price: 100 },
    { id: '4', name: 'CV Writing', description: 'Professional CV writing services to enhance your job applications.', price: 40 },
    { id: '5', name: 'Final Year Projects', description: 'Guidance and support for your final year projects and presentations.', price: 150 },
    { id: '6', name: 'Editing & Proofreading', description: 'Expert editing and proofreading services to perfect your documents.', price: 30 },
  ];

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-semibold mb-6 text-center">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {services.map((service) => (
          <ServiceItem
            key={service.id}
            id={service.id}
            name={service.name}
            description={service.description}
            price={service.price}
          />
        ))}
      </div>
    </div>
  );
}
