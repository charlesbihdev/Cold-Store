import { useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Wallet, TrendingDown, AlertTriangle } from "lucide-react"
import AppLayout from '@/layouts/app-layout';

function CreditCollection() {
  const { credit_collections = [], outstanding_debts = [], expenses = [] } = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    customer_id: '',
    amount_collected: '',
    notes: '',
  });

  const breadcrumbs = [
    { title: 'Credit Collection', href: '/credit-collection' },
  ];

  function handleSubmit(e) {
    e.preventDefault();
    post(route('credit-collection.store'), {
      onSuccess: () => reset(),
    });
  }

  const totalCollected = credit_collections.reduce((sum, col) => sum + parseFloat(col.amount_collected), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const netAmount = totalCollected - totalExpenses;
  const totalOutstandingDebt = outstanding_debts.reduce((sum, debt) => sum + parseFloat(debt.balance), 0);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Credit Collection & Debt Management</h1>
          <div className="flex items-center space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Record Collection
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Credit Collection</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer" className="text-right">
                      Customer
                    </Label>
                    <Input id="customer" className="col-span-3" placeholder="Customer name" value={data.customer_id} onChange={e => setData('customer_id', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount (GH₵)
                    </Label>
                    <Input id="amount" type="number" className="col-span-3" placeholder="0.00" value={data.amount_collected} onChange={e => setData('amount_collected', e.target.value)} />
                  </div>
                  <Button type="submit" disabled={processing}>Record Collection</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collections Today</CardTitle>
              <Wallet className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">GH₵{totalCollected.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From {credit_collections.length} customers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses Today</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">GH₵{totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{expenses.length} expense items</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
              <Wallet className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netAmount >= 0 ? "text-green-600" : "text-red-600"}`}>GH₵{netAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Collections - Expenses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">GH₵{totalOutstandingDebt.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{outstanding_debts.length} customers</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Credit Collections */}
          <Card>
            <CardHeader>
              <CardTitle>Amount Collected from Creditors Today</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Amount Collected</TableHead>
                    <TableHead>Debt Remaining</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credit_collections.map((collection, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{collection.customer}</TableCell>
                      <TableCell className="font-medium text-green-600">GH₵{parseFloat(collection.amount_collected).toFixed(2)}</TableCell>
                      <TableCell className={collection.debt_left > 0 ? "text-orange-600 font-medium" : "text-green-600"}>
                        {collection.debt_left > 0 ? `GH₵${parseFloat(collection.debt_left).toFixed(2)}` : "Cleared"}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-green-50">
                    <TableCell className="font-bold">Total Collected</TableCell>
                    <TableCell className="font-bold text-green-600">GH₵{totalCollected.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Daily Expenses */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{expense.description}</TableCell>
                      <TableCell className="font-medium text-red-600">GH₵{parseFloat(expense.amount).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-red-50">
                    <TableCell className="font-bold">Total Expenses</TableCell>
                    <TableCell className="font-bold text-red-600">GH₵{totalExpenses.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Outstanding Debts Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Outstanding Customer Debts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Total Debt</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Outstanding Balance</TableHead>
                  <TableHead>Last Payment</TableHead>
                  <TableHead>Days Overdue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outstanding_debts.map((debt, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{debt.customer}</TableCell>
                    <TableCell>GH₵{parseFloat(debt.total_debt).toFixed(2)}</TableCell>
                    <TableCell className="text-green-600">GH₵{parseFloat(debt.amount_paid).toFixed(2)}</TableCell>
                    <TableCell className="font-medium text-orange-600">GH₵{parseFloat(debt.balance).toFixed(2)}</TableCell>
                    <TableCell>{debt.last_payment}</TableCell>
                    <TableCell className={debt.days_overdue > 7 ? "text-red-600 font-medium" : "text-orange-600"}>
                      {debt.days_overdue} days
                    </TableCell>
                    <TableCell>
                      <Badge variant={debt.days_overdue > 7 ? "destructive" : "secondary"}>
                        {debt.days_overdue > 7 ? "Critical" : "Overdue"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Collect
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-orange-50">
                  <TableCell colSpan={3} className="font-bold">
                    Total Outstanding
                  </TableCell>
                  <TableCell className="font-bold text-orange-600">GH₵{totalOutstandingDebt.toFixed(2)}</TableCell>
                  <TableCell colSpan={4}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

export default CreditCollection; 