"use client";
import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/UserContext";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, PenTool, Users } from 'lucide-react';

export default function Home() {
  return (
    <UserProvider>
      <div className="flex flex-col bg-gradient-to-br from-blue-50 to-white min-h-screen">
        <Navbar />
        <main className="flex flex-col items-center justify-center flex-grow p-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6 leading-tight">
              Elevate Your Academic Success with{" "}
              <span className="text-blue-600">Expert Writing Assistance</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Unlock your full potential with our top-notch academic writing services. We&apos;re here to support your journey to academic excellence.
            </p>
            <div className="space-x-4 mb-12">
              <Link href="/auth/signup" passHref>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg inline-flex items-center"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
              </Link>
              <Link href="/auth/login" passHref>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-full text-lg font-semibold hover:bg-blue-50 transition duration-300 ease-in-out shadow-lg"
                >
                  Log In
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <section className="mt-16 w-full max-w-5xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: PenTool, title: "Essay Writing", description: "Craft compelling essays that stand out" },
                { icon: BookOpen, title: "Research Papers", description: "In-depth research and analysis for your papers" },
                { icon: Users, title: "Group Projects", description: "Collaborative support for team assignments" },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <service.icon className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </main>

        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-lg font-semibold mb-2">Academic Writing</p>
                <p className="text-sm text-gray-400">
                  &copy; {new Date().getFullYear()} All rights reserved.
                </p>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <a
                  href="mailto:essaysgeorgia@gmail.com"
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200 mb-2"
                >
                  essaysgeorgia@gmail.com
                </a>
                <p className="text-sm text-gray-400">
                  Contact us for inquiries or support
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </UserProvider>
  );
}
