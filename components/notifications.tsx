"use client"

import * as React from "react"
import { Bell, Clock, Package, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  type: "warning" | "error" | "success" | "info"
  time: string
  read: boolean
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "¡Inventario Crítico!",
    message: "5 productos están por debajo del stock mínimo",
    type: "error",
    time: "Hace 5 min",
    read: false,
  },
  {
    id: "2",
    title: "Pedidos Pendientes",
    message: "3 pedidos necesitan atención inmediata",
    type: "warning",
    time: "Hace 10 min",
    read: false,
  },
  {
    id: "3",
    title: "Cierre de Caja Pendiente",
    message: "El cierre del turno anterior está pendiente",
    type: "info",
    time: "Hace 30 min",
    read: false,
  },
  {
    id: "4",
    title: "¡Excelente Servicio!",
    message: "Tiempo promedio de entrega mejorado en 15%",
    type: "success",
    time: "Hace 1 hora",
    read: true,
  },
]

const iconMap = {
  warning: AlertTriangle,
  error: Package,
  success: CheckCircle2,
  info: Clock,
}

export function NotificationsButton() {
  const [unreadCount, setUnreadCount] = React.useState(notifications.filter((n) => !n.read).length)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-muted">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="notification-badge absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-xs font-semibold text-destructive-foreground flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">Notificaciones</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
          <div className="space-y-4 py-4">
            {notifications.map((notification) => {
              const Icon = iconMap[notification.type]
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start space-x-4 rounded-lg p-4 transition-colors hover:bg-muted",
                    !notification.read && "bg-muted",
                  )}
                >
                  <div
                    className={cn("mt-1 rounded-full p-2", {
                      "bg-destructive/10 text-destructive": notification.type === "error",
                      "bg-warning/10 text-warning": notification.type === "warning",
                      "bg-success/10 text-success": notification.type === "success",
                      "bg-primary/10 text-primary": notification.type === "info",
                    })}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

