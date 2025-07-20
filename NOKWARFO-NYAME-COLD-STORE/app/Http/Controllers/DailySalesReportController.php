<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DailySalesReportController extends Controller
{
    public function index()
    {
        $today = now()->format('Y-m-d');
        
        // Get today's sales
        $todaySales = Sale::whereDate('created_at', $today)->with(['customer', 'saleItems.product'])->get();
        
        // Separate cash and credit sales
        $cash_sales = $todaySales->where('payment_type', 'cash')->map(function ($sale) {
            return [
                'time' => $sale->created_at->format('H:i A'),
                'customer' => $sale->customer ? $sale->customer->name : $sale->customer_name,
                'products' => $sale->saleItems->pluck('product_name')->join(', '),
                'amount' => $sale->total,
            ];
        })->values();

        $credit_sales = $todaySales->where('payment_type', 'credit')->map(function ($sale) {
            return [
                'time' => $sale->created_at->format('H:i A'),
                'customer' => $sale->customer ? $sale->customer->name : $sale->customer_name,
                'products' => $sale->saleItems->pluck('product_name')->join(', '),
                'amount' => $sale->total,
            ];
        })->values();

        // Get products bought (cash sales by product)
        $products_bought = SaleItem::whereHas('sale', function ($query) use ($today) {
            $query->whereDate('created_at', $today)->where('payment_type', 'cash');
        })->with(['product', 'sale'])
        ->get()
        ->groupBy('product_id')
        ->map(function ($items) {
            $firstItem = $items->first();
            return [
                'product' => $firstItem->product->name,
                'qty' => $items->sum('quantity'),
                'total_amount' => $items->sum('total'),
            ];
        })->values();

        // Get credited products (credit sales by product)
        $credited_products = SaleItem::whereHas('sale', function ($query) use ($today) {
            $query->whereDate('created_at', $today)->where('payment_type', 'credit');
        })->with(['product', 'sale'])
        ->get()
        ->groupBy('product_id')
        ->map(function ($items) {
            $firstItem = $items->first();
            return [
                'product' => $firstItem->product->name,
                'qty' => $items->sum('quantity'),
                'total_amount' => $items->sum('total'),
            ];
        })->values();
        
        return Inertia::render('daily-sales-report', [
            'cash_sales' => $cash_sales,
            'credit_sales' => $credit_sales,
            'products_bought' => $products_bought,
            'credited_products' => $credited_products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'cash_sales' => 'required|array',
            'credit_sales' => 'required|array',
        ]);

        DailySalesReport::create($validated);

        return redirect()->route('daily-sales-report.index')->with('success', 'Daily sales report created successfully.');
    }

    public function destroy(DailySalesReport $dailySalesReport)
    {
        $dailySalesReport->delete();
        return redirect()->route('daily-sales-report.index')->with('success', 'Daily sales report deleted successfully.');
    }
} 