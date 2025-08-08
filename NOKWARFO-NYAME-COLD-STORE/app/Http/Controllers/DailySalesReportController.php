<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DailySalesReportController extends Controller
{

    public function index(Request $request)
    {
        $startDate = $request->input('start_date', now()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        // Cash sales (payment_type cash or partial), paginated with custom page name 'cash_page'
        $cash_sales = Sale::whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->whereIn('payment_type', ['cash', 'partial'])
            ->with(['customer', 'saleItems.product'])
            ->orderBy('created_at', 'desc')
            ->simplePaginate(15, ['*'], 'cash_page')
            ->through(function ($sale) {
                return [
                    'time' => $sale->created_at->format('H:i A'),
                    'customer' => $sale->customer ? $sale->customer->name : $sale->customer_name,
                    'products' => $sale->saleItems->pluck('product_name')->join(', '),
                    'amount' => $sale->amount_paid,
                ];
            });

        // Credit sales, paginated with 'credit_page'
        $credit_sales = Sale::whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->where('payment_type', 'credit')
            ->with(['customer', 'saleItems.product'])
            ->orderBy('created_at', 'desc')
            ->simplePaginate(15, ['*'], 'credit_page')
            ->through(function ($sale) {
                return [
                    'time' => $sale->created_at->format('H:i A'),
                    'customer' => $sale->customer ? $sale->customer->name : $sale->customer_name,
                    'products' => $sale->saleItems->pluck('product_name')->join(', '),
                    'amount' => $sale->total,
                ];
            });

        // Partial sales owed amounts - you may want to handle this separately or join with credit sales on frontend

        // Product summaries (cash)
        $cashProductQuery = SaleItem::select('product_id')
            ->selectRaw('SUM(quantity) as qty')
            ->selectRaw('SUM(total) as total_amount')
            ->whereHas('sale', function ($query) use ($startDate, $endDate) {
                $query->whereDate('created_at', '>=', $startDate)
                    ->whereDate('created_at', '<=', $endDate)
                    ->where('payment_type', 'cash')
                    ->where('status', 'completed');
            })
            ->groupBy('product_id')
            ->with('product')
            ->simplePaginate(15, ['*'], 'products_bought_page');

        $products_bought = $cashProductQuery->through(function ($item) {
            return [
                'product' => $item->product->name,
                'qty' => $item->qty,
                'total_amount' => $item->total_amount,
            ];
        });

        // Product summaries (credit)
        $creditProductQuery = SaleItem::select('product_id')
            ->selectRaw('SUM(quantity) as qty')
            ->selectRaw('SUM(total) as total_amount')
            ->whereHas('sale', function ($query) use ($startDate, $endDate) {
                $query->whereDate('created_at', '>=', $startDate)
                    ->whereDate('created_at', '<=', $endDate)
                    ->where('payment_type', 'credit')
                    ->where('status', 'completed');
            })
            ->groupBy('product_id')
            ->with('product')
            ->simplePaginate(15, ['*'], 'credited_products_page');

        $credited_products = $creditProductQuery->through(function ($item) {
            return [
                'product' => $item->product->name,
                'qty' => $item->qty,
                'total_amount' => $item->total_amount,
            ];
        });

        // Product summaries (partial)
        $partialProductQuery = SaleItem::select('product_id')
            ->selectRaw('SUM(quantity) as qty')
            ->selectRaw('SUM(total) as total_amount')
            ->whereHas('sale', function ($query) use ($startDate, $endDate) {
                $query->whereDate('created_at', '>=', $startDate)
                    ->whereDate('created_at', '<=', $endDate)
                    ->where('payment_type', 'partial')
                    ->where('status', 'completed');
            })
            ->groupBy('product_id')
            ->with('product')
            ->simplePaginate(15, ['*'], 'partial_products_page');

        $partial_products = $partialProductQuery->through(function ($item) {
            // For amount_paid you may want to calculate differently if needed
            return [
                'product' => $item->product->name,
                'qty' => $item->qty,
                'total_amount' => $item->total_amount,
                'amount_paid' => 0, // add logic if you want here
            ];
        });

        // Calculate summary totals
        $cashTotal = $cash_sales->sum('amount');
        $creditTotal = $credit_sales->sum('amount');
        $grandTotal = $cashTotal + $creditTotal;

        $totalProductsBought = $products_bought->sum('qty');
        $totalCreditedProducts = $credited_products->sum('qty');
        $totalPartialProducts = $partial_products->sum('qty');
        $totalProductsSold = $totalProductsBought + $totalCreditedProducts + $totalPartialProducts;

        // Sum total amounts for products bought, credited, and partial
        $totalProductsBoughtAmount = $products_bought->sum('total_amount');
        $totalCreditedProductsAmount = $credited_products->sum('total_amount');

        $summary = [
            'cashTotal' => $cashTotal,
            'creditTotal' => $creditTotal,
            'grandTotal' => $grandTotal,
            'totalProductsBought' => $totalProductsBought,
            'totalCreditedProducts' => $totalCreditedProducts,
            'totalPartialProducts' => $totalPartialProducts,
            'totalProductsSold' => $totalProductsSold,
        ];

        return Inertia::render('daily-sales-report', [
            'cash_sales' => $cash_sales,
            'credit_sales' => $credit_sales,
            'products_bought' => $products_bought,
            'credited_products' => $credited_products,
            'partial_products' => $partial_products,
            'summary' => $summary,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);
    }


    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'date' => 'required|date',
    //         'cash_sales' => 'required|array',
    //         'credit_sales' => 'required|array',
    //     ]);

    //     DailySalesReport::create($validated);

    //     return redirect()->route('daily-sales-report.index')->with('success', 'Daily sales report created successfully.');
    // }

    // public function destroy(DailySalesReport $dailySalesReport)
    // {
    //     $dailySalesReport->delete();
    //     return redirect()->route('daily-sales-report.index')->with('success', 'Daily sales report deleted successfully.');
    // }
}
