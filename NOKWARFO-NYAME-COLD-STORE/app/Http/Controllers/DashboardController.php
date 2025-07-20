<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use App\Models\Customer;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->format('Y-m-d');
        $lastMonth = now()->subMonth()->format('Y-m-d');
        
        // Today's sales
        $todaySales = Sale::whereDate('created_at', $today)->sum('total');
        $lastMonthTodaySales = Sale::whereDate('created_at', $lastMonth)->sum('total');
        $salesChange = $lastMonthTodaySales > 0 ? (($todaySales - $lastMonthTodaySales) / $lastMonthTodaySales) * 100 : 0;
        
        // Products sold today
        $productsSoldToday = SaleItem::whereHas('sale', function ($query) use ($today) {
            $query->whereDate('created_at', $today);
        })->sum('quantity');
        $productsSoldLastMonth = SaleItem::whereHas('sale', function ($query) use ($lastMonth) {
            $query->whereDate('created_at', $lastMonth);
        })->sum('quantity');
        $productsChange = $productsSoldLastMonth > 0 ? (($productsSoldToday - $productsSoldLastMonth) / $productsSoldLastMonth) * 100 : 0;
        
        // Low stock items (less than 10 units)
        $lowStockItems = Product::where('stock_quantity', '<', 10)->count();
        
        // Credit sales today
        $creditSalesToday = Sale::whereDate('created_at', $today)->where('payment_type', 'credit')->sum('total');
        $creditSalesLastMonth = Sale::whereDate('created_at', $lastMonth)->where('payment_type', 'credit')->sum('total');
        $creditChange = $creditSalesLastMonth > 0 ? (($creditSalesToday - $creditSalesLastMonth) / $creditSalesLastMonth) * 100 : 0;
        
        // Monthly profit (this month)
        $thisMonthSales = Sale::whereMonth('created_at', now()->month)->sum('total');
        $thisMonthCosts = SaleItem::whereHas('sale', function ($query) {
            $query->whereMonth('created_at', now()->month);
        })->get()->sum(function ($item) {
            return $item->quantity * $item->product->cost_price;
        });
        $monthlyProfit = $thisMonthSales - $thisMonthCosts;
        
        $lastMonthSales = Sale::whereMonth('created_at', now()->subMonth()->month)->sum('total');
        $lastMonthCosts = SaleItem::whereHas('sale', function ($query) {
            $query->whereMonth('created_at', now()->subMonth()->month);
        })->get()->sum(function ($item) {
            return $item->quantity * $item->product->cost_price;
        });
        $lastMonthProfit = $lastMonthSales - $lastMonthCosts;
        $profitChange = $lastMonthProfit > 0 ? (($monthlyProfit - $lastMonthProfit) / $lastMonthProfit) * 100 : 0;
        
        // Active customers (customers with sales in last 30 days)
        $activeCustomers = Customer::whereHas('sales', function ($query) {
            $query->where('created_at', '>=', now()->subDays(30));
        })->count();
        $lastMonthActiveCustomers = Customer::whereHas('sales', function ($query) {
            $query->where('created_at', '>=', now()->subDays(60))->where('created_at', '<', now()->subDays(30));
        })->count();
        $customersChange = $lastMonthActiveCustomers > 0 ? (($activeCustomers - $lastMonthActiveCustomers) / $lastMonthActiveCustomers) * 100 : 0;
        
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