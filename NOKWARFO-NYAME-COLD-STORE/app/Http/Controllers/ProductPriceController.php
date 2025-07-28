<?php

namespace App\Http\Controllers;


use App\Models\ProductPrice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductPriceController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'selling_price' => 'required|numeric|min:0',
            'valid_from' => 'required|date',
            'valid_to' => 'nullable|date|after:valid_from',
        ]);

        // Close existing price
        ProductPrice::where('product_id', $validated['product_id'])
            ->whereNull('valid_to')
            ->update(['valid_to' => $validated['valid_from']]);

        ProductPrice::create($validated);

        return redirect()->back()->with('flash', ['success' => 'Price added successfully']);
    }

    public function update(Request $request, ProductPrice $productPrice)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'selling_price' => 'required|numeric|min:0',
            'valid_from' => 'required|date',
            'valid_to' => 'nullable|date|after:valid_from',
        ]);

        $productPrice->update($validated);

        return redirect()->back()->with('flash', ['success' => 'Price updated successfully']);
    }

    public function destroy(ProductPrice $productPrice)
    {
        $productPrice->delete();

        return redirect()->back()->with('flash', ['success' => 'Price deleted successfully']);
    }
}
