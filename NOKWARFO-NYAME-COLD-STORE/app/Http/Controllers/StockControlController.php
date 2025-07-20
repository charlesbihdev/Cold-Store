<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockControlController extends Controller
{
    public function index()
    {
        $stock_movements = StockMovement::with(['product', 'supplier'])->orderByDesc('created_at')->get();
        
        return Inertia::render('stock-control', [
            'stock_movements' => $stock_movements,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'type' => 'required|in:in,out',
            'quantity' => 'required|integer|min:1',
            'unit_cost' => 'required|numeric|min:0',
            'total_cost' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        StockMovement::create($validated);

        return redirect()->route('stock-control.index')->with('success', 'Stock movement recorded successfully.');
    }

    public function destroy(StockMovement $stockMovement)
    {
        $stockMovement->delete();
        return redirect()->route('stock-control.index')->with('success', 'Stock movement deleted successfully.');
    }
} 