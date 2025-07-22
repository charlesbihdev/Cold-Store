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
        $customer1 = Customer::create([
            'name' => 'John Doe',
            'phone' => '+233 20 123 4567',
            'email' => 'john@example.com',
            'address' => 'Accra, Ghana',
            'credit_limit' => 0,
            'current_balance' => 0,
            'is_active' => true,
        ]);

        $customer2 = Customer::create([
            'name' => 'Sarah Wilson',
            'phone' => '+233 24 987 6543',
            'email' => 'sarah@example.com',
            'address' => 'Kumasi, Ghana',
            'credit_limit' => 200,
            'current_balance' => 150.00,
            'is_active' => true,
        ]);

        // Create sample suppliers
        $supplier1 = Supplier::create([
            'name' => 'Fresh Foods Ltd',
            'contact_person' => 'Mike Johnson',
            'phone' => '+233 26 555 1234',
            'email' => 'mike@freshfoods.com',
            'address' => 'Tema, Ghana',
            'additional_info' => 'Main supplier',
            'is_active' => true,
        ]);

        $supplier2 = Supplier::create([
            'name' => 'Cold Storage Co',
            'contact_person' => 'Emma Davis',
            'phone' => '+233 27 777 8888',
            'email' => 'emma@coldstorage.com',
            'address' => 'Takoradi, Ghana',
            'additional_info' => 'Backup supplier',
            'is_active' => true,
        ]);

        // Create sample products
        Product::create([
            'name' => 'Frozen Chicken',
            'description' => 'Fresh frozen chicken breast',
            'category' => 'Meat',
            'lines_per_carton' => 1,
            'default_selling_price' => 25.00,
            'default_cost_price' => 18.00,
            'supplier_id' => $supplier1->id,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Ice Cream Vanilla',
            'description' => 'Vanilla ice cream 1L',
            'category' => 'Dairy',
            'lines_per_carton' => 1,
            'default_selling_price' => 8.50,
            'default_cost_price' => 5.50,
            'supplier_id' => $supplier2->id,
            'is_active' => true,
        ]);

        // Create a default user if none exists
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'admin@coldstore.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
            ]
        );

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
            'user_id' => $user->id,
        ]);
    }
}
