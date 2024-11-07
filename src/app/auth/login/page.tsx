"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../context/UserContext'; // Assuming this is the correct path

const LoginPage = () => {
    const [identifier, setIdentifier] = useState(''); // Combined field for username/email
    const [password, setPassword] = useState('');
    const { dispatch } = useUser(); // Get dispatch function to update the context
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Call login API
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Check if the user is admin and update context
            dispatch({
                type: 'LOGIN',
                payload: {
                    id: data.userId, // Assuming you send userId in the response
                    email: data.email, // Assuming you send email in the response
                    isAdmin: data.isAdmin,
                    requests: []
                },
            });

            // Redirect based on admin status
            if (data.isAdmin) {
                router.push('/dashboard/admin-dashboard');
            } else {
                router.push('/dashboard/userDashboard');
            }
        } else {
            alert(data.message); // Show the error message
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Log In</h2>
                <input 
                    type="text" 
                    placeholder="Username or Email"
                    value={identifier} 
                    onChange={(e) => setIdentifier(e.target.value)} 
                    className="border p-2 mb-4 w-full rounded" 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="border p-2 mb-4 w-full rounded" 
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Log In</button>
            </form>
        </div>
    );
};

export default LoginPage;
