"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function AboutPage() {
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
        About Us
      </motion.h1>

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center mb-8 sm:mb-12"
      >
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            The ORM content for the Gas Requesting System ensures efficient gas order management, tracking requests,
            approvals, and delivery status seamlessly. We strive to provide the best service to both businesses and
            individual consumers.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg">Learn More</Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative h-[300px] sm:h-[400px]"
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-12-23%20123847-JXc5RPEpsSn6Wrg8YDo3yFBWFTqTVx.png"
            alt="Gas service operations"
            fill
            className="object-cover rounded-lg"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12"
      >
        {[
          {
            title: "Quality Service",
            description:
              "We maintain the highest standards in gas delivery and customer service, ensuring safety and reliability in every transaction.",
          },
          {
            title: "Expert Team",
            description:
              "Our team consists of experienced professionals dedicated to providing excellent service and support to all our customers.",
          },
          {
            title: "24/7 Support",
            description:
              "We offer round-the-clock customer support to ensure your gas supply needs are met at any time.",
          },
        ].map((item, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

