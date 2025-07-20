<?php

namespace App\Http\Controllers;

use App\Models\CreditCollection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CreditCollectionController extends Controller
{
    public function index()
    {
        $credit_collections = CreditCollection::orderByDesc('created_at')->get();
        $outstanding_debts = []; // TODO: Implement outstanding debts logic
        $expenses = []; // TODO: Implement expenses logic
        
        return Inertia::render('credit-collection', [
            'credit_collections' => $credit_collections,
            'outstanding_debts' => $outstanding_debts,
            'expenses' => $expenses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|string|max:255',
            'amount_collected' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        CreditCollection::create($validated);

        return redirect()->route('credit-collection.index')->with('success', 'Credit collection recorded successfully.');
    }

    public function destroy(CreditCollection $creditCollection)
    {
        $creditCollection->delete();
        return redirect()->route('credit-collection.index')->with('success', 'Credit collection deleted successfully.');
    }
} 