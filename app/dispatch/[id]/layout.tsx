'use client'

import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ThemeProvider } from '@/contexts/dispatch/ThemeContext'
import './globals.css'

// Dynamically import ToastContainer to avoid SSR hydration issues
const ToastContainer = dynamic(() => import('react-toastify').then(mod => mod.ToastContainer), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={inter.className}>
        {mounted ? (
          <ThemeProvider>
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
          </ThemeProvider>
        ) : null}
      </body>
    </html>
  )
}
