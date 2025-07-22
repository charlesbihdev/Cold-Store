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
        $cash_sales = $todaySales->whereIn('status', ['completed', 'partial'])->map(function ($sale) {
            return [
                'time' => $sale->created_at->format('H:i A'),
                'customer' => $sale->customer ? $sale->customer->name : $sale->customer_name,
                'products' => $sale->saleItems->pluck('product_name')->join(', '),
                'amount' => $sale->amount_paid,
            ];
        })->values();

        $credit_sales = $todaySales->where('status', 'credit')->map(function ($sale) {
            return [
                'time' => $sale->created_at->format('H:i A'),
                'customer' => $sale->customer ? $sale->customer->name : $sale->customer_name,
                'products' => $sale->saleItems->pluck('product_name')->join(', '),
                'amount' => $sale->total,
            ];
        })->values();
        // Add amount_owed from partials to credit_sales
        $partial_sales = $todaySales->where('status', 'partial');
        foreach ($partial_sales as $sale) {
            $credit_sales->push([
                'time' => $sale->created_at->format('H:i A'),
                'customer' => $sale->customer ? $sale->customer->name : $sale->customer_name,
                'products' => $sale->saleItems->pluck('product_name')->join(', '),
                'amount' => $sale->total - $sale->amount_paid,
            ]);
        }

        // Build product summaries with sequential allocation for partial payments
        $cashProductMap = [];
        $creditProductMap = [];
        foreach ($todaySales as $sale) {
            $items = $sale->saleItems;
            if ($sale->status === 'completed' && $sale->payment_type === 'cash') {
                // All items are cash
                foreach ($items as $item) {
                    $pid = $item->product_id;
                    if (!isset($cashProductMap[$pid])) {
                        $cashProductMap[$pid] = [
                            'product' => $item->product->name,
                            'qty' => 0,
                            'total_amount' => 0,
                        ];
                    }
                    $cashProductMap[$pid]['qty'] += $item->quantity;
                    $cashProductMap[$pid]['total_amount'] += $item->total;
                }
            } elseif ($sale->status === 'credit' && $sale->payment_type === 'credit') {
                // All items are credit
                foreach ($items as $item) {
                    $pid = $item->product_id;
                    if (!isset($creditProductMap[$pid])) {
                        $creditProductMap[$pid] = [
                            'product' => $item->product->name,
                            'qty' => 0,
                            'total_amount' => 0,
                        ];
                    }
                    $creditProductMap[$pid]['qty'] += $item->quantity;
                    $creditProductMap[$pid]['total_amount'] += $item->total;
                }
            } elseif ($sale->status === 'partial') {
                // Sequential allocation of amount_paid to items
                $remainingPaid = $sale->amount_paid;
                foreach ($items as $item) {
                    $pid = $item->product_id;
                    $itemTotal = $item->total;
                    $itemQty = $item->quantity;
                    $itemUnit = $item->unit_price;
                    // Allocate cash portion
                    $cashForThisItem = min($remainingPaid, $itemTotal);
                    $creditForThisItem = $itemTotal - $cashForThisItem;
                    // Cash portion
                    if ($cashForThisItem > 0) {
                        if (!isset($cashProductMap[$pid])) {
                            $cashProductMap[$pid] = [
                                'product' => $item->product->name,
                                'qty' => 0,
                                'total_amount' => 0,
                            ];
                        }
                        // Proportionally allocate quantity for cash
                        $cashQty = $itemQty * ($cashForThisItem / $itemTotal);
                        $cashProductMap[$pid]['qty'] += $cashQty;
                        $cashProductMap[$pid]['total_amount'] += $cashForThisItem;
                    }
                    // Credit portion
                    if ($creditForThisItem > 0) {
                        if (!isset($creditProductMap[$pid])) {
                            $creditProductMap[$pid] = [
                                'product' => $item->product->name,
                                'qty' => 0,
                                'total_amount' => 0,
                            ];
                        }
                        // Proportionally allocate quantity for credit
                        $creditQty = $itemQty * ($creditForThisItem / $itemTotal);
                        $creditProductMap[$pid]['qty'] += $creditQty;
                        $creditProductMap[$pid]['total_amount'] += $creditForThisItem;
                    }
                    $remainingPaid -= $cashForThisItem;
                    if ($remainingPaid <= 0) {
                        $remainingPaid = 0;
                    }
                }
            }
        }
        // Convert maps to values
        $products_bought = collect($cashProductMap)->values();
        $credited_products = collect($creditProductMap)->values();
        
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