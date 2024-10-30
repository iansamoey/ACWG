import React from 'react';
import Link from 'next/link'; // Import Link for navigation
import AdminDashboard from './admin-dashboard/page'; // Import the AdminDashboard correctly

const DashboardPage: React.FC = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <nav>
                <ul>
                    <li>
                        <Link href="/dashboard/admin-dashboard">Admin Dashboard</Link>
                    </li>
                    <li>
                        <Link href="/dashboard/userDashboard">User Dashboard</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default DashboardPage;
