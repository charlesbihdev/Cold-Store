<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'address',
        'credit_limit',
        'current_balance',
        'is_active',
    ];

    protected $casts = [
        'credit_limit' => 'decimal:2',
        'current_balance' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function creditSales(): HasMany
    {
        return $this->hasMany(Sale::class)->where('payment_type', 'credit');
    }

    public function getTotalCreditAttribute(): float
    {
        return $this->creditSales()
            ->whereIn('status', ['completed', 'pending'])
            ->get()
            ->sum('remaining_amount');
    }

    public function getOverdueAmountAttribute(): float
    {
        return $this->creditSales()
            ->where('status', 'completed')
            ->where('due_date', '<', now())
            ->get()
            ->sum('remaining_amount');
    }

    public function getPendingCreditAttribute(): float
    {
        return $this->creditSales()
            ->where('status', 'completed')
            ->where('due_date', '>=', now())
            ->get()
            ->sum('remaining_amount');
    }

    public function getDebtAttribute(): float
    {
        return $this->sales()
            ->where('remaining_amount', '>', 0)
            ->sum('remaining_amount');
    }
}
