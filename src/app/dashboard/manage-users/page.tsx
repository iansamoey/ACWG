"use client";
import { useEffect, useState } from 'react';
import React from 'react';


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
        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h2>
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border-b border-gray-300 py-2 px-4 text-left text-gray-600">Username</th>
                        <th className="border-b border-gray-300 py-2 px-4 text-left text-gray-600">Email</th>
                        <th className="border-b border-gray-300 py-2 px-4 text-left text-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition duration-200">
                            <td className="border-b border-gray-300 py-2 px-4">{user.username}</td>
                            <td className="border-b border-gray-300 py-2 px-4">{user.email}</td>
                            <td className="border-b border-gray-300 py-2 px-4">
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
            {editingUser && (
                <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Edit User</h3>
                    <div className="flex flex-col mb-4">
                        <label className="mb-1 text-gray-600">Username</label>
                        <input 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Username" 
                            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-400"
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="mb-1 text-gray-600">Email</label>
                        <input 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email" 
                            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-400"
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="mb-1 text-gray-600">New Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="New Password (leave blank to keep current)" 
                            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-400"
                        />
                    </div>
                    <button 
                        onClick={handleUpdate} 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                    >
                        Update User
                    </button>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
