"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ContactSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Contact us</h2>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div>
                <Label htmlFor="question">Question</Label>
                <Textarea id="question" placeholder="Enter question or feedback" />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </div>
          <div className="bg-gray-200 rounded-lg h-[400px] relative">
            {/* Map placeholder - In a real application, you would integrate with a mapping service */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">Map Integration</div>
          </div>
        </div>
      </div>
    </section>
  )
}

