"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/UserContext";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, PenTool, Users, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <UserProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <Navbar />
        <main className="flex flex-col items-center justify-center flex-grow p-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6 leading-tight">
              Elevate Your Academic Success with{" "}
              <span className="text-indigo-600">Expert Writing Assistance</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Unlock your full potential with our top-notch academic writing services. Sign up now to access our comprehensive range of academic writing solutions.
            </p>
            <div className="space-x-4 mb-12">
              <Link href="/auth/signup" passHref>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition duration-300 ease-in-out shadow-lg inline-flex items-center"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login" passHref>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white text-indigo-600 border-2 border-indigo-600 rounded-full text-lg font-semibold hover:bg-indigo-50 transition duration-300 ease-in-out shadow-lg"
                >
                  Log In
                </Button>
              </Link>
            </div>
          </motion.div>

          <section className="mt-16 w-full max-w-5xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Our Services</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Explore our range of services designed to support your academic journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: PenTool, title: "Essay Writing", description: "Craft compelling essays that stand out" },
                { icon: BookOpen, title: "Research Papers", description: "In-depth research and analysis for your papers" },
                { icon: Users, title: "Group Projects", description: "Collaborative support for team assignments" },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                  className="bg-white p-6 rounded-lg shadow-md transition duration-300 border border-indigo-100"
                >
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-full p-3 inline-block mb-4">
                    <service.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-700">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mt-20 w-full max-w-5xl bg-white rounded-lg shadow-xl p-8 border border-indigo-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Why Choose Us?</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: Sparkles, title: "Expert Writers", description: "Our team consists of experienced academic professionals" },
                { icon: ArrowRight, title: "On-Time Delivery", description: "We always meet deadlines, no matter how tight" },
                { icon: BookOpen, title: "Original Content", description: "100% plagiarism-free, custom-written papers" },
                { icon: Users, title: "24/7 Support", description: "Round-the-clock assistance for all your queries" },
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-full p-2 flex-shrink-0">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-indigo-700">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white py-8 mt-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-lg font-semibold mb-2">Academic Writing Excellence</p>
                <p className="text-sm text-indigo-200">
                  &copy; {new Date().getFullYear()} All rights reserved.
                </p>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <a
                  href="mailto:essaysgeorgia@gmail.com"
                  className="text-indigo-200 hover:text-white transition-colors duration-200 mb-2"
                >
                  essaysgeorgia@gmail.com
                </a>
                <p className="text-sm text-indigo-200">
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

