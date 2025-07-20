import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, AlertTriangle, Clock, DollarSign } from "lucide-react"
import AppLayout from '@/layouts/app-layout';

function CreditManagement() {
  const [creditSales] = useState([
    {
      id: "CR001",
      date: "2024-01-15",
      customer: "Jane Smith",
      products: ["Fish Fillets x1", "Vegetables x2"],
      totalAmount: 40.15,
      dueDate: "2024-01-22",
      status: "Pending",
      daysOverdue: 0,
    },
    {
      id: "CR002",
      date: "2024-01-12",
      customer: "Robert Wilson",
      products: ["Chicken x3", "Pizza x2"],
      totalAmount: 55.0,
      dueDate: "2024-01-19",
      status: "Overdue",
      daysOverdue: 4,
    },
    {
      id: "CR003",
      date: "2024-01-10",
      customer: "Emily Davis",
      products: ["Ice Cream x5"],
      totalAmount: 27.5,
      dueDate: "2024-01-17",
      status: "Overdue",
      daysOverdue: 6,
    },
    {
      id: "CR004",
      date: "2024-01-14",
      customer: "Michael Brown",
      products: ["Pizza x1", "Vegetables x1"],
      totalAmount: 16.75,
      dueDate: "2024-01-21",
      status: "Pending",
      daysOverdue: 0,
    },
    {
      id: "CR005",
      date: "2024-01-08",
      customer: "Sarah Johnson",
      products: ["Chicken x2", "Fish x1"],
      totalAmount: 46.0,
      dueDate: "2024-01-15",
      status: "Overdue",
      daysOverdue: 8,
    },
  ])

  const creditStats = {
    totalCredit: creditSales.reduce((sum, sale) => sum + sale.totalAmount, 0),
    pendingAmount: creditSales.filter((s) => s.status === "Pending").reduce((sum, sale) => sum + sale.totalAmount, 0),
    overdueAmount: creditSales.filter((s) => s.status === "Overdue").reduce((sum, sale) => sum + sale.totalAmount, 0),
    overdueCount: creditSales.filter((s) => s.status === "Overdue").length,
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "secondary"
      case "Overdue":
        return "destructive"
      default:
        return "default"
    }
  }

  const breadcrumbs = [
    { title: 'Credit Management', href: '/credit-management' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Credit Management</h1>
          <Button>
            <CreditCard className="h-4 w-4 mr-2" />
            New Credit Sale
          </Button>
        </div>

        {/* Credit Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credit</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${creditStats.totalCredit.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Outstanding amount</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">${creditStats.pendingAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Within due date</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${creditStats.overdueAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{creditStats.overdueCount} accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">78%</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Credit Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Credit ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Days Overdue</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell className="font-medium">{sale.customer}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {sale.products.map((product, idx) => (
                          <div key={idx}>{product}</div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${sale.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{sale.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(sale.status)}>{sale.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {sale.daysOverdue > 0 ? (
                        <span className="text-red-600 font-medium">{sale.daysOverdue} days</span>
                      ) : (
                        <span className="text-green-600">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Collect
                        </Button>
                        <Button variant="outline" size="sm">
                          Extend
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Customer Credit Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Credit Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(new Set(creditSales.map((s) => s.customer))).map((customer) => {
                const customerSales = creditSales.filter((s) => s.customer === customer)
                const totalOwed = customerSales.reduce((sum, sale) => sum + sale.totalAmount, 0)
                const hasOverdue = customerSales.some((s) => s.status === "Overdue")

                return (
                  <Card key={customer} className={hasOverdue ? "border-red-200" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{customer}</p>
                          <p className="text-sm text-muted-foreground">{customerSales.length} credit sale(s)</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${totalOwed.toFixed(2)}</p>
                          {hasOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

export default CreditManagement; 