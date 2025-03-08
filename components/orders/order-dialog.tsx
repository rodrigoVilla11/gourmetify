"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Minus, Search, X } from "lucide-react"

interface OrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Product {
  id: string
  name: string
  price: number
  category: string
}

const demoProducts: Product[] = [
  { id: "1", name: "Pizza Margherita", price: 12.99, category: "Pizzas" },
  { id: "2", name: "Pizza Pepperoni", price: 13.99, category: "Pizzas" },
  { id: "3", name: "Hamburguesa Clásica", price: 9.99, category: "Hamburguesas" },
  { id: "4", name: "Hamburguesa Doble", price: 12.99, category: "Hamburguesas" },
  { id: "5", name: "Ensalada César", price: 8.99, category: "Ensaladas" },
  { id: "6", name: "Coca-Cola", price: 2.5, category: "Bebidas" },
  { id: "7", name: "Agua Mineral", price: 1.5, category: "Bebidas" },
]

interface OrderItem extends Product {
  quantity: number
  notes?: string
}

export function OrderDialog({ open, onOpenChange }: OrderDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedItems, setSelectedItems] = React.useState<OrderItem[]>([])
  const [customerName, setCustomerName] = React.useState("")
  const [tableNumber, setTableNumber] = React.useState("")
  const [orderNotes, setOrderNotes] = React.useState("")

  const filteredProducts = demoProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const addItem = (product: Product) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeItem = (productId: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, delta: number) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + delta
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        }
        return item
      }),
    )
  }

  const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Nuevo Pedido</DialogTitle>
          <DialogDescription>Crea un nuevo pedido. Completa todos los campos necesarios.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Cliente</Label>
              <Input
                id="customer"
                placeholder="Nombre del cliente"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="table">Mesa</Label>
              <Select value={tableNumber} onValueChange={setTableNumber}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mesa" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      Mesa {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Productos</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            <ScrollArea className="h-[200px] rounded-md border p-2">
              <div className="grid grid-cols-2 gap-2">
                {filteredProducts.map((product) => (
                  <Button
                    key={product.id}
                    variant="outline"
                    className="justify-between h-auto py-2 px-4"
                    onClick={() => addItem(product)}
                  >
                    <div className="flex flex-col items-start">
                      <span>{product.name}</span>
                      <span className="text-sm text-muted-foreground">${product.price.toFixed(2)}</span>
                    </div>
                    <Badge variant="secondary">{product.category}</Badge>
                  </Button>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-2">
              <Label>Productos Seleccionados</Label>
              <ScrollArea className="h-[200px] rounded-md border">
                <div className="p-4 space-y-4">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 p-2 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {selectedItems.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">No hay productos seleccionados</div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              placeholder="Notas especiales para la cocina..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-lg font-semibold">Total: ${total.toFixed(2)}</div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary"
                onClick={() => onOpenChange(false)}
              >
                Crear Pedido
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

