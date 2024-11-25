"use client";

import { useState } from "react";
import React from 'react';


const CreateAdmin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state
    setLoading(true); // Set loading state

    try {
      const response = await fetch('/api/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to create admin');
      }

      alert('Admin account created successfully');
      // Reset fields after successful submission
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error('Error creating admin:', error);
      setError(error instanceof Error ? error.message : 'Error creating admin account');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
      <h2 className="text-xl font-bold">Create Admin Account</h2>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Username" 
        className="border p-2"
        required
      />
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
        className="border p-2"
        required
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
        className="border p-2"
        required
      />
      <button 
        type="submit" 
        className={`bg-blue-600 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Admin'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default CreateAdmin;
