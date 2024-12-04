'use client'

import React from 'react';
import Link from 'next/link';
import { withAuth } from '@/components/auth/with-auth';
import { useSession } from 'next-auth/react';

const DashboardPage: React.FC = () => {
    const { data: session } = useSession();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <nav>
                <ul className="space-y-4">
                    {session?.user.isAdmin && (
                        <li>
                            <Link href="/dashboard/admin-dashboard" className="text-blue-600 hover:underline">
                                Admin Dashboard
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link href="/dashboard/userDashboard" className="text-blue-600 hover:underline">
                            User Dashboard
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default withAuth(DashboardPage);

