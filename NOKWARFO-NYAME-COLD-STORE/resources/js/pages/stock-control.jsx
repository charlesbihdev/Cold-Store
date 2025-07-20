import { useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Truck, Edit, Trash2 } from "lucide-react"
import AppLayout from '@/layouts/app-layout';

export default function StockControl() {
  const { stock_movements = [], products = [], suppliers = [], stock_activity_summary = [], date } = usePage().props;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { data, setData, post, processing, errors, reset } = useForm({
    product_id: '',
    supplier_id: '',
    type: 'in',
    quantity: '',
    unit_cost: '',
    total_cost: '',
    notes: '',
  });

  const breadcrumbs = [
    { title: 'Stock Control', href: '/stock-control' },
  ];

  function openAddStock(product) {
    setSelectedProduct(product);
    setData({
      product_id: product.id,
      supplier_id: product.supplier_id ? product.supplier_id.toString() : '',
      type: 'received',
      quantity: '',
      unit_cost: product.cost_price || '',
      total_cost: '',
      notes: '',
    });
    setIsAddModalOpen(true);
  }

  function getQuantityInputProps() {
    if (data.type === 'adjusted') {
      return {
        type: 'number',
        step: 1,
        placeholder: 'e.g. -5 for loss, 5 for gain',
        min: undefined,
      };
    }
    return {
      type: 'number',
      step: 1,
      placeholder: 'Enter quantity',
      min: 1,
    };
  }

  function handleAddStock(e) {
    e.preventDefault();
    post(route('stock-control.store'), {
      onSuccess: () => {
        reset();
        setIsAddModalOpen(false);
        setSelectedProduct(null);
      },
      preserveScroll: true,
      preserveState: true,
      only: ["stock_movements", "errors", "flash"],
    });
  }

  function handleDeleteStockMovement(id) {
    if (confirm('Are you sure you want to delete this stock movement?')) {
      router.delete(route('stock-control.destroy', id), {
        preserveScroll: true,
        preserveState: false,
      });
    }
  }

  // Calculate current stock for each product (if not provided by backend, this is a placeholder)
  const productStockMap = {};
  stock_movements.forEach(movement => {
    if (!productStockMap[movement.product_id]) productStockMap[movement.product_id] = 0;
    if (movement.type === 'in' || movement.type === 'received') productStockMap[movement.product_id] += movement.quantity;
    else if (movement.type === 'out' || movement.type === 'sold') productStockMap[movement.product_id] -= movement.quantity;
    else if (movement.type === 'adjusted') productStockMap[movement.product_id] += movement.quantity; // could be positive or negative
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        {/* Daily Stock Movement Table */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-6 w-6 text-gray-500" />
            <h2 className="text-2xl font-bold">Product Stock Activity Summary for Today ({date && new Date(date).toLocaleDateString()})</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Stock Available</TableHead>
                  <TableHead>Previous Stock</TableHead>
                  <TableHead className="bg-blue-50">Total Available</TableHead>
                  <TableHead>Cash Sales</TableHead>
                  <TableHead>Credit Sales</TableHead>
                  <TableHead className="bg-green-50">Total Sales</TableHead>
                  <TableHead className="bg-yellow-50">Remaining Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stock_activity_summary.map((row, idx) => (
                  <TableRow key={row.product + idx}>
                    <TableCell className="font-medium">{row.product}</TableCell>
                    <TableCell className="text-center">{row.stock_available}</TableCell>
                    <TableCell className="text-center">{row.previous_stock}</TableCell>
                    <TableCell className="text-center bg-blue-50 font-semibold">{row.total_available}</TableCell>
                    <TableCell className="text-center">{row.cash_sales}</TableCell>
                    <TableCell className="text-center">{row.credit_sales}</TableCell>
                    <TableCell className="text-center bg-green-50 font-semibold">{row.total_sales}</TableCell>
                    <TableCell className="text-center bg-yellow-50 font-semibold">{row.remaining_stock}</TableCell>
                  </TableRow>
                ))}
                {stock_activity_summary.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-4 text-center text-muted-foreground">No data for today.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Formula explanations */}
          <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-blue-50 border border-blue-100 rounded-sm"></span>
              <span>Total Available = Stock Received + Previous Stock</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-green-50 border border-green-100 rounded-sm"></span>
              <span>Total Sales = Cash Sales + Credit Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-yellow-50 border border-yellow-100 rounded-sm"></span>
              <span>Remaining Stock = Total Available - Total Sales</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
        </div>
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
                  <TableHead>Supplier</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{productStockMap[product.id] ?? 0}</TableCell>
                    <TableCell>{product.supplier?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => openAddStock(product)}>
                        Add Stock
              </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Stock Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
              <DialogTitle>Add Stock for {selectedProduct?.name}</DialogTitle>
              </DialogHeader>
            <form onSubmit={handleAddStock} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type *</Label>
                <div className="col-span-3">
                  <select id="type" value={data.type} onChange={e => setData('type', e.target.value)} required className="w-full border rounded px-2 py-1">
                    <option value="received">Stock In</option>
                    <option value="sold">Stock Out</option>
                    <option value="adjusted">Adjusted</option>
                  </select>
                  {errors.type && <div className="text-red-500 text-xs mt-1">{errors.type}</div>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">Quantity *</Label>
                <div className="col-span-3">
                  <Input id="quantity" {...getQuantityInputProps()} value={data.quantity} onChange={e => setData('quantity', e.target.value)} required />
                  {errors.quantity && <div className="text-red-500 text-xs mt-1">{errors.quantity}</div>}
                  {data.type === 'adjusted' && (
                    <div className="text-xs text-muted-foreground mt-1">Use a negative number for loss (e.g. -5 for damaged/expired), positive for gain/correction.</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit_cost" className="text-right">Unit Cost (GH₵) *</Label>
                <div className="col-span-3">
                  <Input id="unit_cost" type="number" step="0.01" placeholder="0.00" value={data.unit_cost} onChange={e => setData('unit_cost', e.target.value)} required />
                  {errors.unit_cost && <div className="text-red-500 text-xs mt-1">{errors.unit_cost}</div>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supplier_id" className="text-right">Supplier *</Label>
                <div className="col-span-3">
                  <select id="supplier_id" value={data.supplier_id} onChange={e => setData('supplier_id', e.target.value)} required className="w-full border rounded px-2 py-1">
                    <option value="">Select supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  {errors.supplier_id && <div className="text-red-500 text-xs mt-1">{errors.supplier_id}</div>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <div className="col-span-3">
                  <Input id="notes" placeholder="Optional notes" value={data.notes} onChange={e => setData('notes', e.target.value)} />
                </div>
              </div>
              <Button type="submit" disabled={processing}>Add Stock</Button>
              </form>
            </DialogContent>
          </Dialog>

        {/* Stock Movements Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Stock Movements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stock_movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>{movement.product && movement.product.name}</TableCell>
                    <TableCell>{movement.supplier && movement.supplier.name}</TableCell>
                    <TableCell>{movement.type}</TableCell>
                    <TableCell>{movement.quantity}</TableCell>
                    <TableCell>GH₵{parseFloat(movement.unit_cost).toFixed(2)}</TableCell>
                    <TableCell>GH₵{parseFloat(movement.total_cost).toFixed(2)}</TableCell>
                    <TableCell>{movement.notes}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteStockMovement(movement.id)}>
                        Delete
                      </Button>
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