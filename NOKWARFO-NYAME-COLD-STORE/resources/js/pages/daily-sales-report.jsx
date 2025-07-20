import { usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, DollarSign, Package } from "lucide-react"
import AppLayout from '@/layouts/app-layout';

function DailySalesReport() {
  const { cash_sales = [], credit_sales = [], products_bought = [], credited_products = [] } = usePage().props;

  const breadcrumbs = [
    { title: 'Daily Sales Report', href: '/daily-sales-report' },
  ];

  const cashTotal = cash_sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
  const creditTotal = credit_sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
  const grandTotal = cashTotal + creditTotal;

  const totalProductsBought = products_bought.reduce((sum, item) => sum + parseInt(item.qty), 0);
  const totalCreditedProducts = credited_products.reduce((sum, item) => sum + parseInt(item.qty), 0);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Daily Sales Report</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">GH₵{cashTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{cash_sales.length} transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credit Sales</CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">GH₵{creditTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{credit_sales.length} transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Grand Total</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">GH₵{grandTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Cash + Credit</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
              <Package className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalProductsBought + totalCreditedProducts}</div>
              <p className="text-xs text-muted-foreground">Total units</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cash Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Cash Sales Today</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cash_sales.map((sale, index) => (
                    <TableRow key={index}>
                      <TableCell>{sale.time}</TableCell>
                      <TableCell className="font-medium">{sale.customer}</TableCell>
                      <TableCell>{sale.products}</TableCell>
                      <TableCell className="font-medium">GH₵{parseFloat(sale.amount).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-green-50">
                    <TableCell colSpan={3} className="font-bold">Total Cash Sales</TableCell>
                    <TableCell className="font-bold text-green-600">GH₵{cashTotal.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Credit Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Credit Sales Today</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credit_sales.map((sale, index) => (
                    <TableRow key={index}>
                      <TableCell>{sale.time}</TableCell>
                      <TableCell className="font-medium">{sale.customer}</TableCell>
                      <TableCell>{sale.products}</TableCell>
                      <TableCell className="font-medium">GH₵{parseFloat(sale.amount).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-orange-50">
                    <TableCell colSpan={3} className="font-bold">Total Credit Sales</TableCell>
                    <TableCell className="font-bold text-orange-600">GH₵{creditTotal.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Products Bought */}
          <Card>
            <CardHeader>
              <CardTitle>Products Bought (Cash Sales by Product)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products_bought.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.product}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell className="font-medium">GH₵{parseFloat(item.total_amount).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-green-50">
                    <TableCell className="font-bold">Total Products</TableCell>
                    <TableCell className="font-bold">{totalProductsBought}</TableCell>
                    <TableCell className="font-bold text-green-600">GH₵{products_bought.reduce((sum, item) => sum + parseFloat(item.total_amount), 0).toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Credited Products */}
          <Card>
            <CardHeader>
              <CardTitle>Credited Products (Credit Sales by Product)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credited_products.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.product}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell className="font-medium">GH₵{parseFloat(item.total_amount).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-orange-50">
                    <TableCell className="font-bold">Total Products</TableCell>
                    <TableCell className="font-bold">{totalCreditedProducts}</TableCell>
                    <TableCell className="font-bold text-orange-600">GH₵{credited_products.reduce((sum, item) => sum + parseFloat(item.total_amount), 0).toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

export default DailySalesReport; 