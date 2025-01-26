"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function ParallaxBackground() {
  const [offsetY, setOffsetY] = useState(0)
  const handleScroll = () => setOffsetY(window.pageYOffset)

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-k7F6TAeTiVevTV7DSaGxUVPwKpBveh.png"
        alt="Parallax Background"
        layout="fill"
        objectFit="cover"
        style={{ transform: `translateY(${offsetY * 0.5}px)` }}
      />
      <div className="absolute inset-0 bg-black opacity-50" />
    </div>
  )
}

