// src/components/Sidebar.tsx

import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white h-full w-64 p-4 fixed top-0 left-0">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <ul>
        <li className="mb-2">
          <Link href="/order-status" className="hover:underline">
            View Order Status
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/cart-status" className="hover:underline">
            View Cart Status
          </Link>
        </li>
        <li className="mb-2">
          <Link href="/services" className="hover:underline">
            Services
          </Link>
        </li>
        <li>
          <Link href="/logout" className="hover:underline">
            Log Out
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
