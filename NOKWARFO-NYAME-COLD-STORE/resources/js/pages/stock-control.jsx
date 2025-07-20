import { useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Truck } from "lucide-react"
import AppLayout from '@/layouts/app-layout';

function StockControl() {
  const { stock_movements = [] } = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    product_id: '',
    supplier_id: '',
    type: '',
    quantity: '',
    unit_cost: '',
    total_cost: '',
    notes: '',
  });

  const breadcrumbs = [
    { title: 'Stock Control', href: '/stock-control' },
  ];

  function handleSubmit(e) {
    e.preventDefault();
    post(route('stock-control.store'), {
      onSuccess: () => reset(),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Stock Control</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Record Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Record Stock Movement</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                {/* Add your stock movement form fields here */}
                <Button type="submit" disabled={processing}>Record</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stock Movements List */}
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
                      <Button variant="outline" size="sm">
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

export default StockControl; 