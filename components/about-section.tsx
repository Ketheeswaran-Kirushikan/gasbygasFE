import Image from "next/image"
import { Button } from "@/components/ui/button"

export function AboutSection() {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-[300px]">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-12-23%20123447-EuuVecML7qItayZIsUDH3Cu0KCWTcV.png"
              alt="Gas delivery service"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">About Us</h2>
            <p className="text-gray-600 mb-6">
              The ORM content for the Gas Requesting System ensures efficient gas order management, tracking requests,
              approvals, and delivery status seamlessly.
            </p>
            <Button>Explore</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

