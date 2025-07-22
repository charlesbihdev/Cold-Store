<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductManagementController;
use App\Http\Controllers\StockControlController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\DailySalesReportController;
use App\Http\Controllers\CreditCollectionController;
use App\Http\Controllers\ProfitAnalysisController;
use App\Http\Controllers\BankTransferController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DailyCollectionsController;
use App\Http\Controllers\SalesTransactionController;

Route::get('/', function () {
    return inertia('welcome');
})->name('home');

Route::resource('dashboard', DashboardController::class);
Route::resource('products', ProductController::class);
Route::resource('stock-control', StockControlController::class);
Route::resource('daily-sales-report', DailySalesReportController::class);
Route::resource('credit-collection', CreditCollectionController::class);
Route::resource('profit-analysis', ProfitAnalysisController::class);
Route::resource('bank-transfers', BankTransferController::class);
Route::resource('suppliers', SupplierController::class);
Route::resource('customers', CustomerController::class);
Route::resource('daily-collections', DailyCollectionsController::class);
Route::resource('sales-transactions', SalesTransactionController::class);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
