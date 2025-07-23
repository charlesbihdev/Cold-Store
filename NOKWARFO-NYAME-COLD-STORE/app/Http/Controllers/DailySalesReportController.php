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
        $cash_sales = $todaySales->whereIn('payment_type', ['cash', 'partial'])->map(function ($sale) {
            return [
                'time' => $sale->created_at->format('H:i A'),
                'customer' => $sale->customer ? $sale->customer->name : $sale->customer_name,
                'products' => $sale->saleItems->pluck('product_name')->join(', '),
                'amount' => $sale->amount_paid,
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
        // Add amount_owed from partials to credit_sales
        $partial_sales = $todaySales->where('payment_type', 'partial');
        foreach ($partial_sales as $sale) {
            $credit_sales->push([
                'time' => $sale->created_at->format('H:i A'),
                'customer' => $sale->customer ? $sale->customer->name : $sale->customer_name,
                'products' => $sale->saleItems->pluck('product_name')->join(', '),
                'amount' => $sale->total - $sale->amount_paid,
                'amount_paid' => $sale->amount_paid,
            ]);
        }

        // Build product summaries with sequential allocation for partial payments
        // Initialize maps
        $cashProductMap = [];
        $creditProductMap = [];
        $partialProductMap = [];

        // Build product summaries
        foreach ($todaySales as $sale) {
            $items = $sale->saleItems;
            foreach ($items as $item) {
                $pid = $item->product_id;
                $productName = $item->product->name;
                $qty = $item->quantity;
                $total = $item->total;
                // $amountPaid = $item->amount_paid;
                // dd($amountPaid);

                if ($sale->status !== 'completed') {
                    continue;
                }

                if ($sale->payment_type === 'cash') {
                    if (!isset($cashProductMap[$pid])) {
                        $cashProductMap[$pid] = [
                            'product' => $productName,
                            'qty' => 0,
                            'total_amount' => 0,
                        ];
                    }
                    $cashProductMap[$pid]['qty'] += $qty;
                    $cashProductMap[$pid]['total_amount'] += $total;
                }

                if ($sale->payment_type === 'credit') {
                    if (!isset($creditProductMap[$pid])) {
                        $creditProductMap[$pid] = [
                            'product' => $productName,
                            'qty' => 0,
                            'total_amount' => 0,
                        ];
                    }
                    $creditProductMap[$pid]['qty'] += $qty;
                    $creditProductMap[$pid]['total_amount'] += $total;
                }

                if ($sale->payment_type === 'partial') {
                    if (!isset($partialProductMap[$pid])) {
                        $partialProductMap[$pid] = [
                            'product' => $productName,
                            'qty' => 0,
                            'total_amount' => 0,
                            'amount_paid' => 0,
                        ];
                    }
                    $partialProductMap[$pid]['qty'] += $qty;
                    $partialProductMap[$pid]['total_amount'] += $total;
                    $partialProductMap[$pid]['amount_paid'] = $sale->amount_paid;
                }
            }
        }

        return Inertia::render('daily-sales-report', [
            'cash_sales' => $cash_sales,
            'credit_sales' => $credit_sales,
            'products_bought' => collect($cashProductMap)->values(),
            'credited_products' => collect($creditProductMap)->values(),
            'partial_products' => collect($partialProductMap)->values(),
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
