"use client"
import { motion } from "framer-motion"
import { ServiceCards } from "@/components/service-cards"
import { Button } from "@/components/ui/button"

export default function ServicesPage() {
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
        Our Services
      </motion.h1>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <p className="text-xl text-gray-600 max-w-3xl">
          We provide comprehensive gas delivery services for both businesses and individual consumers. Choose the
          service that best fits your needs.
        </p>
      </motion.div>

      <ServiceCards />

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 sm:mt-12 p-6 sm:p-8 bg-gray-50 rounded-lg"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Additional Services</h2>
        <ul className="grid sm:grid-cols-2 gap-4 mb-6">
          {["Emergency gas delivery", "Equipment maintenance", "Safety inspections", "Consultation services"].map(
            (service, index) => (
              <motion.li
                key={index}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex items-center space-x-2"
              >
                <span className="h-2 w-2 bg-red-500 rounded-full"></span>
                <span>{service}</span>
              </motion.li>
            ),
          )}
        </ul>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" className="w-full sm:w-auto">
            Contact Us For Details
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

