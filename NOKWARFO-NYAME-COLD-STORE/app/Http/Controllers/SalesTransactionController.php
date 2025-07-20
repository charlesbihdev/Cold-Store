<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesTransactionController extends Controller
{
    public function index()
    {
        $sales = Sale::with(['customer', 'saleItems.product'])->orderByDesc('created_at')->get();
        
        // Transform sales data to match the frontend expectations
        $sales_transactions = $sales->map(function ($sale) {
            return [
                'id' => $sale->transaction_id,
                'date' => $sale->created_at->format('Y-m-d'),
                'customer' => $sale->customer ? $sale->customer->name : $sale->customer_name,
                'product' => $sale->saleItems->first() ? $sale->saleItems->first()->product->name : 'Multiple Products',
                'qty' => $sale->saleItems->sum('quantity'),
                'unit_price' => $sale->saleItems->first() ? $sale->saleItems->first()->unit_price : 0,
                'total' => $sale->total,
                'payment_type' => ucfirst($sale->payment_type),
            ];
        });
        
        return Inertia::render('sales-transactions', [
            'sales_transactions' => $sales_transactions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'customer_name' => 'nullable|string|max:255',
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'payment_type' => 'required|in:cash,credit',
        ]);

        // Create the sale
        $sale = Sale::create([
            'transaction_id' => 'TXN' . time(),
            'customer_id' => $validated['customer_id'],
            'customer_name' => $validated['customer_name'],
            'subtotal' => $validated['total'],
            'tax' => 0,
            'total' => $validated['total'],
            'payment_type' => $validated['payment_type'],
            'status' => 'completed',
            'user_id' => auth()->id() ?? 1,
        ]);

        // Create the sale item
        SaleItem::create([
            'sale_id' => $sale->id,
            'product_id' => $validated['product_id'],
            'product_name' => \App\Models\Product::find($validated['product_id'])->name,
            'quantity' => $validated['qty'],
            'unit_price' => $validated['unit_price'],
            'total' => $validated['total'],
        ]);

        return redirect()->route('sales-transactions.index')->with('success', 'Sales transaction created successfully.');
    }

    public function destroy(Sale $sale)
    {
        $sale->delete();
        return redirect()->route('sales-transactions.index')->with('success', 'Sales transaction deleted successfully.');
    }
} 