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
        // All sales (cash + credit)
        $total_product_sales = SaleItem::with(['product', 'sale'])
            ->get()
            ->groupBy('product_id')
            ->map(function ($items) {
                $product = $items->first()->product;
                $totalQty = $items->sum('quantity');
                $totalRevenue = $items->sum('total');
                $totalCost = $totalQty * ($product->default_cost_price ?? 0);

                return [
                    'product' => $product->name,
                    'total_product_sold' => $totalQty,
                    'unit_selling_price_price' => $product->default_cost_price,
                    'total_cost_amount' => $totalCost,
                    'selling_price' => $items->first()->unit_price,
                    'total_amount' => $totalRevenue,
                    'profit' => $totalRevenue - $totalCost,
                ];
            })->values();

        // Cash-only sales
        $paid_product_sales = SaleItem::whereHas('sale', fn($q) => $q->where('payment_type', 'cash'))
            ->with(['product', 'sale'])
            ->get()
            ->groupBy('product_id')
            ->map(function ($items) {
                $product = $items->first()->product;
                $totalQty = $items->sum('quantity');
                $totalRevenue = $items->sum('total');
                $totalCost = $totalQty * ($product->default_cost_price ?? 0);


                return [
                    'product' => $product->name,
                    'total_product_sold' => $totalQty,
                    'unit_selling_price_price' => $product->default_cost_price,
                    'total_cost_amount' => $totalCost,
                    'selling_price' => optional($items->first())->unit_price ?? 0,
                    'total_amount' => $totalRevenue,
                    'profit' => $totalRevenue - $totalCost,
                ];
            })->values();

        // dd($paid_product_sales);

        return Inertia::render('profit-analysis', [
            'total_product_sales' => $total_product_sales,
            'paid_product_sales' => $paid_product_sales,
        ]);
    }
}
