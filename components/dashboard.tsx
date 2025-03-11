"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import {
  Home,
  Package,
  FileText,
  TrendingUp,
  Users,
  Settings,
  Plus,
  Menu,
  Sun,
  Moon,
  Clock,
  DollarSign,
  ChefHat,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LineChart, BarChart } from "@/components/charts"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NotificationsButton } from "@/components/notifications"
import { StoreSelector } from "@/components/store-selector"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Dashboard() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="border-r premium-border">
          <SidebarHeader className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold gradient-text">Gourmetify</h2>
            </div>
          </SidebarHeader>
          <ScrollArea className="flex-1">
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === "/"}>
                    <Link href="/">
                      <Home className="h-5 w-5" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Inventario" isActive={pathname === "/inventario"}>
                    <Link href="/inventory">
                      <Package className="h-5 w-5" />
                      <span className="font-medium">Inventario</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Pedidos" isActive={pathname === "/pedidos"}>
                    <Link href="/pedidos">
                      <FileText className="h-5 w-5" />
                      <span className="font-medium">Pedidos</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Reportes" isActive={pathname === "/reportes"}>
                    <Link href="/reportes">
                      <TrendingUp className="h-5 w-5" />
                      <span className="font-medium">Reportes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Empleados">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">Empleados</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Configuración">
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Configuración</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </ScrollArea>
          <div className="p-6 space-y-4 border-t premium-border">
            <Button
              className="w-full font-medium shadow-lg hover:shadow-primary/25 bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" /> Nuevo Pedido
            </Button>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:bg-muted"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <NotificationsButton />
            </div>
          </div>
        </Sidebar>

        <main className="flex-1 overflow-auto bg-muted/30">
          <div className="container mx-auto p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold">Dashboard Principal</h1>
                <p className="text-muted-foreground">Bienvenido de nuevo, aquí está el resumen de hoy</p>
              </div>
              <div className="flex items-center gap-4">
                <StoreSelector />
                <SidebarTrigger>
                  <Menu className="h-6 w-6" />
                </SidebarTrigger>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover-card premium-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold">Ventas del Día</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold animate-in">$12,450</div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-success mr-1" />
                    <p className="text-sm font-medium text-success">+15% vs. ayer</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-card premium-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold">Pedidos Activos</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold animate-in">23</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-warning/10 text-warning">
                      8 nuevos
                    </span>
                    <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      12 en prep.
                    </span>
                    <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">
                      3 listos
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-card premium-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold">Inventario Crítico</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-destructive" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold animate-in">5</div>
                  <p className="text-sm font-medium text-destructive mt-1">Requieren reposición urgente</p>
                </CardContent>
              </Card>
              <Card className="hover-card premium-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold">Tiempo Promedio</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-success" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold animate-in">18 min</div>
                  <p className="text-sm font-medium text-success mt-1">-2 min vs. semana anterior</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
              <Card className="hover-card premium-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Ventas de la Semana</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart />
                </CardContent>
              </Card>
              <Card className="hover-card premium-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Productos Más Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
