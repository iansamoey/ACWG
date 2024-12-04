"use client";

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          Academic Writing
        </div>
        <div className="space-x-4">
          <Link href="/services" passHref>
            <button className="text-white hover:bg-gray-500 px-4 py-2 rounded">
              View Services
            </button>
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" passHref>
                <button className="text-white hover:bg-gray-500 px-4 py-2 rounded">
                  Dashboard
                </button>
              </Link>
              <button 
                onClick={() => signOut()} 
                className="text-white hover:bg-gray-500 px-4 py-2 rounded"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" passHref>
                <button className="text-white hover:bg-gray-500 px-4 py-2 rounded">
                  Log in
                </button>
              </Link>
              <Link href="/auth/signup" passHref>
                <button className="text-white hover:bg-gray-500 px-4 py-2 rounded">
                  Sign up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

