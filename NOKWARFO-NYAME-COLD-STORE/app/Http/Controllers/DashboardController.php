<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Customer;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->format('Y-m-d');
        $lastMonth = now()->subMonth()->format('Y-m-d');

        // Today's sales
        $todaySales = SaleItem::whereHas('sale', function ($query) use ($today) {
            $query->whereDate('created_at', $today);
        })->sum(DB::raw('(unit_selling_price * quantity)'));

        $lastMonthTodaySales = SaleItem::whereHas('sale', function ($query) use ($lastMonth) {
            $query->whereDate('created_at', $lastMonth);
        })->sum(DB::raw('(unit_selling_price * quantity)'));

        $salesChange = $lastMonthTodaySales != 0 ? (($todaySales - $lastMonthTodaySales) / abs($lastMonthTodaySales)) * 100 : 0;

        // Products sold today
        $productsSoldToday = SaleItem::whereHas('sale', function ($query) use ($today) {
            $query->whereDate('created_at', $today);
        })->sum('quantity');

        $productsSoldLastMonth = SaleItem::whereHas('sale', function ($query) use ($lastMonth) {
            $query->whereDate('created_at', $lastMonth);
        })->sum('quantity');

        $productsChange = $productsSoldLastMonth != 0 ? (($productsSoldToday - $productsSoldLastMonth) / abs($productsSoldLastMonth)) * 100 : 0;

        // Low stock items (less than 10 units)
        $lowStockItems = Product::with(['stockMovements', 'saleItems.sale'])
            ->get()
            ->filter(function ($product) {
                $incoming = $product->stockMovements()
                    ->whereIn('type', ['received', 'adjusted'])
                    ->sum('quantity');

                $sold = $product->stockMovements()
                    ->where('type', 'sold')
                    ->sum('quantity');

                $cashSales = $product->saleItems()
                    ->whereHas('sale', function ($q) {
                        $q->where('payment_type', 'cash');
                    })->sum('quantity');

                $creditSales = $product->saleItems()
                    ->whereHas('sale', function ($q) {
                        $q->where('payment_type', 'credit');
                    })->sum('quantity');

                $partialSales = $product->saleItems()
                    ->whereHas('sale', function ($q) {
                        $q->where('payment_type', 'partial');
                    })->sum('quantity');

                $available = $incoming - ($sold + $cashSales + $creditSales + $partialSales);

                return $available < 5;
            })->count();


        // Credit sales today
        $creditSalesToday = SaleItem::whereHas('sale', function ($query) use ($today) {
            $query->whereDate('created_at', $today)->where('payment_type', 'credit');
        })->sum(DB::raw('(unit_selling_price * quantity)'));

        $creditSalesLastMonth = SaleItem::whereHas('sale', function ($query) use ($lastMonth) {
            $query->whereDate('created_at', $lastMonth)->where('payment_type', 'credit');
        })->sum(DB::raw('(unit_selling_price * quantity)'));

        $creditChange = $creditSalesLastMonth != 0 ? (($creditSalesToday - $creditSalesLastMonth) / abs($creditSalesLastMonth)) * 100 : 0;

        // Monthly profit (this month)
        $thisMonthSales = SaleItem::whereHas('sale', function ($query) {
            $query->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year);
        })->select(
            DB::raw('SUM(unit_selling_price * quantity) as total_sales'),
            DB::raw('SUM(unit_cost_price * quantity) as total_costs')
        )
            ->first();

        $monthlyProfit = ($thisMonthSales->total_sales ?? 0) - ($thisMonthSales->total_costs ?? 0);

        // Monthly profit (last month)
        $lastMonthSales = SaleItem::whereHas('sale', function ($query) {
            $query->whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year);
        })->select(
            DB::raw('SUM(unit_selling_price * quantity) as total_sales'),
            DB::raw('SUM(unit_cost_price * quantity) as total_costs')
        )
            ->first();

        $lastMonthProfit = ($lastMonthSales->total_sales ?? 0) - ($lastMonthSales->total_costs ?? 0);

        // Profit change percentage
        $profitChange = $lastMonthProfit != 0 ? (($monthlyProfit - $lastMonthProfit) / abs($lastMonthProfit)) * 100 : 0;

        // Active customers (customers with sales in last 30 days)
        $activeCustomers = Customer::whereHas('sales', function ($query) {
            $query->where('created_at', '>=', now()->subDays(30));
        })->count();

        $lastMonthActiveCustomers = Customer::whereHas('sales', function ($query) {
            $query->where('created_at', '>=', now()->subDays(60))
                ->where('created_at', '<', now()->subDays(30));
        })->count();

        $customersChange = $lastMonthActiveCustomers != 0 ? (($activeCustomers - $lastMonthActiveCustomers) / abs($lastMonthActiveCustomers)) * 100 : 0;

        // Recent sales (last 5 sales)
        $recentSales = Sale::with('customer')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(function ($sale) {
                return [
                    'id' => $sale->transaction_id,
                    'customer' => $sale->customer ? $sale->customer->name : $sale->customer_name,
                    'amount' => $sale->total,
                    'type' => ucfirst($sale->payment_type),
                    'time' => $sale->created_at->format('h:i A'),
                ];
            });

        return Inertia::render('dashboard', [
            'todaySales' => $todaySales,
            'salesChange' => $salesChange,
            'productsSoldToday' => $productsSoldToday,
            'productsChange' => $productsChange,
            'lowStockItems' => $lowStockItems,
            'creditSalesToday' => $creditSalesToday,
            'creditChange' => $creditChange,
            'monthlyProfit' => $monthlyProfit,
            'profitChange' => $profitChange,
            'activeCustomers' => $activeCustomers,
            'customersChange' => $customersChange,
            'recentSales' => $recentSales,
        ]);
    }
}
