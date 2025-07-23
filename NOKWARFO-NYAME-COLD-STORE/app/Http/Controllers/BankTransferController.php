<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\BankTransfer;
use Illuminate\Http\Request;

class BankTransferController extends Controller
{
    public function index()
    {
        $bank_transfers = BankTransfer::orderByDesc('created_at')
            ->get()
            ->map(function ($transfer) {
                return [
                    'id' => $transfer->id,
                    'date' => $transfer->date ? $transfer->date->format('d M, Y') : null,
                    'created_at' => $transfer->created_at->format('d M, Y h:i A'),
                    'previous_balance' => number_format($transfer->previous_balance, 2),
                    'credit' => number_format($transfer->credit, 2),
                    'total_balance' => number_format($transfer->total_balance, 2),
                    'debit' => number_format($transfer->debit, 2),
                    'current_balance' => number_format($transfer->current_balance, 2),
                    'notes' => $transfer->notes,
                    'debit_tag' => $transfer->debit_tag,
                    'custom_tag' => $transfer->custom_tag,
                ];
            });

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
        try {
            $bankTransfer->delete();
            return back()->with('success', 'Bank transfer deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete bank transfer.']);
        }
    }
}
