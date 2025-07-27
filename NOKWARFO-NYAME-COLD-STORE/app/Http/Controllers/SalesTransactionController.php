<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockMovement;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SalesTransactionController extends Controller
{
    public function index()
    {
        $sales = Sale::with(['customer', 'saleItems.product'])->orderByDesc('created_at')->get();
        $products = Product::orderBy('name')->get();
        $customers = Customer::orderBy('name')->get();

        $sales_transactions = $sales->map(function ($sale) {
            $profit = $sale->saleItems->sum(function ($item) {
                return ($item->unit_selling_price - $item->unit_cost_price) * $item->quantity;
            });

            return [
                'id' => $sale->transaction_id,
                'date' => $sale->created_at->format('Y-m-d'),
                'customer' => $sale->customer ? $sale->customer->name : $sale->customer_name,
                'total' => $sale->total,
                'payment_type' => ucfirst($sale->payment_type),
                'status' => ucfirst($sale->status),
                'amount_paid' => $sale->amount_paid,
                'amount_owed' => $sale->total - $sale->amount_paid,
                'profit' => $profit,
                'sale_items' => $sale->saleItems->map(function ($item) {
                    return [
                        'product' => $item->product_name,
                        'quantity' => $item->quantity,
                        'unit_selling_price' => $item->unit_selling_price,
                        'unit_cost_price' => $item->unit_cost_price,
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
            'items.*.unit_selling_price' => 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
            'amount_paid' => 'required|numeric|min:0',
            'payment_type' => 'required|in:cash,credit,partial',
        ]);

        // Validate stock availability
        foreach ($validated['items'] as $item) {
            $availableStock = StockMovement::where('product_id', $item['product_id'])
                ->sum('quantity');

            if ($availableStock < $item['qty']) {
                return redirect()->back()->withErrors([
                    'items' => "Insufficient stock for product ID {$item['product_id']}. Available: {$availableStock}, Requested: {$item['qty']}",
                ])->withInput();
            }
        }

        // Calculate unit_cost_price using FIFO
        $itemsWithCosts = collect($validated['items'])->map(function ($item) {
            $qtyNeeded = $item['qty'];
            $stockMovements = StockMovement::where('product_id', $item['product_id'])
                ->where('type', 'received')
                ->where('quantity', '>', 0)
                ->orderBy('created_at')
                ->get();

            $totalCost = 0;
            $allocatedQty = 0;

            foreach ($stockMovements as $movement) {
                if ($qtyNeeded <= 0) break;

                $qtyToUse = min($movement->quantity, $qtyNeeded);
                $totalCost += $qtyToUse * $movement->unit_cost;
                $qtyNeeded -= $qtyToUse;

                // Update stock movement quantity
                $movement->quantity -= $qtyToUse;
                $movement->save();
            }

            if ($qtyNeeded > 0) {
                // Fallback if insufficient stock (should be caught by validation)
                $item['unit_cost_price'] = 0;
            } else {
                $item['unit_cost_price'] = $totalCost / $item['qty'];
            }

            return $item;
        });

        $subtotal = $itemsWithCosts->sum('total');
        $total = $subtotal; // Add tax/discount logic if needed
        $amount_paid = $validated['amount_paid'];

        // Validate payment logic
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

        $saleData = [
            'transaction_id' => 'TXN' . time(),
            'customer_id' => $validated['customer_id'],
            'subtotal' => $subtotal,
            'tax' => 0,
            'total' => $total,
            'payment_type' => $validated['payment_type'],
            'status' => 'completed', // All successful transactions are completed
            'amount_paid' => $amount_paid,
            'user_id' => Auth::user()->id ?? 1,
        ];

        if (isset($validated['customer_name']) && empty($validated['customer_id'])) {
            $saleData['customer_name'] = $validated['customer_name'];
        }

        $sale = Sale::create($saleData);

        foreach ($itemsWithCosts as $item) {
            SaleItem::create([
                'sale_id' => $sale->id,
                'product_id' => $item['product_id'],
                'product_name' => Product::find($item['product_id'])->name,
                'quantity' => $item['qty'],
                'unit_selling_price' => $item['unit_selling_price'],
                'unit_cost_price' => $item['unit_cost_price'],
                'total' => $item['total'],
            ]);

            // Create stock movement for sold items
            StockMovement::create([
                'product_id' => $item['product_id'],
                'type' => 'sold',
                'quantity' => -$item['qty'],
                'unit_cost' => $item['unit_cost_price'],
                'total_cost' => -$item['qty'] * $item['unit_cost_price'],
                'sale_id' => $sale->id,
            ]);
        }

        return redirect()->route('sales-transactions.index')->with('success', 'Sales transaction created successfully.');
    }

    public function destroy($transaction_id)
    {
        $sale = Sale::where('transaction_id', $transaction_id)->firstOrFail();

        foreach ($sale->saleItems as $item) {
            // Restore stock by creating a received movement
            StockMovement::create([
                'product_id' => $item->product_id,
                'type' => 'received',
                'quantity' => $item->quantity,
                'unit_cost' => $item->unit_cost_price,
                'total_cost' => $item->quantity * $item->unit_cost_price,
                'sale_id' => $sale->id,
            ]);
        }

        $sale->delete();
        return redirect()->route('sales-transactions.index')->with('success', 'Sales transaction deleted successfully.');
    }
}
