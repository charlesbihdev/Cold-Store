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
        $date = now()->toDateString();
        $stock_movements = StockMovement::with(['product', 'supplier'])->orderByDesc('created_at')->get();
        $products = Product::with('supplier')->orderBy('name')->get();
        $suppliers = Supplier::where('is_active', true)->get();
        $stock_activity_summary = [];
        foreach ($products as $product) {
            // Stock Received today
            $stockReceivedToday = $product->stockMovements()
                ->whereDate('created_at', $date)
                ->where('type', 'received')
                ->sum('quantity');
            // Adjusted today
            $adjustedToday = $product->stockMovements()
                ->whereDate('created_at', $date)
                ->where('type', 'adjusted')
                ->sum('quantity');
            // Previous Stock: all received + adjusted before today, minus all sold before today
            $receivedBefore = $product->stockMovements()
                ->where('created_at', '<', $date)
                ->where('type', 'received')
                ->sum('quantity');
            $adjustedBefore = $product->stockMovements()
                ->where('created_at', '<', $date)
                ->where('type', 'adjusted')
                ->sum('quantity');
            $soldBefore = $product->stockMovements()
                ->where('created_at', '<', $date . ' 00:00:00')
                ->where('type', 'sold')
                ->sum('quantity');
            $previousStock = $receivedBefore + $adjustedBefore - $soldBefore;
            // Total Available
            $totalAvailable = $previousStock + $stockReceivedToday + $adjustedToday;
            // Cash Sales today
            $cashSales = $product->saleItems()
                ->whereHas('sale', function ($q) use ($date) {
                    $q->whereDate('created_at', $date)->where('payment_type', 'cash');
                })
                ->sum('quantity');
            // Credit Sales today
            $creditSales = $product->saleItems()
                ->whereHas('sale', function ($q) use ($date) {
                    $q->whereDate('created_at', $date)->where('payment_type', 'credit');
                })
                ->sum('quantity');

            $partialSales = $product->saleItems()
                ->whereHas('sale', function ($q) use ($date) {
                    $q->whereDate('created_at', $date)->where('payment_type', 'partial');
                })
                ->sum('quantity');

            // Total Sales
            $totalSales = $cashSales + $creditSales + $partialSales;
            // Remaining Stock
            $remainingStock = $totalAvailable - $totalSales;
            $stock_activity_summary[] = [
                'product' => $product->name,
                'stock_received_today' => $stockReceivedToday + $adjustedToday,
                'previous_stock' => $previousStock,
                'total_available' => $totalAvailable,
                'stock_available' => $totalAvailable,
                'cash_sales' => $cashSales,
                'credit_sales' => $creditSales,
                'partial_sales' => $partialSales,
                'total_sales' => $totalSales,
                'remaining_stock' => $remainingStock,
            ];
        }
        return Inertia::render('stock-control', [
            'stock_movements' => $stock_movements,
            'products' => $products,
            'suppliers' => $suppliers,
            'stock_activity_summary' => $stock_activity_summary,
            'date' => $date,
        ]);
    }

    public function store(Request $request)
    {
        $type = $request->input('type');
        $rules = [
            'product_id' => 'required|exists:products,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'type' => 'required|in:received,sold,adjusted',
            'unit_cost' => 'nullable|numeric|min:0',
            'total_cost' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ];
        if ($type === 'adjusted') {
            $rules['quantity'] = 'required|integer|not_in:0'; // allow positive or negative, but not zero
        } else {
            $rules['quantity'] = 'required|integer|min:1'; // only positive for received/sold
        }
        $validated = $request->validate($rules);
        if (!isset($validated['total_cost']) || $validated['total_cost'] === null) {
            $validated['total_cost'] = ($validated['unit_cost'] ?? 0) * abs($validated['quantity']);
        }
        StockMovement::create($validated);
        // Do not use preserveState or preserveScroll for stock_activity_summary, so the frontend gets fresh data
        return redirect()->route('stock-control.index');
    }

    public function destroy($id)
    {
        $stockMovement = StockMovement::findOrFail($id);
        $stockMovement->delete();

        return redirect()->route('stock-control.index')
            ->with('success', 'Stock movement deleted successfully.');
    }

    public function dailyMovementReport(Request $request)
    {
        $date = $request->input('date', now()->toDateString());
        $products = Product::with('supplier')->orderBy('name')->get();
        $report = [];
        foreach ($products as $product) {
            // Stock received today
            $stockReceived = $product->stockMovements()
                ->whereDate('created_at', $date)
                ->where('type', 'in')
                ->sum('quantity');
            // Previous stock (before today)
            $previousStock = $product->stockMovements()
                ->where('created_at', '<', $date . ' 00:00:00')
                ->whereIn('type', ['in', 'adjusted'])
                ->sum('quantity')
                - $product->stockMovements()
                ->where('created_at', '<', $date . ' 00:00:00')
                ->whereIn('type', ['out'])
                ->sum('quantity');
            // Total available
            $totalAvailable = $previousStock + $stockReceived;
            // Cash sales today
            $cashSales = $product->saleItems()
                ->whereHas('sale', function ($q) use ($date) {
                    $q->whereDate('created_at', $date)->where('payment_type', 'cash');
                })
                ->sum('quantity');
            // Credit sales today
            $creditSales = $product->saleItems()
                ->whereHas('sale', function ($q) use ($date) {
                    $q->whereDate('created_at', $date)->where('payment_type', 'credit');
                })
                ->sum('quantity');
            // Total sales
            $totalSales = $cashSales + $creditSales;
            // Remaining stock
            $remainingStock = $totalAvailable - $totalSales;
            $report[] = [
                'product' => $product->name,
                'stock_received' => $stockReceived,
                'previous_stock' => $previousStock,
                'total_available' => $totalAvailable,
                'cash_sales' => $cashSales,
                'credit_sales' => $creditSales,
                'total_sales' => $totalSales,
                'remaining_stock' => $remainingStock,
            ];
        }
        return Inertia::render('stock-movement-report', [
            'date' => $date,
            'report' => $report,
        ]);
    }
}
