import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Archive } from "lucide-react"
import AppLayout from '@/layouts/app-layout';

function ProductManagement() {
  const [products] = useState([
    {
      id: 1,
      name: "16 KILOS",
      stock: 45,
      costPrice: 525,
      totalValue: 23625,
      supplier: "Fresh Farms Ltd",
    },
    {
      id: 2,
      name: "KOREA 16+",
      stock: 32,
      costPrice: 525,
      totalValue: 16800,
      supplier: "Ocean Fresh Co",
    },
    {
      id: 3,
      name: "25+ CHINA",
      stock: 18,
      costPrice: 524,
      totalValue: 9432,
      supplier: "Asia Import Ltd",
    },
    {
      id: 4,
      name: "VIRA 16 KILO",
      stock: 25,
      costPrice: 527,
      totalValue: 13175,
      supplier: "Local Suppliers",
    },
    {
      id: 5,
      name: "AAA",
      stock: 0,
      costPrice: 0,
      totalValue: 0,
      supplier: "-",
    },
    {
      id: 6,
      name: "CHOFI",
      stock: 0,
      costPrice: 0,
      totalValue: 0,
      supplier: "-",
    },
    {
      id: 7,
      name: "YELLOW TAI",
      stock: 0,
      costPrice: 0,
      totalValue: 0,
      supplier: "-",
    },
    {
      id: 8,
      name: "ABIDJAN",
      stock: 0,
      costPrice: 0,
      totalValue: 0,
      supplier: "-",
    },
    {
      id: 9,
      name: "EBA",
      stock: 0,
      costPrice: 0,
      totalValue: 0,
      supplier: "-",
    },
    {
      id: 10,
      name: "SAFUL",
      stock: 0,
      costPrice: 0,
      totalValue: 0,
      supplier: "-",
    },
    {
      id: 11,
      name: "ADOR",
      stock: 0,
      costPrice: 0,
      totalValue: 0,
      supplier: "-",
    },
    {
      id: 12,
      name: "4IX FISH",
      stock: 0,
      costPrice: 0,
      totalValue: 0,
      supplier: "-",
    },
  ])

  const totalInventoryValue = products.reduce((sum, product) => sum + product.totalValue, 0)
  const productsWithStock = products.filter((p) => p.stock > 0).length

  const breadcrumbs = [
    { title: 'Product Management', href: '/product-management' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Product to Inventory</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product" className="text-right">
                    Product
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16-kilos">16 KILOS</SelectItem>
                      <SelectItem value="korea-16">KOREA 16+</SelectItem>
                      <SelectItem value="25-china">25+ CHINA</SelectItem>
                      <SelectItem value="vira-16">VIRA 16 KILO</SelectItem>
                      <SelectItem value="aaa">AAA</SelectItem>
                      <SelectItem value="chofi">CHOFI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right">
                    Supplier
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fresh-farms">Fresh Farms Ltd</SelectItem>
                      <SelectItem value="ocean-fresh">Ocean Fresh Co</SelectItem>
                      <SelectItem value="asia-import">Asia Import Ltd</SelectItem>
                      <SelectItem value="local">Local Suppliers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock-quantity" className="text-right">
                    Stock Quantity
                  </Label>
                  <Input id="stock-quantity" type="number" className="col-span-3" placeholder="Enter quantity to add" />
                </div>
              </div>
              <Button>Add to Inventory</Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-green-600" />
              Inventory Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-sm text-muted-foreground">Total Products</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{productsWithStock}</div>
                <p className="text-sm text-muted-foreground">Products in Stock</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{products.reduce((sum, p) => sum + p.stock, 0)}</div>
                <p className="text-sm text-muted-foreground">Total Stock Units</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">GH₵{totalInventoryValue.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">Total Inventory Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Cost Price (GH₵)</TableHead>
                  <TableHead>Total Value (GH₵)</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className={product.stock === 0 ? "text-gray-400" : ""}>{product.stock}</TableCell>
                    <TableCell className={product.costPrice === 0 ? "text-gray-400" : ""}>
                      {product.costPrice === 0 ? "-" : `GH₵${product.costPrice.toFixed(2)}`}
                    </TableCell>
                    <TableCell className={product.totalValue === 0 ? "text-gray-400" : "font-medium text-green-600"}>
                      {product.totalValue === 0 ? "-" : `GH₵${product.totalValue.toFixed(2)}`}
                    </TableCell>
                    <TableCell className={product.supplier === "-" ? "text-gray-400" : ""}>{product.supplier}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Add Stock
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Stock - {product.name}</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="stock-date" className="text-right">
                                Date
                              </Label>
                              <Input
                                id="stock-date"
                                type="date"
                                className="col-span-3"
                                defaultValue={new Date().toISOString().split("T")[0]}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="add-quantity" className="text-right">
                                Quantity
                              </Label>
                              <Input id="add-quantity" type="number" className="col-span-3" placeholder="0" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="cost" className="text-right">
                                Cost Price (GH₵)
                              </Label>
                              <Input
                                id="cost"
                                type="number"
                                className="col-span-3"
                                defaultValue={product.costPrice || ""}
                                placeholder="0.00"
                                disabled
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="supplier-select" className="text-right">
                                Supplier
                              </Label>
                              <Select defaultValue={product.supplier !== "-" ? product.supplier : ""}>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select supplier" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Fresh Farms Ltd">Fresh Farms Ltd</SelectItem>
                                  <SelectItem value="Ocean Fresh Co">Ocean Fresh Co</SelectItem>
                                  <SelectItem value="Asia Import Ltd">Asia Import Ltd</SelectItem>
                                  <SelectItem value="Local Suppliers">Local Suppliers</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button>Add to Stock</Button>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

export default ProductManagement; 