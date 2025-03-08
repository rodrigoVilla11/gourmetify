import { Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Order } from "./orders-view"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { MoreVertical, Timer, AlertTriangle, Receipt, MessageSquare, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderCardProps {
  order: Order
  index: number
}

export function OrderCard({ order, index }: OrderCardProps) {
  const timeElapsed = formatDistanceToNow(new Date(order.createdAt), {
    addSuffix: true,
    locale: es,
  })

  const isDelayed = Date.now() - new Date(order.createdAt).getTime() > order.estimatedTime * 60 * 1000

  const getPaymentMethodIcon = (method?: string) => {
    switch (method?.toLowerCase()) {
      case "mercadopago":
        return "💳"
      case "efectivo":
        return "💵"
      case "tarjeta":
        return "💳"
      default:
        return "💰"
    }
  }

  const getDeliveryPlatformBadge = (platform?: string) => {
    if (!platform) return null

    const colors: Record<string, string> = {
      ubereats: "bg-[#000000] text-white",
      rappi: "bg-[#FF441F] text-white",
      pedidosya: "bg-[#FF0000] text-white",
    }

    return (
      <Badge className={cn("ml-2", colors[platform.toLowerCase()] || "bg-primary text-primary-foreground")}>
        {platform}
      </Badge>
    )
  }

  return (
    <Draggable draggableId={order.id} index={index}>
      {(provided) => (
        <Card
          className={cn(
            "hover-card cursor-grab active:cursor-grabbing animate-in",
            isDelayed && order.status !== "delivered" && "border-destructive",
            order.isUrgent && "border-warning",
          )}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-4">
              <div className="font-semibold">Mesa {order.tableNumber}</div>
              {order.deliveryPlatform && getDeliveryPlatformBadge(order.deliveryPlatform)}
              {isDelayed && order.status !== "delivered" && (
                <div className="flex items-center gap-1 text-xs font-medium text-destructive">
                  <Timer className="h-3 w-3" />
                  Retrasado
                </div>
              )}
              {order.isUrgent && (
                <div className="flex items-center gap-1 text-xs font-medium text-warning">
                  <AlertTriangle className="h-3 w-3" />
                  Urgente
                </div>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:bg-muted p-1 rounded-md">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="gap-2">
                  <Receipt className="h-4 w-4" />
                  Ver detalles
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Agregar nota
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Procesar pago
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Cancelar pedido
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">{order.customerName}</div>
                <div className="text-sm font-medium">
                  {getPaymentMethodIcon(order.paymentMethod)} {order.paymentMethod}
                </div>
              </div>
              <div className="space-y-1">
                {order.items.map((item) => (
                  <div key={item.id} className="text-sm">
                    <div className="flex justify-between">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-muted-foreground">${item.price.toFixed(2)}</span>
                    </div>
                    {item.modifications?.map((mod, index) => (
                      <div key={index} className="text-xs text-muted-foreground pl-4">
                        • {mod}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {order.notes && (
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded-md">📝 {order.notes}</div>
              )}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-xs text-muted-foreground">{timeElapsed}</div>
                <div className="font-semibold">${order.total.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}

