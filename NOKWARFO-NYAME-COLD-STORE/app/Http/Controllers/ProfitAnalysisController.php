<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfitAnalysisController extends Controller
{
    public function index()
    {
        // Calculate total product sales (cash + credit)
        $total_product_sales = SaleItem::with(['product', 'sale'])
            ->get()
            ->groupBy('product_id')
            ->map(function ($items) {
                $firstItem = $items->first();
                $totalSold = $items->sum('quantity');
                $totalRevenue = $items->sum('total');
                $totalCost = $items->sum(function ($item) {
                    return $item->quantity * $item->product->cost_price;
                });
                
                return [
                    'product' => $firstItem->product->name,
                    'total_product_sold' => $totalSold,
                    'unit_cost_price' => $firstItem->product->cost_price,
                    'total_cost_amount' => $totalCost,
                    'selling_price' => $firstItem->unit_price,
                    'total_amount' => $totalRevenue,
                    'profit' => $totalRevenue - $totalCost,
                ];
            })->values();

        // Calculate paid product sales (cash only)
        $paid_product_sales = SaleItem::whereHas('sale', function ($query) {
            $query->where('payment_type', 'cash');
        })->with(['product', 'sale'])
        ->get()
        ->groupBy('product_id')
        ->map(function ($items) {
            $firstItem = $items->first();
            $totalSold = $items->sum('quantity');
            $totalRevenue = $items->sum('total');
            $totalCost = $items->sum(function ($item) {
                return $item->quantity * $item->product->cost_price;
            });
            
            return [
                'product' => $firstItem->product->name,
                'total_product_sold' => $totalSold,
                'unit_cost_price' => $firstItem->product->cost_price,
                'total_cost_amount' => $totalCost,
                'selling_price' => $firstItem->unit_price,
                'total_amount' => $totalRevenue,
                'profit' => $totalRevenue - $totalCost,
            ];
        })->values();
        
        return Inertia::render('profit-analysis', [
            'total_product_sales' => $total_product_sales,
            'paid_product_sales' => $paid_product_sales,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'total_sales' => 'required|array',
            'paid_sales' => 'required|array',
        ]);

        ProfitAnalysis::create($validated);

        return redirect()->route('profit-analysis.index')->with('success', 'Profit analysis created successfully.');
    }

    public function destroy(ProfitAnalysis $profitAnalysis)
    {
        $profitAnalysis->delete();
        return redirect()->route('profit-analysis.index')->with('success', 'Profit analysis deleted successfully.');
    }
} 