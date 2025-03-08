"use client"

import * as React from "react"
import { Check, ChevronsUpDown, History, Store, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Store {
  id: string
  name: string
  address: string
  status: "active" | "warning" | "error"
}

const stores: Store[] = [
  {
    id: "1",
    name: "Sucursal Centro",
    address: "Av. Principal 123",
    status: "active",
  },
  {
    id: "2",
    name: "Sucursal Norte",
    address: "Plaza Comercial 456",
    status: "warning",
  },
  {
    id: "3",
    name: "Sucursal Sur",
    address: "Calle Principal 789",
    status: "error",
  },
  {
    id: "4",
    name: "Sucursal Este",
    address: "Centro Comercial Este",
    status: "active",
  },
  {
    id: "5",
    name: "Sucursal Oeste",
    address: "Av. Comercial 321",
    status: "active",
  },
]

export function StoreSelector() {
  const [open, setOpen] = React.useState(false)
  const [selectedStore, setSelectedStore] = React.useState<Store>(stores[0])
  const [recentStores, setRecentStores] = React.useState<Store[]>([])

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && !isNaN(Number(e.key))) {
        const index = Number.parseInt(e.key) - 1
        if (index >= 0 && index < stores.length) {
          setSelectedStore(stores[index])
          updateRecentStores(stores[index])
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const updateRecentStores = (store: Store) => {
    setRecentStores((prev) => {
      const filtered = prev.filter((s) => s.id !== store.id)
      return [store, ...filtered].slice(0, 3)
    })
  }

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store)
    setOpen(false)
    updateRecentStores(store)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between hover:bg-muted premium-border"
        >
          <div className="flex items-center gap-2 truncate">
            <Store className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{selectedStore.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Buscar sucursal..." />
          <CommandList>
            <CommandEmpty>No se encontraron sucursales.</CommandEmpty>
            {recentStores.length > 0 && (
              <CommandGroup heading="Recientes">
                {recentStores.map((store) => (
                  <CommandItem
                    key={store.id}
                    onSelect={() => handleStoreSelect(store)}
                    className="flex items-center gap-2"
                  >
                    <History className="h-4 w-4 text-muted-foreground" />
                    <span>{store.name}</span>
                    <Check
                      className={cn("ml-auto h-4 w-4", selectedStore.id === store.id ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                ))}
                <CommandSeparator />
              </CommandGroup>
            )}
            <CommandGroup heading="Todas las Sucursales">
              {stores.map((store) => (
                <CommandItem
                  key={store.id}
                  onSelect={() => handleStoreSelect(store)}
                  className="flex items-center gap-2"
                >
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      store.status === "active" && "bg-success",
                      store.status === "warning" && "bg-warning",
                      store.status === "error" && "bg-destructive",
                    )}
                  />
                  <span>{store.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{store.address}</span>
                  <Check
                    className={cn("ml-auto h-4 w-4", selectedStore.id === store.id ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setSelectedStore({
                    id: "all",
                    name: "Todas las Sucursales",
                    address: "",
                    status: "active",
                  })
                  setOpen(false)
                }}
                className="flex items-center gap-2"
              >
                <Building2 className="h-4 w-4 text-primary" />
                <span>Ver Todas las Sucursales</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

