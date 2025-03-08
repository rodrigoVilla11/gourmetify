import { Card } from "@/components/ui/card"
import { Coffee, Check, Package, AlertTriangle, Truck } from "lucide-react"
import type { Order } from "./orders-view"
import { OrderCard } from "./order-card"

interface OrderColumnProps {
  title: string
  orders: Order[]
  provided: any
  icon: "new" | "preparing" | "ready" | "delivered" | "cancelled"
}

const iconMap = {
  new: Package,
  preparing: Coffee,
  ready: Check,
  delivered: Truck,
  cancelled: AlertTriangle,
}

const colorMap = {
  new: "text-blue-500",
  preparing: "text-orange-500",
  ready: "text-green-500",
  delivered: "text-primary",
  cancelled: "text-destructive",
}

export function OrderColumn({ title, orders, provided, icon }: OrderColumnProps) {
  const Icon = iconMap[icon]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${colorMap[icon]}`} />
        <h2 className="font-semibold">{title}</h2>
        <span className="ml-auto text-muted-foreground text-sm">{orders.length}</span>
      </div>
      <Card
        className="h-full overflow-auto p-4 bg-muted/50 border-t-4 transition-colors hover:border-t-primary"
        {...provided.droppableProps}
        ref={provided.innerRef}
      >
        <div className="flex flex-col gap-3">
          {orders.map((order, index) => (
            <OrderCard key={order.id} order={order} index={index} />
          ))}
          {provided.placeholder}
        </div>
      </Card>
    </div>
  )
}

