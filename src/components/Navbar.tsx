import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext'; // Import the CartContext to access the cart state

const Navbar: React.FC = () => {
  const { state } = useCart(); // Destructure state from useCart to get cart items

  return (
    <nav className="bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          Academic Writing
        </div>
        <div className="space-x-4">
          <Link href="/services" passHref>
            <button className="text-white hover:bg-gray-500 px-4 py-2 rounded">View Services</button>
          </Link>
      
          <Link href="/dashboard/admin-dashboard" passHref>
            <button className="text-white hover:bg-gray-500 px-4 py-2 rounded">Admin Dashboard</button>
          </Link>
          <Link href="/dashboard/userDashboard" passHref>
            <button className="text-white hover:bg-gray-500 px-4 py-2 rounded">User Dashboard</button>
          </Link>
          <Link href="/checkout" passHref>
            <button className="text-white hover:bg-gray-500 px-4 py-2 rounded">
              Cart ({state?.items.length ?? 0}) {/* Display the number of items in the cart */}
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
