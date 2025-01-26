"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const words = ["Efficient", "Reliable", "Safe", "Fast"]

export function AnimatedHero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="bg-black text-white py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          GAS GAS BY: Your{" "}
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-[#D72323] inline-block"
          >
            {words[index]}
          </motion.span>{" "}
          Gas Service
        </h1>
        <p className="text-xl mb-8">Experience the future of gas delivery</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#D72323] text-white px-8 py-3 rounded-full text-lg font-semibold"
        >
          Get Started
        </motion.button>
      </div>
    </section>
  )
}

