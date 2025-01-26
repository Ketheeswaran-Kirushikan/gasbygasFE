import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ServiceCardProps {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  reverse?: boolean
}

export function ServiceCard({ title, description, imageSrc, imageAlt, reverse = false }: ServiceCardProps) {
  return (
    <div className={`grid md:grid-cols-2 gap-8 items-center ${reverse ? "md:flex-row-reverse" : ""}`}>
      <div className="relative h-[300px]">
        <Image src={imageSrc || "/placeholder.svg"} alt={imageAlt} fill className="object-cover rounded-lg" />
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <Button>Get Service</Button>
      </div>
    </div>
  )
}

