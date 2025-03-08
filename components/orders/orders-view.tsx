"use client"

import * as React from "react"
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { Plus, Search } from "lucide-react"
import { OrderColumn } from "./order-column"
import { OrderDialog } from "./order-dialog"
import { Button } from "@/components/ui/button"
import { StoreSelector } from "@/components/store-selector"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type OrderStatus = "new" | "preparing" | "ready" | "delivered" | "cancelled"

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  notes?: string
  modifications?: string[]
}

export interface Order {
  id: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  customerName: string
  tableNumber?: string
  createdAt: Date
  estimatedTime: number
  notes?: string
  paymentMethod?: string
  deliveryPlatform?: string
  isUrgent?: boolean
}

const initialOrders: Order[] = [
  {
    id: "1",
    status: "new",
    items: [
      {
        id: "1",
        name: "Pizza Margherita",
        quantity: 1,
        price: 12.99,
        modifications: ["Sin cebolla", "Extra queso"],
      },
      {
        id: "2",
        name: "Coca-Cola",
        quantity: 2,
        price: 2.5,
      },
    ],
    total: 17.99,
    customerName: "Juan Pérez",
    tableNumber: "5",
    createdAt: new Date(),
    estimatedTime: 20,
    notes: "Cliente frecuente - Prefiere la pizza bien cocida",
    paymentMethod: "MercadoPago",
    isUrgent: true,
  },
  {
    id: "2",
    status: "preparing",
    items: [
      {
        id: "3",
        name: "Hamburguesa Clásica",
        quantity: 2,
        price: 15.99,
        modifications: ["Término medio", "Sin pepinillos"],
      },
    ],
    total: 31.98,
    customerName: "María García",
    tableNumber: "3",
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    estimatedTime: 15,
    paymentMethod: "Efectivo",
  },
  {
    id: "3",
    status: "ready",
    items: [
      {
        id: "4",
        name: "Ensalada César",
        quantity: 1,
        price: 9.99,
      },
      {
        id: "5",
        name: "Agua Mineral",
        quantity: 1,
        price: 1.99,
      },
    ],
    total: 11.98,
    customerName: "Carlos López",
    tableNumber: "7",
    createdAt: new Date(Date.now() - 1000 * 60 * 20),
    estimatedTime: 10,
    paymentMethod: "Tarjeta",
    deliveryPlatform: "UberEats",
  },
]

export function OrdersView() {
  const [orders, setOrders] = React.useState<Order[]>(initialOrders)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [filterStatus, setFilterStatus] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const { toast } = useToast()

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    const newOrders = Array.from(orders)
    const [removed] = newOrders.splice(source.index, 1)
    removed.status = destination.droppableId as OrderStatus
    newOrders.splice(destination.index, 0, removed)
    setOrders(newOrders)

    toast({
      title: "Pedido actualizado",
      description: `El pedido ha sido movido a ${destination.droppableId}`,
    })
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber?.includes(searchQuery) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  const getOrdersByStatus = (status: OrderStatus) => {
    return filteredOrders.filter((order) => order.status === status)
  }

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "n" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setIsDialogOpen(true)
      }
    }

    window.addEventListener("keypress", handleKeyPress)
    return () => window.removeEventListener("keypress", handleKeyPress)
  }, [])

  return (
    <div className="h-full flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">Administra y controla todos los pedidos en tiempo real</p>
        </div>
        <div className="flex items-center gap-4">
          <StoreSelector />
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25"
          >
            <Plus className="mr-2 h-4 w-4" /> Nuevo Pedido
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, mesa o productos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="new">Nuevos</SelectItem>
            <SelectItem value="preparing">En preparación</SelectItem>
            <SelectItem value="ready">Listos</SelectItem>
            <SelectItem value="delivered">Entregados</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          <Droppable droppableId="new">
            {(provided) => (
              <OrderColumn title="Nuevos" orders={getOrdersByStatus("new")} provided={provided} icon="new" />
            )}
          </Droppable>
          <Droppable droppableId="preparing">
            {(provided) => (
              <OrderColumn
                title="En Preparación"
                orders={getOrdersByStatus("preparing")}
                provided={provided}
                icon="preparing"
              />
            )}
          </Droppable>
          <Droppable droppableId="ready">
            {(provided) => (
              <OrderColumn title="Listos" orders={getOrdersByStatus("ready")} provided={provided} icon="ready" />
            )}
          </Droppable>
          <Droppable droppableId="delivered">
            {(provided) => (
              <OrderColumn
                title="Entregados"
                orders={getOrdersByStatus("delivered")}
                provided={provided}
                icon="delivered"
              />
            )}
          </Droppable>
        </div>
      </DragDropContext>

      <OrderDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}

