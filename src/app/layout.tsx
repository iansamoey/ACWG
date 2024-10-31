// src/app/layout.tsx
"use client"; // Ensures layout can use client-side components

import './globals.css';
import { PayPalScriptProvider } from '@paypal/react-paypal-js'; // Import PayPalScriptProvider
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
        <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
          <UserProvider>
            <CartProvider>{children}</CartProvider>
          </UserProvider>
        </PayPalScriptProvider>
      </body>
    </html>
  );
}
