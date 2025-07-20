<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with('customer')->orderByDesc('created_at')->get();
        return Inertia::render('sales', [
            'sales' => $sales,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'payment_type' => 'required|in:cash,credit,bank_transfer,check',
            'subtotal' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'status' => 'required|in:completed,pending,cancelled',
        ]);
        $validated['transaction_id'] = 'TXN' . now()->format('YmdHis') . rand(100,999);
        $validated['user_id'] = auth()->id();
        $sale = Sale::create($validated);
        // Sale items would be handled here if provided
        return redirect()->route('sales.index')->with('success', 'Sale created successfully.');
    }

    public function destroy(Sale $sale)
    {
        $sale->delete();
        return redirect()->route('sales.index')->with('success', 'Sale deleted successfully.');
    }
} 