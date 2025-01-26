"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedServiceCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function AnimatedServiceCard({ icon, title, description }: AnimatedServiceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
        className="text-[#D72323] text-4xl mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

