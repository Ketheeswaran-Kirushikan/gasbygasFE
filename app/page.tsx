"use client";

import { motion } from "framer-motion";
import { AnimatedHero } from "@/components/animated-hero";
import { AnimatedServiceCard } from "@/components/animated-service-card";
import { Truck, Clock, Shield, Phone } from "lucide-react";
import { ContactSection } from "@/components/contact-section";
import { Navigation } from "@/components/navigation"; // Import Navigation
import { Footer } from "@/components/footer"; // Import Footer

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Navigation Bar */}
      <Navigation />

      {/* Hero Section */}
      <AnimatedHero />

      {/* Services Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-12 sm:py-20 bg-gray-100"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Our Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <AnimatedServiceCard
              icon={<Truck />}
              title="Fast Delivery"
              description="Get your gas delivered quickly and efficiently."
            />
            <AnimatedServiceCard
              icon={<Clock />}
              title="24/7 Service"
              description="We're available around the clock for your convenience."
            />
            <AnimatedServiceCard
              icon={<Shield />}
              title="Safe Handling"
              description="Your safety is our top priority in all our operations."
            />
            <AnimatedServiceCard
              icon={<Phone />}
              title="Easy Ordering"
              description="Order gas with just a few taps on your phone."
            />
          </div>
        </div>
      </motion.section>

      {/* Why Choose Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-12 sm:py-20 bg-[#3E3636] text-white"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Why Choose GAS GAS BY?</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Reliability</h3>
              <p>Count on us for consistent and dependable service.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Expertise</h3>
              <p>Benefit from our years of experience in the gas industry.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Customer-Centric</h3>
              <p>Your satisfaction is at the heart of everything we do.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
