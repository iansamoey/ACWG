'use client';

import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X } from 'lucide-react'

const OrderForm: React.FC = () => {
  const { state } = useUser();
  const { user } = state;
  const router = useRouter();

  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!user) {
      setError('You must be logged in to submit an order');
      setIsSubmitting(false);
      return;
    }

    if (!serviceName || !description || !price) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('serviceName', serviceName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('total', price); // Assuming total is the same as price for now

    attachments.forEach((file, index) => {
      formData.append(`attachment${index}`, file);
    });

    try {
      const response = await fetch(`/api/orders/user/${user.id}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.push('/dashboard/userDashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error submitting order');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Request a Service</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="serviceName">Service Name</Label>
          <Input
            id="serviceName"
            value={serviceName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setServiceName(e.target.value)}
            placeholder="Enter the service name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Enter a brief description"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
            placeholder="Enter the price"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attachments">Attachments</Label>
          <Input
            id="attachments"
            type="file"
            onChange={handleFileChange}
            multiple
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>

        {attachments.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Attached Files:</h3>
            <ul className="space-y-2">
              {attachments.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Order'}
        </Button>
      </form>
    </div>
  );
};

export default OrderForm;