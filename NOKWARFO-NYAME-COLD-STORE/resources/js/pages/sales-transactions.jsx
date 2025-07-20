import { useForm, router, usePage } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react"
import AppLayout from '@/layouts/app-layout';

function SalesTransactions() {
  const { sales_transactions = [], products = [], customers = [] } = usePage().props;
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const form = useForm({
    customer_id: '',
    product_id: '',
    qty: '',
    unit_price: '',
    total: '',
    payment_type: '',
  });

  const handleOpen = () => {
    form.reset();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    form.reset();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    form.post('/sales-transactions', {
      onSuccess: () => handleClose(),
    });
  };
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      router.delete(`/sales-transactions/${id}`);
    }
  };

  const breadcrumbs = [
    { title: 'Sales Transactions', href: '/sales-transactions' },
  ];

  const totalAmount = sales_transactions.reduce((sum, t) => sum + parseFloat(t.total), 0);
  const cashAmount = sales_transactions.filter((t) => t.payment_type === "Cash").reduce((sum, t) => sum + parseFloat(t.total), 0);
  const creditAmount = sales_transactions.filter((t) => t.payment_type === "Credit").reduce((sum, t) => sum + parseFloat(t.total), 0);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Sales & Transactions</h1>
          <Button onClick={handleOpen}>Add Transaction</Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">GH₵{totalAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">GH₵{cashAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Cash payments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credit Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">GH₵{creditAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Credit payments</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment Type</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales_transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell>{transaction.product}</TableCell>
                    <TableCell>{transaction.qty}</TableCell>
                    <TableCell>GH₵{parseFloat(transaction.unit_price).toFixed(2)}</TableCell>
                    <TableCell className="font-medium">GH₵{parseFloat(transaction.total).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.payment_type === "Cash" ? "default" : "secondary"}>
                        {transaction.payment_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(transaction.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Add Transaction Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Sales Transaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Customer</label>
                <Select value={form.data.customer_id} onValueChange={v => form.setData('customer_id', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.errors.customer_id && <div className="text-red-500 text-xs mt-1">{form.errors.customer_id}</div>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Product</label>
                <Select value={form.data.product_id} onValueChange={v => form.setData('product_id', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(p => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.errors.product_id && <div className="text-red-500 text-xs mt-1">{form.errors.product_id}</div>}
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Quantity</label>
                  <Input type="number" min="1" value={form.data.qty} onChange={e => form.setData('qty', e.target.value)} />
                  {form.errors.qty && <div className="text-red-500 text-xs mt-1">{form.errors.qty}</div>}
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Unit Price</label>
                  <Input type="number" min="0" step="0.01" value={form.data.unit_price} onChange={e => form.setData('unit_price', e.target.value)} />
                  {form.errors.unit_price && <div className="text-red-500 text-xs mt-1">{form.errors.unit_price}</div>}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Total</label>
                <Input type="number" min="0" step="0.01" value={form.data.total} onChange={e => form.setData('total', e.target.value)} />
                {form.errors.total && <div className="text-red-500 text-xs mt-1">{form.errors.total}</div>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Payment Type</label>
                <Select value={form.data.payment_type} onValueChange={v => form.setData('payment_type', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
                {form.errors.payment_type && <div className="text-red-500 text-xs mt-1">{form.errors.payment_type}</div>}
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button type="submit" loading={form.processing}>Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}

export default SalesTransactions;
 