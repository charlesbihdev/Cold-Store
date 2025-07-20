<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Supplier;

class ProductManagementController extends Controller
{
    public function index()
    {
        $products = Product::with('supplier')->orderByDesc('created_at')->get();
        $suppliers = Supplier::where('is_active', true)->get();
        return Inertia::render('product-management', [
            'products' => $products,
            'suppliers' => $suppliers,
        ]);
    }
} 