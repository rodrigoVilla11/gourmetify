import type React from "react"
import Dashboard from "@/components/dashboard"

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Dashboard>{children}</Dashboard>
}

