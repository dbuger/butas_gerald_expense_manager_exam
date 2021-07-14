<?php

use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DefaultUsersSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $admin = User::create([
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@expensemanager.com',
            'password' => Hash::make('password'),
        ]);

        $admin->assignRole("Administrator");

        $user = User::create([
            'name' => 'Leo Ocampo',
            'email' => 'leo@expensemanager.com',
            'password' => Hash::make('password'),
        ]);

        $user->assignRole("User");

    }
}
