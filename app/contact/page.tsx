"use client"
import { motion } from "framer-motion"
import { ContactSection } from "@/components/contact-section"

export default function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-16 sm:mt-20"
    >
      <motion.h1
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8"
      >
        Contact Us
      </motion.h1>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <p className="text-xl text-gray-600">
          Have questions? We're here to help. Reach out to us through any of the following channels.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12"
      >
        {[
          { title: "Phone Support", content: "Hotline: 0123456789\nMonday - Friday: 9AM - 6PM" },
          { title: "Email", content: "General: Example@gmail.com\nSupport: support@example.com" },
          { title: "Office", content: "Example location\nCity, Country" },
        ].map((item, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
            <p className="text-gray-600 whitespace-pre-line">{item.content}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <ContactSection />
      </motion.div>
    </motion.div>
  )
}

