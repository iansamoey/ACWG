import React from 'react';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveTab }) => {
  const { state: userState, dispatch } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    router.push('/');
  };

  return (
    <div className="bg-gray-800 text-white h-full w-64 p-4 fixed top-0 left-0">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <ul>
        {/* View Order Status */}
        <li className="mb-2">
          <button onClick={() => setActiveTab('order-status')} className="hover:underline">
            View Order Status
          </button>
        </li>

        {/* View Cart Status */}
        <li className="mb-2">
          <button onClick={() => setActiveTab('cart-status')} className="hover:underline">
            View Cart Status
          </button>
        </li>

        {/* Order Summary */}
        <li className="mb-2">
          <button onClick={() => setActiveTab('order-summary')} className="hover:underline">
            Order Summary
          </button>
        </li>

        {/* Services */}
        <li className="mb-2">
          <button onClick={() => setActiveTab('services')} className="hover:underline">
            Services
          </button>
        </li>

        {/* Request a Service */}
        <li className="mb-2">
          <button onClick={() => setActiveTab('order-form')} className="hover:underline">
            Request a Service
          </button>
        </li>

        {/* New Features */}
        {/* Order History */}
        <li className="mb-2">
          <button onClick={() => setActiveTab('order-history')} className="hover:underline">
            Order History
          </button>
        </li>

        {/* Profile Management */}
        <li className="mb-2">
          <button onClick={() => setActiveTab('profile-update')} className="hover:underline">
            Profile Management
          </button>
        </li>

        {/* Logout */}
        <li className="mb-2">
          <button onClick={handleLogout} className="hover:underline text-red-500">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
