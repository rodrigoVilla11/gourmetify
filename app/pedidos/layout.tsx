import type React from "react"
import { OrdersView } from "@/components/orders/orders-view"

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <OrdersView>{children}</OrdersView>
}

