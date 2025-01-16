'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { withAuth } from '@/components/auth/with-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import CartStatus from '@/components/CartStatus';
import OrderSummary from '@/components/OrderSummary';
import Services from '@/app/services/page';
import { useCart } from '@/context/CartContext';

const DashboardPage: React.FC = () => {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<string>('order-summary');
    const searchParams = useSearchParams();
    const { state: cartState } = useCart();

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const renderContent = () => {
        switch (activeTab) {
            case 'cart-status':
                return <CartStatus setActiveTab={setActiveTab} />;
            case 'order-summary':
                return <OrderSummary />;
            case 'services':
                return <Services />;
            default:
                return null;
        }
    };

    const cartItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <nav className="mb-8">
                <ul className="flex space-x-4">
                    <li>
                        <Link href="/dashboard?tab=order-summary" className={`text-blue-600 hover:underline ${activeTab === 'order-summary' ? 'font-bold' : ''}`}>
                            Order Summary
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard?tab=cart-status" className={`text-blue-600 hover:underline ${activeTab === 'cart-status' ? 'font-bold' : ''}`}>
                            Cart Status ({cartItems})
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard?tab=services" className={`text-blue-600 hover:underline ${activeTab === 'services' ? 'font-bold' : ''}`}>
                            Services
                        </Link>
                    </li>
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
            {renderContent()}
        </div>
    );
};

export default withAuth(DashboardPage);

