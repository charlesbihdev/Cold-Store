<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::orderByDesc('created_at')->get();
        return Inertia::render('customers', [
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:255|unique:customers,phone',
            'email' => 'required|email|max:255|unique:customers,email',
            'address' => 'nullable|string',
            'credit_limit' => 'nullable|numeric|min:0',
        ]);
        $validated['current_balance'] = 0;
        $validated['is_active'] = true;
        Customer::create($validated);
        return redirect()->route('customers.index')->with('success', 'Customer created successfully.');
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:255|unique:customers,phone,' . $customer->id,
            'email' => 'required|email|max:255|unique:customers,email,' . $customer->id,
            'address' => 'nullable|string',
            'credit_limit' => 'nullable|numeric|min:0',
        ]);
        $customer->update($validated);
        return redirect()->route('customers.index')->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return redirect()->route('customers.index')->with('success', 'Customer deleted successfully.');
    }
} 