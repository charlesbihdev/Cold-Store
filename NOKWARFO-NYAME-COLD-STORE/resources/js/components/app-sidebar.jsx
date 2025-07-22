import {
  BarChart3,
  Package,
  Truck,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Home,
  Menu,
  Users,
  Archive,
  Banknote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Link, usePage } from '@inertiajs/react';

const menuItems = [
  { id: "dashboard.index", label: "Dashboard", icon: Home, section: "main" },
  { id: "products.index", label: "Products", icon: Package, section: "setup" },
  { id: "suppliers.index", label: "Suppliers", icon: Users, section: "setup" },
  { id: "customers.index", label: "Customers", icon: Users, section: "setup" },
  // { id: "inventory-management.index", label: "Inventory Management", icon: Archive, section: "inventory" },
  { id: "stock-control.index", label: "Stock Control", icon: Truck, section: "inventory" },
  // { id: "sales.index", label: "Sales & Transactions", icon: ShoppingCart, section: "sales" },
  { id: "sales-transactions.index", label: "Sales Transactions", icon: ShoppingCart, section: "sales" },
  { id: "daily-sales-report.index", label: "Daily Sales Report", icon: BarChart3, section: "sales" },
  { id: "credit-collection.index", label: "Credit Collection", icon: CreditCard, section: "financial" },
  { id: "profit-analysis.index", label: "Profit Analysis", icon: TrendingUp, section: "financial" },
  { id: "bank-transfers.index", label: "Bank Transfers", icon: Banknote, section: "financial" },
];

const sections = [
  { id: "main", label: "Main" },
  { id: "setup", label: "Setup & Configuration" },
  { id: "inventory", label: "Inventory Management" },
  { id: "sales", label: "Sales & Transactions" },
  { id: "financial", label: "Financial Management" },
]

function AppSidebar({ activeSection, setActiveSection }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const page = usePage();

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}> 
          <Package className="h-6 w-6 text-blue-600 flex-shrink-0" />
          {!isCollapsed && <span className="font-bold text-lg">Cold Store POS</span>}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {sections.map((section) => {
            const sectionItems = menuItems.filter((item) => item.section === section.id)
            return (
              <div key={section.id}>
                {!isCollapsed && (
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{section.label}</h3>
                )}
                <div className="space-y-1">
                  {sectionItems.map((item) => (
                    <Link
                      key={item.id}
                      href={route(item.id)}
                      className={cn(
                        "flex items-center gap-2 w-full h-10 px-2 rounded-md transition-colors",
                        isCollapsed ? "justify-center" : "justify-start",
                        route().current(item.id) ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-gray-100 text-gray-700"
                      )}
                      title={isCollapsed ? item.label : undefined}
                      prefetch
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default AppSidebar;

