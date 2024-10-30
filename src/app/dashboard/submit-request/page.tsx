"use client"; // Add this line to mark this file as a client component

import React from 'react';
import Link from 'next/link';

const SubmitRequest: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Submit Request</h1>
            <p className="text-gray-700 mb-4">Please fill out the form below to submit your request.</p>

            <form className="space-y-4">
                <div>
                    <label className="block text-gray-700" htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter the title of your request"
                    />
                </div>
                <div>
                    <label className="block text-gray-700" htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter a detailed description of your request"
                    />
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Submit</button>
            </form>

            <Link href="/dashboard/user-dashboard" className="block mt-4 text-blue-500 hover:underline">Back to Dashboard</Link>
        </div>
    );
};

export default SubmitRequest;
