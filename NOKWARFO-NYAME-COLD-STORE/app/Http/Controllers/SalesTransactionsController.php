<?php

namespace App\Http\Controllers;

use App\Models\SalesTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesTransactionsController extends Controller
{
    public function index()
    {
        $sales_transactions = SalesTransaction::with(['customer', 'product'])->orderByDesc('created_at')->get();
        
        return Inertia::render('sales-transactions', [
            'sales_transactions' => $sales_transactions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'payment_type' => 'required|in:Cash,Credit',
            'date' => 'required|date',
        ]);

        SalesTransaction::create($validated);

        return redirect()->route('sales-transactions.index')->with('success', 'Sales transaction created successfully.');
    }

    public function destroy(SalesTransaction $salesTransaction)
    {
        $salesTransaction->delete();
        return redirect()->route('sales-transactions.index')->with('success', 'Sales transaction deleted successfully.');
    }
} 