import { useForm, router } from '@inertiajs/react';
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Archive, Edit, Trash2 } from "lucide-react"
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/InputError';

export default function ProductManagement({ products = [], suppliers = [], errors = {} }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { data, setData, post, put, processing, reset } = useForm({
    name: '',
    category: '',
    cost_price: '',
    supplier_id: '',
  });

  const breadcrumbs = [
    { title: 'Inventory Management', href: '/inventory-management' },
  ];

  function handleAdd(e) {
    e.preventDefault();
    post(route('products.store'), {
      onSuccess: () => {
        reset();
        setIsAddModalOpen(false);
      },
      preserveScroll: true,
      preserveState: true,
      only: ["products", "errors", "flash"],
    });
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setData({
      name: product.name,
      category: product.category || '',
      cost_price: product.cost_price || '',
      supplier_id: product.supplier_id ? product.supplier_id.toString() : '',
    });
    setIsEditModalOpen(true);
  }

  function handleUpdate(e) {
    e.preventDefault();
    put(route('products.update', editingProduct.id), {
      onSuccess: () => {
        reset();
        setIsEditModalOpen(false);
        setEditingProduct(null);
      },
      preserveScroll: true,
      preserveState: true,
      only: ["products", "errors", "flash"],
    });
  }

  function handleDelete(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
      router.delete(route('products.destroy', productId), {
        preserveScroll: true,
        preserveState: true,
        only: ["products", "flash"],
      });
    }
  }

  const totalInventoryValue = products.reduce((sum, product) => sum + (parseFloat(product.cost_price) * parseInt(product.stock_quantity)), 0)
  const productsWithStock = products.filter((p) => p.stock_quantity > 0).length

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Product to Inventory</DialogTitle>
                <DialogDescription>All fields marked with * are required.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdd} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Product Name *</Label>
                  <div className="col-span-3">
                    <Input id="name" placeholder="Enter product name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                    {errors.name && <InputError message={errors.name} className="mt-2" />}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category *</Label>
                  <div className="col-span-3">
                    <Input id="category" placeholder="e.g., Frozen, Chilled, Beverages" value={data.category} onChange={e => setData('category', e.target.value)} required />
                    {errors.category && <InputError message={errors.category} className="mt-2" />}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cost_price" className="text-right">Cost Price (GH₵) *</Label>
                  <div className="col-span-3">
                    <Input id="cost_price" type="number" step="0.01" placeholder="0.00" value={data.cost_price} onChange={e => setData('cost_price', e.target.value)} required />
                    {errors.cost_price && <InputError message={errors.cost_price} className="mt-2" />}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier_id" className="text-right">Supplier *</Label>
                  <div className="col-span-3">
                    <Select value={data.supplier_id} onValueChange={value => setData('supplier_id', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id.toString()}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.supplier_id && <InputError message={errors.supplier_id} className="mt-2" />}
                </div>
              </div>
                <Button type="submit" disabled={processing}>Add Product</Button>
              </form>
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
                <div className="text-2xl font-bold">{products.reduce((sum, p) => sum + parseInt(p.stock_quantity), 0)}</div>
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
                  <TableHead>Category</TableHead>
                  <TableHead>Cost Price (GH₵)</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.cost_price}</TableCell>
                    <TableCell>{product.supplier?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4" />
                          </Button>
                          </div>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No products found. Add your first product to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Product Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Product in Inventory</DialogTitle>
              <DialogDescription>All fields marked with * are required.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Product Name *</Label>
                <div className="col-span-3">
                  <Input id="edit-name" placeholder="Enter product name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                  {errors.name && <InputError message={errors.name} className="mt-2" />}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">Category *</Label>
                <div className="col-span-3">
                  <Input id="edit-category" placeholder="e.g., Frozen, Chilled, Beverages" value={data.category} onChange={e => setData('category', e.target.value)} required />
                  {errors.category && <InputError message={errors.category} className="mt-2" />}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cost_price" className="text-right">Cost Price (GH₵) *</Label>
                <div className="col-span-3">
                  <Input id="edit-cost_price" type="number" step="0.01" placeholder="0.00" value={data.cost_price} onChange={e => setData('cost_price', e.target.value)} required />
                  {errors.cost_price && <InputError message={errors.cost_price} className="mt-2" />}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-supplier_id" className="text-right">Supplier *</Label>
                <div className="col-span-3">
                  <Select value={data.supplier_id} onValueChange={value => setData('supplier_id', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.supplier_id && <InputError message={errors.supplier_id} className="mt-2" />}
                </div>
              </div>
              <Button type="submit" disabled={processing}>Update Product</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}