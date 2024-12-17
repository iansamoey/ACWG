"use client";
import React, { useEffect, useState } from 'react';

interface User {
    _id: string;
    username: string;
    email: string;
}

const ManageUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setUsername(user.username);
        setEmail(user.email);
        setPassword(''); // clear password field
    };

    const handleUpdate = async () => {
        if (!editingUser) return; // Ensure editingUser is not null

        const response = await fetch('/api/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editingUser._id, username, email, password }),
        });
        const data = await response.json();
        alert(data.message);
        if (response.ok) {
            setUsers((prev) => prev.map((user) => (user._id === editingUser._id ? { ...user, username, email } : user)));
            setEditingUser(null);
            setUsername('');
            setEmail('');
            setPassword('');
        }
    };

    const handleDelete = async (id: string) => {
        const response = await fetch('/api/users', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        const data = await response.json();
        alert(data.message);
        if (response.ok) {
            setUsers((prev) => prev.filter((user) => user._id !== id));
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h2>
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border border-gray-300 rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Username</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{user.username}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <button 
                                                onClick={() => handleEdit(user)} 
                                                className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600 transition duration-200"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user._id)} 
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {editingUser && (
                <div className="mt-8 bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Edit User</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input 
                                id="username"
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                placeholder="Username" 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input 
                                id="email"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Email" 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                            <input 
                                id="password"
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="New Password (leave blank to keep current)" 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <button 
                            onClick={handleUpdate} 
                            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                        >
                            Update User
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;

