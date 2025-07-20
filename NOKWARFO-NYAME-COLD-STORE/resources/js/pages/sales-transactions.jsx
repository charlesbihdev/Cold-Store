import { usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react"
import AppLayout from '@/layouts/app-layout';

function SalesTransactions() {
  const { sales_transactions = [] } = usePage().props;

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

export default SalesTransactions;
 