"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          Academic Writing
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <Link href="/services" passHref>
            <button className="text-white hover:bg-gray-500 px-4 py-2 rounded">
              View Services
            </button>
          </Link>
          {session ? (
            <>
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

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <Link href="/services" passHref>
            <button className="block w-full text-left text-white hover:bg-gray-500 px-4 py-2 rounded">
              View Services
            </button>
          </Link>
          {session ? (
            <>
              <button 
                onClick={() => signOut()} 
                className="block w-full text-left text-white hover:bg-gray-500 px-4 py-2 rounded"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" passHref>
                <button className="block w-full text-left text-white hover:bg-gray-500 px-4 py-2 rounded">
                  Log in
                </button>
              </Link>
              <Link href="/auth/signup" passHref>
                <button className="block w-full text-left text-white hover:bg-gray-500 px-4 py-2 rounded">
                  Sign up
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

