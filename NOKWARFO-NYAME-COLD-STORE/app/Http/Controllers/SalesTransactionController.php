<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Support\Facades\Validator;

class SalesTransactionController extends Controller
{
    public function index()
    {
        $sales = Sale::with(['customer', 'saleItems.product'])->orderByDesc('created_at')->get();
        $products = Product::orderBy('name')->get();
        $customers = Customer::orderBy('name')->get();
        // Transform sales data to match the frontend expectations
        $sales_transactions = $sales->map(function ($sale) {
            return [
                'id' => $sale->transaction_id,
                'date' => $sale->created_at->format('Y-m-d'),
                'customer' => $sale->customer ? $sale->customer->name : $sale->customer_name,
                'total' => $sale->total,
                'payment_type' => ucfirst($sale->payment_type),
                'status' => ucfirst($sale->status),
                'amount_paid' => $sale->amount_paid,
                'amount_owed' => $sale->total - $sale->amount_paid,
                'sale_items' => $sale->saleItems->map(function ($item) {
                    return [
                        'product' => $item->product_name,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'total' => $item->total,
                    ];
                }),
            ];
        });
        return Inertia::render('sales-transactions', [
            'sales_transactions' => $sales_transactions,
            'products' => $products,
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'customer_name' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
            'amount_paid' => 'required|numeric|min:0',
            'due_date' => 'nullable|date',
            'payment_type' => 'required|in:cash,credit,mixed,partial',
        ]);

        $subtotal = collect($validated['items'])->sum('total');
        $total = $subtotal; // Add tax/discount logic if needed
        $amount_paid = $validated['amount_paid'];

        // Custom validation: enforce payment logic
        $validator = Validator::make($request->all(), []);
        $validator->after(function ($validator) use ($amount_paid, $total, $validated) {
            $type = $validated['payment_type'];
            if ($type === 'cash' && $amount_paid != $total) {
                $validator->errors()->add('amount_paid', 'For cash payments, the amount paid must equal the total.');
            }
            if ($type === 'credit' && $amount_paid != 0) {
                $validator->errors()->add('amount_paid', 'For credit sales, the amount paid must be 0.');
            }
            if ($type === 'partial' && ($amount_paid <= 0 || $amount_paid >= $total)) {
                $validator->errors()->add('amount_paid', 'For partial payments, the amount paid must be greater than 0 and less than the total.');
            }
        });
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $status = 'completed';
        if ($amount_paid == 0) {
            $status = 'credit';
        } elseif ($amount_paid < $total) {
            $status = 'partial';
        }

        $payment_type = $validated['payment_type'] === 'partial' ? 'cash' : $validated['payment_type'];
        $saleData = [
            'transaction_id' => 'TXN' . time(),
            'customer_id' => $validated['customer_id'],
            'subtotal' => $subtotal,
            'tax' => 0,
            'total' => $total,
            'payment_type' => $payment_type,
            'status' => $status,
            'amount_paid' => $amount_paid,
            'user_id' => auth()->id() ?? 1,
        ];
        if (isset($validated['customer_name']) && empty($validated['customer_id'])) {
            $saleData['customer_name'] = $validated['customer_name'];
        }
        $sale = Sale::create($saleData);

        foreach ($validated['items'] as $item) {
            SaleItem::create([
                'sale_id' => $sale->id,
                'product_id' => $item['product_id'],
                'product_name' => \App\Models\Product::find($item['product_id'])->name,
                'quantity' => $item['qty'],
                'unit_price' => $item['unit_price'],
                'total' => $item['total'],
            ]);
        }

        return redirect()->route('sales-transactions.index')->with('success', 'Sales transaction created successfully.');
    }

    public function destroy($transaction_id)
    {
        $sale = \App\Models\Sale::where('transaction_id', $transaction_id)->firstOrFail();
        $sale->delete();
        return redirect()->route('sales-transactions.index')->with('success', 'Sales transaction deleted successfully.');
    }
} 