<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::orderByDesc('created_at')->get();
        
        return Inertia::render('suppliers', [
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'additional_info' => 'nullable|string|max:1000',
        ]);

        $validated['is_active'] = true;
        Supplier::create($validated);

        return back()->with([
            'success' => 'Supplier created successfully',
        ]);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'additional_info' => 'nullable|string|max:1000',
        ]);

        $supplier->update($validated);

        return back()->with([
            'success' => 'Supplier updated successfully',
        ]);
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return back()->with([
            'success' => 'Supplier deleted successfully',
        ]);
    }
} 