import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { DollarSign, TrendingUp } from 'lucide-react';

function ProfitAnalysis() {
    const { total_product_sales = [], paid_product_sales = [] } = usePage().props;

    const breadcrumbs = [{ title: 'Profit Analysis', href: '/profit-analysis' }];

    const totalSalesProfit = total_product_sales.reduce((sum, item) => sum + parseFloat(item.profit), 0);
    const paidSalesProfit = paid_product_sales.reduce((sum, item) => sum + parseFloat(item.profit), 0);
    const totalRevenue = total_product_sales.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);
    const totalCost = total_product_sales.reduce((sum, item) => sum + parseFloat(item.total_cost_amount), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen space-y-6 bg-gray-100 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Profit Analysis</h1>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sales Profit</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">GH₵{totalSalesProfit.toFixed(2)}</div>
                            <p className="text-muted-foreground text-xs">Cash + Credit</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cash Sales Profit</CardTitle>
                            <DollarSign className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">GH₵{paidSalesProfit.toFixed(2)}</div>
                            <p className="text-muted-foreground text-xs">Cash only</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">GH₵{totalRevenue.toFixed(2)}</div>
                            <p className="text-muted-foreground text-xs">All sales</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                            <DollarSign className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">GH₵{totalCost.toFixed(2)}</div>
                            <p className="text-muted-foreground text-xs">Product costs</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Total Product Sales */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Product Sales (Cash + Credit)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Units Sold</TableHead>
                                        <TableHead>Cost Price</TableHead>
                                        <TableHead>Total Cost</TableHead>
                                        <TableHead>Selling Price</TableHead>
                                        <TableHead>Total Amount</TableHead>
                                        <TableHead>Profit</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {total_product_sales.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.product}</TableCell>
                                            <TableCell>{item.total_product_sold}</TableCell>
                                            <TableCell>GH₵{parseFloat(item.unit_selling_price_price).toFixed(2)}</TableCell>
                                            <TableCell>GH₵{parseFloat(item.total_cost_amount).toFixed(2)}</TableCell>
                                            <TableCell>GH₵{parseFloat(item.selling_price).toFixed(2)}</TableCell>
                                            <TableCell>GH₵{parseFloat(item.total_amount).toFixed(2)}</TableCell>
                                            <TableCell className="font-medium text-green-600">GH₵{parseFloat(item.profit).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-green-50">
                                        <TableCell colSpan={6} className="font-bold">
                                            Total Profit
                                        </TableCell>
                                        <TableCell className="font-bold text-green-600">GH₵{totalSalesProfit.toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Paid Product Sales */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Paid Product Sales (Cash Only)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Units Sold</TableHead>
                                        <TableHead>Cost Price</TableHead>
                                        <TableHead>Total Cost</TableHead>
                                        <TableHead>Selling Price</TableHead>
                                        <TableHead>Total Amount</TableHead>
                                        <TableHead>Profit</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paid_product_sales.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.product}</TableCell>
                                            <TableCell>{item.total_product_sold}</TableCell>
                                            <TableCell>GH₵{parseFloat(item.unit_selling_price_price).toFixed(2)}</TableCell>
                                            <TableCell>GH₵{parseFloat(item.total_cost_amount).toFixed(2)}</TableCell>
                                            <TableCell>GH₵{parseFloat(item.selling_price).toFixed(2)}</TableCell>
                                            <TableCell>GH₵{parseFloat(item.total_amount).toFixed(2)}</TableCell>
                                            <TableCell className="font-medium text-green-600">GH₵{parseFloat(item.profit).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-blue-50">
                                        <TableCell colSpan={6} className="font-bold">
                                            Total Cash Profit
                                        </TableCell>
                                        <TableCell className="font-bold text-blue-600">GH₵{paidSalesProfit.toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

export default ProfitAnalysis;
