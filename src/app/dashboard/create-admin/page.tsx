// src/app/dashboard/create-admin/page.tsx
"use client";

import { useState } from "react";

const CreateAdmin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to create admin');
      }

      alert('Admin account created successfully');
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Error creating admin account');
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
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">Create Admin</button>
    </form>
  );
};

export default CreateAdmin;
