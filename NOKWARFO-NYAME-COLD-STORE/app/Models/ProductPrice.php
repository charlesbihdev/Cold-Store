<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductPrice extends Model
{
    use HasFactory;

    protected $table = 'product_prices';

    protected $fillable = [
        'product_id',
        'selling_price',
        'valid_from',
        'valid_to',
    ];

    protected $casts = [
        'selling_price' => 'decimal:2',
        'valid_from' => 'date',
        'valid_to' => 'date',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
