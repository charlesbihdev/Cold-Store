<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankTransfer extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'previous_balance',
        'credit',
        'total_balance',
        'debit',
        'debit_tag',
        'current_balance',
        'custom_tag',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'previous_balance' => 'decimal:2',
        'credit' => 'decimal:2',
        'total_balance' => 'decimal:2',
        'debit' => 'decimal:2',
        'current_balance' => 'decimal:2',
    ];
} 