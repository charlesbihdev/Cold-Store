import { useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Package, Edit, Trash2 } from "lucide-react"
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/InputError';
import { useState } from 'react';

function Products({ products = [], suppliers = [], errors = {} }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { data, setData, post, put, processing, reset } = useForm({
    name: '',
    description: '',
    category: '',
    selling_price: '',
    cost_price: '',
    stock_quantity: '',
    supplier_id: '',
  });

  const breadcrumbs = [
    { title: 'Products', href: '/products' },
  ];

  function handleSubmit(e) {
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
      description: product.description || '',
      category: product.category,
      selling_price: product.selling_price,
      cost_price: product.cost_price,
      stock_quantity: product.stock_quantity,
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
          
          {/* Add Product Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Enter the product details. All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Product Name *
                  </Label>
                  <div className="col-span-3">
                    <Input id="name" placeholder="Enter product name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                    {errors.name && (
                      <InputError message={errors.name} className="mt-2" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <div className="col-span-3">
                    <Input id="description" placeholder="Product description" value={data.description} onChange={e => setData('description', e.target.value)} />
                    {errors.description && (
                      <InputError message={errors.description} className="mt-2" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category *
                  </Label>
                  <div className="col-span-3">
                    <Input id="category" placeholder="e.g., Frozen, Chilled, Beverages" value={data.category} onChange={e => setData('category', e.target.value)} required />
                    {errors.category && (
                      <InputError message={errors.category} className="mt-2" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="selling_price" className="text-right">
                    Selling Price (GH₵) *
                  </Label>
                  <div className="col-span-3">
                    <Input id="selling_price" type="number" step="0.01" placeholder="0.00" value={data.selling_price} onChange={e => setData('selling_price', e.target.value)} required />
                    {errors.selling_price && (
                      <InputError message={errors.selling_price} className="mt-2" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cost_price" className="text-right">
                    Cost Price (GH₵) *
                  </Label>
                  <div className="col-span-3">
                    <Input id="cost_price" type="number" step="0.01" placeholder="0.00" value={data.cost_price} onChange={e => setData('cost_price', e.target.value)} required />
                    {errors.cost_price && (
                      <InputError message={errors.cost_price} className="mt-2" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock_quantity" className="text-right">
                    Stock Quantity *
                  </Label>
                  <div className="col-span-3">
                    <Input id="stock_quantity" type="number" placeholder="0" value={data.stock_quantity} onChange={e => setData('stock_quantity', e.target.value)} required />
                    {errors.stock_quantity && (
                      <InputError message={errors.stock_quantity} className="mt-2" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right">
                    Supplier *
                  </Label>
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
                    {errors.supplier_id && (
                      <InputError message={errors.supplier_id} className="mt-2" />
                    )}
                  </div>
                </div>
                <Button type="submit" disabled={processing}>Add Product</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Product Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the product information. All fields marked with * are required.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Product Name *
                </Label>
                <div className="col-span-3">
                  <Input id="edit-name" placeholder="Enter product name" value={data.name} onChange={e => setData('name', e.target.value)} required />
                  {errors.name && (
                    <InputError message={errors.name} className="mt-2" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <div className="col-span-3">
                  <Input id="edit-description" placeholder="Product description" value={data.description} onChange={e => setData('description', e.target.value)} />
                  {errors.description && (
                    <InputError message={errors.description} className="mt-2" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category *
                </Label>
                <div className="col-span-3">
                  <Input id="edit-category" placeholder="e.g., Frozen, Chilled, Beverages" value={data.category} onChange={e => setData('category', e.target.value)} required />
                  {errors.category && (
                    <InputError message={errors.category} className="mt-2" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-selling_price" className="text-right">
                  Selling Price (GH₵) *
                </Label>
                <div className="col-span-3">
                  <Input id="edit-selling_price" type="number" step="0.01" placeholder="0.00" value={data.selling_price} onChange={e => setData('selling_price', e.target.value)} required />
                  {errors.selling_price && (
                    <InputError message={errors.selling_price} className="mt-2" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-cost_price" className="text-right">
                  Cost Price (GH₵) *
                </Label>
                <div className="col-span-3">
                  <Input id="edit-cost_price" type="number" step="0.01" placeholder="0.00" value={data.cost_price} onChange={e => setData('cost_price', e.target.value)} required />
                  {errors.cost_price && (
                    <InputError message={errors.cost_price} className="mt-2" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stock_quantity" className="text-right">
                  Stock Quantity *
                </Label>
                <div className="col-span-3">
                  <Input id="edit-stock_quantity" type="number" placeholder="0" value={data.stock_quantity} onChange={e => setData('stock_quantity', e.target.value)} required />
                  {errors.stock_quantity && (
                    <InputError message={errors.stock_quantity} className="mt-2" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-supplier" className="text-right">
                  Supplier *
                </Label>
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
                  {errors.supplier_id && (
                    <InputError message={errors.supplier_id} className="mt-2" />
                  )}
                </div>
              </div>
              <Button type="submit" disabled={processing}>Update Product</Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Directory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>GH₵{parseFloat(product.selling_price).toFixed(2)}</TableCell>
                    <TableCell>GH₵{parseFloat(product.cost_price).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock_quantity < 10 ? "destructive" : "default"}>
                        {product.stock_quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.supplier?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
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
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No products found. Add your first product to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

export default Products; 