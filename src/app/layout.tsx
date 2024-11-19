"use client";

import './globals.css';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { CartProvider } from '../context/CartContext';
import { UserProvider } from '../context/UserContext';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Academic Writing Assistance</title>
        <meta name="description" content="Expert academic writing services to help you succeed in your studies." />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
          <UserProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </UserProvider>
        </PayPalScriptProvider>
      </body>
    </html>
  );
}