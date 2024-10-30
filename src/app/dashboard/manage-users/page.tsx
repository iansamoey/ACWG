"use client"; // Add this line to mark this file as a client component

import React from 'react';
import Link from 'next/link';

const ManageUsers: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
            <p className="text-gray-700 mb-4">Here you can view and manage users.</p>

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">User Actions</h2>
                <ul className="space-y-2">
                    <li>
                        <Link href="/dashboard/user-details" className="text-blue-500 hover:underline">View User Details</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/add-user" className="text-blue-500 hover:underline">Add New User</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ManageUsers;
