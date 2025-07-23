<?php

namespace App\Http\Controllers;

use App\Models\BankTransfer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BankTransferController extends Controller
{
    public function index()
    {
        $bank_transfers = BankTransfer::orderByDesc('created_at')->get();

        return Inertia::render('bank-transfers', [
            'bank_transfers' => $bank_transfers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'previous_balance' => 'required|numeric|min:0',
            'credit' => 'nullable|numeric|min:0',
            'total_balance' => 'required|numeric|min:0',
            'debit' => 'nullable|numeric|min:0',
            'debit_tag' => 'nullable|string|max:255',
            'current_balance' => 'required|numeric|min:0',
            'custom_tag' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        BankTransfer::create($validated);

        return redirect()->route('bank-transfers.index')->with('success', 'Bank transfer recorded successfully.');
    }

    public function destroy(BankTransfer $bankTransfer)
    {
        $bankTransfer->delete();
        return redirect()->route('bank-transfers.index')->with('success', 'Bank transfer deleted successfully.');
    }
}
