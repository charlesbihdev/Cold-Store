<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('product-management');
    }
} 