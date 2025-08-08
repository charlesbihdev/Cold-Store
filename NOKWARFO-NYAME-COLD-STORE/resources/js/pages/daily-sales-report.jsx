import AppLayout from '@/layouts/app-layout';
import { Calendar, DollarSign, Package } from 'lucide-react';
import { useState } from 'react';

import { router } from '@inertiajs/react';
import ProductsTable from '../components/daily-sales-report/ProductsTable';
import SalesTable from '../components/daily-sales-report/SalesTable';
import SummaryCard from '../components/daily-sales-report/SummaryCard';
import DateRangePicker from '../components/DateRangePicker';

export default function DailySalesReport({
    cash_sales = [],
    credit_sales = [],
    products_bought = [],
    credited_products = [],
    partial_products = [],
}) {
    // Default dates to today in yyyy-mm-dd format
    const today = new Date().toISOString().slice(0, 10);

    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    const handleDateChange = (value, type) => {
        // Prepare new dates
        const newStartDate = type === 'start' ? value : startDate;
        const newEndDate = type === 'end' ? value : endDate;

        // Update state
        if (type === 'start') setStartDate(value);
        if (type === 'end') setEndDate(value);

        // Send updated dates immediately
        router.get(
            route('daily-sales-report.index'),
            { start_date: newStartDate, end_date: newEndDate },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    // TODO: On date change, call backend API to fetch filtered data

    // Calculations
    const cashTotal = cash_sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    const creditTotal = credit_sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    const grandTotal = cashTotal + creditTotal;

    const totalProductsBought = products_bought.reduce((sum, item) => sum + parseInt(item.qty), 0);
    const totalCreditedProducts = credited_products.reduce((sum, item) => sum + parseInt(item.qty), 0);
    const totalPartialProducts = partial_products.reduce((sum, item) => sum + parseInt(item.qty), 0);
    const totalProductsSold = totalProductsBought + totalCreditedProducts + totalPartialProducts;

    const breadcrumbs = [{ title: 'Daily Sales Report', href: '/daily-sales-report' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen space-y-6 bg-gray-100 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Daily Sales Report</h1>
                </div>

                {/* Date Range Picker */}
                <DateRangePicker startDate={startDate} endDate={endDate} onChange={handleDateChange} />

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <SummaryCard
                        title="Cash Sales"
                        icon={DollarSign}
                        amount={`GH₵${cashTotal.toFixed(2)}`}
                        subtitle={`${cash_sales.length} transactions`}
                        color="text-green-600"
                    />
                    <SummaryCard
                        title="Credit Sales"
                        icon={Package}
                        amount={`GH₵${creditTotal.toFixed(2)}`}
                        subtitle={`${credit_sales.length} transactions`}
                        color="text-orange-600"
                    />
                    <SummaryCard
                        title="Grand Total"
                        icon={Calendar}
                        amount={`GH₵${grandTotal.toFixed(2)}`}
                        subtitle="Cash + Credit"
                        color="text-blue-600"
                    />
                    <SummaryCard title="Products Sold" icon={Package} amount={totalProductsSold} subtitle="Total units" color="text-purple-600" />
                </div>

                {/* Tables */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <SalesTable title="Cash Sales Today" sales={cash_sales} amountTotal={cashTotal} amountColor="text-green-600" />
                    <SalesTable title="Credit Sales Today" sales={credit_sales} amountTotal={creditTotal} amountColor="text-orange-600" />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <ProductsTable
                        title="Products Bought (Cash Sales by Product)"
                        products={products_bought}
                        totalQty={totalProductsBought}
                        totalAmount={products_bought.reduce((sum, item) => sum + parseFloat(item.total_amount), 0)}
                        totalAmountColor="text-green-600"
                    />
                    <ProductsTable
                        title="Credited Products (Credit Sales by Product)"
                        products={credited_products}
                        totalQty={totalCreditedProducts}
                        totalAmount={credited_products.reduce((sum, item) => sum + parseFloat(item.total_amount), 0)}
                        totalAmountColor="text-orange-600"
                    />
                    <ProductsTable
                        title="Partial Products (Partial product Sales)"
                        products={partial_products}
                        totalQty={totalPartialProducts}
                        totalAmount={partial_products.reduce((sum, item) => sum + parseFloat(item.total_amount), 0)}
                        totalAmountColor="text-yellow-600"
                        showAmountPaid={true}
                        totalAmountPaid={partial_products.reduce((sum, item) => sum + parseFloat(item.amount_paid), 0)}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
