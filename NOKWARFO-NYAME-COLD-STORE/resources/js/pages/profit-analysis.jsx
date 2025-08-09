import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { DollarSign, TrendingUp } from 'lucide-react';
import SalesTable from '../components/profit/SalesTable';
import SummaryCard from '../components/profit/SummaryCard';

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
                    <SummaryCard
                        title="Total Sales Profit"
                        value={totalSalesProfit}
                        icon={TrendingUp}
                        iconColor="text-green-600"
                        description="Cash + Credit"
                    />
                    <SummaryCard
                        title="Cash Sales Profit"
                        value={paidSalesProfit}
                        icon={DollarSign}
                        iconColor="text-blue-600"
                        description="Cash only"
                    />
                    <SummaryCard title="Total Revenue" value={totalRevenue} icon={TrendingUp} iconColor="text-purple-600" description="All sales" />
                    <SummaryCard title="Total Cost" value={totalCost} icon={DollarSign} iconColor="text-red-600" description="Product costs" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <SalesTable
                        title="Total Product Sales (Cash + Credit)"
                        sales={total_product_sales}
                        rowColorClass="bg-green-50"
                        profitColorClass="text-green-600"
                        totalProfit={totalSalesProfit}
                    />
                    <SalesTable
                        title="Paid Product Sales (Cash Only)"
                        sales={paid_product_sales}
                        rowColorClass="bg-blue-50"
                        profitColorClass="text-blue-600"
                        totalProfit={paidSalesProfit}
                    />
                </div>
            </div>
        </AppLayout>
    );
}

export default ProfitAnalysis;
