// src/app/layout.tsx
"use client"; // Ensures layout can use client-side components

import './globals.css';
import { CartProvider } from '../context/CartContext';
import { UserProvider } from '../context/UserContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <CartProvider>{children}</CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
