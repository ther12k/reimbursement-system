import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

// Metadata needs to be in a separate file for app router when using 'use client'
export const metadata = {
  title: "ReimburseEase - Expense Management System",
  description: "Streamlined reimbursement management system",
    generator: 'v0.dev'
}

import ClientLayout from "./ClientLayout"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
