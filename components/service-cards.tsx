"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function ServiceCards() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-12 bg-gray-50"
    >
      <div className="container mx-auto px-4">
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 * 0 }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div className="relative h-[300px]">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-12-23%20123447-EuuVecML7qItayZIsUDH3Cu0KCWTcV.png"
                alt="Business gas service"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">For Business Organizations</h3>
              <p className="text-gray-600">
                The Gas Request Service for Business Organizations streamlines access to fuel resources by enabling
                enterprises to request and manage gas deliveries efficiently. Tailored for bulk orders, it ensures
                timely supply, reducing operational downtime.
              </p>
              <Button>Get Service</Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 * 1 }}
            className="grid md:grid-cols-2 gap-8 items-center md:flex-row-reverse"
          >
            <div className="relative h-[300px] md:order-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-12-23%20123847-JXc5RPEpsSn6Wrg8YDo3yFBWFTqTVx.png"
                alt="Consumer gas service"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4 md:order-1">
              <h3 className="text-2xl font-bold">For Consumers</h3>
              <p className="text-gray-600">
                The gas request service for consumers provides a convenient platform to order gas for domestic or
                commercial use. Consumers can place requests online or via mobile applications, specifying delivery
                preferences.
              </p>
              <Button>Get Service</Button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

