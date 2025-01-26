"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, X } from "lucide-react"

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.button
        className="bg-[#D72323] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Flame size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-20 right-0 bg-white p-4 rounded-lg shadow-lg w-64"
          >
            <h3 className="text-lg font-semibold mb-2">Quick Gas Request</h3>
            <input type="text" placeholder="Enter your address" className="w-full p-2 mb-2 border rounded" />
            <button className="w-full bg-[#D72323] text-white py-2 rounded">Request Gas</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

