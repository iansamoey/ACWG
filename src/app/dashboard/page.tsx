'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { withAuth } from '@/components/auth/with-auth';

const DashboardPage: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'loading') return; // Wait for the session to load

        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (session?.user.isAdmin) {
            router.push('/dashboard/admin-dashboard');
        } else {
            router.push('/dashboard/userDashboard');
        }
    }, [status, session, router]);

    // Render nothing while redirecting
    return null;
};

export default withAuth(DashboardPage);

