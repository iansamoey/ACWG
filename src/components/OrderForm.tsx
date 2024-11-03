import React, { useState } from 'react';

const OrderForm: React.FC<{ userId: string; onSubmit: () => void }> = ({ userId, onSubmit }) => {
  const [selectedService, setSelectedService] = useState('');
  const [instructions, setInstructions] = useState('');

  const services = [
    { id: '1', name: 'Essay Writing' },
    { id: '2', name: 'Research Papers' },
    { id: '3', name: 'Dissertations' },
    { id: '4', name: 'CV Writing' },
    { id: '5', name: 'Final Year Projects' },
    { id: '6', name: 'Editing & Proofreading' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceName: selectedService,
          instructions,
          userId,
        }),
      });

      if (response.ok) {
        onSubmit(); // Call the passed onSubmit prop if needed
        alert('Order request submitted successfully!');
        setSelectedService('');
        setInstructions('');
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while submitting the order request.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl mb-4">Request a Service</h2>
      <div className="mb-4">
        <label className="block mb-2">Select Service:</label>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="border rounded w-full p-2"
          required
        >
          <option value="" disabled>Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.name}>
              {service.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Instructions:</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="border rounded w-full p-2"
          rows={4}
          required
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
        Submit Request
      </button>
    </form>
  );
};

export default OrderForm;
