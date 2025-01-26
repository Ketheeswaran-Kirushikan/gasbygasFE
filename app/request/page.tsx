"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RequestPage() {
  const [customerType, setCustomerType] = useState("individual")

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
        Gas Request
      </motion.h1>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl mx-auto space-y-6 sm:space-y-8"
      >
        <form className="space-y-8">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <Label>Customer Type</Label>
            <RadioGroup defaultValue="individual" onValueChange={setCustomerType} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual">Individual Customer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="business" id="business" />
                <Label htmlFor="business">Business Customer</Label>
              </div>
            </RadioGroup>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            {[
              { id: "name", label: "Name", type: "text", placeholder: "Enter your name" },
              { id: "email", label: "Email", type: "email", placeholder: "Enter your email" },
              { id: "phone", label: "Phone Number", type: "tel", placeholder: "Enter your phone number" },
            ].map((field) => (
              <motion.div key={field.id} whileHover={{ scale: 1.02 }}>
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input id={field.id} type={field.type} placeholder={field.placeholder} />
              </motion.div>
            ))}

            {customerType === "business" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Enter company name" />
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.02 }}>
              <Label htmlFor="service-type">Service Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Regular Delivery</SelectItem>
                  <SelectItem value="emergency">Emergency Delivery</SelectItem>
                  <SelectItem value="subscription">Subscription Service</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="Enter quantity" />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <Label htmlFor="delivery-address">Delivery Address</Label>
              <Textarea id="delivery-address" placeholder="Enter delivery address" />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" placeholder="Any special instructions or requirements" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8"
          >
            <Button type="submit" size="lg" className="w-full">
              Submit Request
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  )
}

