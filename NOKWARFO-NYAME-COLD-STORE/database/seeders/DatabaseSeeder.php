<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\CreditCollection;
use App\Models\DailyCollection;
use App\Models\BankTransfer;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create sample customers
        Customer::create([
            'name' => 'John Doe',
            'phone' => '+233 20 123 4567',
            'email' => 'john@example.com',
            'address' => 'Accra, Ghana',
            'current_balance' => 0,
            'is_active' => true,
        ]);

        Customer::create([
            'name' => 'Sarah Wilson',
            'phone' => '+233 24 987 6543',
            'email' => 'sarah@example.com',
            'address' => 'Kumasi, Ghana',
            'current_balance' => 150.00,
            'is_active' => true,
        ]);

        // Create sample suppliers
        Supplier::create([
            'name' => 'Fresh Foods Ltd',
            'contact_person' => 'Mike Johnson',
            'phone' => '+233 26 555 1234',
            'email' => 'mike@freshfoods.com',
            'address' => 'Tema, Ghana',
            'is_active' => true,
        ]);

        Supplier::create([
            'name' => 'Cold Storage Co',
            'contact_person' => 'Emma Davis',
            'phone' => '+233 27 777 8888',
            'email' => 'emma@coldstorage.com',
            'address' => 'Takoradi, Ghana',
            'is_active' => true,
        ]);

        // Create sample products
        Product::create([
            'name' => 'Frozen Chicken',
            'description' => 'Fresh frozen chicken breast',
            'category' => 'Meat',
            'unit_price' => 25.00,
            'cost_price' => 18.00,
            'stock_quantity' => 100,
            'supplier_id' => 1,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Ice Cream Vanilla',
            'description' => 'Vanilla ice cream 1L',
            'category' => 'Dairy',
            'unit_price' => 8.50,
            'cost_price' => 5.50,
            'stock_quantity' => 50,
            'supplier_id' => 2,
            'is_active' => true,
        ]);

        // Create sample credit collections
        CreditCollection::create([
            'customer_id' => 'John Doe',
            'amount_collected' => 75.00,
            'notes' => 'Partial payment',
        ]);

        CreditCollection::create([
            'customer_id' => 'Sarah Wilson',
            'amount_collected' => 150.00,
            'notes' => 'Full payment',
        ]);

        // Create sample daily collections
        DailyCollection::create([
            'customer_name' => 'John Doe',
            'amount_collected' => 75.00,
            'payment_method' => 'Cash',
            'notes' => 'Morning collection',
        ]);

        DailyCollection::create([
            'customer_name' => 'Sarah Wilson',
            'amount_collected' => 150.00,
            'payment_method' => 'Mobile Money',
            'notes' => 'Afternoon collection',
        ]);

        // Create sample bank transfers
        BankTransfer::create([
            'date' => now(),
            'previous_balance' => 1000.00,
            'credit' => 500.00,
            'total_balance' => 1500.00,
            'debit' => 200.00,
            'debit_tag' => 'Expenses',
            'current_balance' => 1300.00,
            'custom_tag' => 'Daily',
            'notes' => 'Daily bank activity',
        ]);
    }
}
