"use client"

import { useEffect, useState } from "react"

export function ProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      // Calculate how far the user has scrolled as a percentage
      const windowHeight = window.document.documentElement.scrollHeight - window.innerHeight
      const currentPosition = window.scrollY
      const progress = (currentPosition / windowHeight) * 100
      setScrollProgress(progress)
    }

    // Add scroll event listener
    window.addEventListener("scroll", updateScrollProgress)

    // Initial calculation
    updateScrollProgress()

    // Cleanup
    return () => window.removeEventListener("scroll", updateScrollProgress)
  }, [])

  return (
    <div className="fixed right-0 top-0 h-full w-2 bg-[#3E3636] z-50">
      <div className="w-full bg-[#D72323] transition-all duration-200" style={{ height: `${scrollProgress}%` }} />
    </div>
  )
}

