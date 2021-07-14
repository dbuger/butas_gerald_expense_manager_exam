<?php

use Illuminate\Database\Seeder;

class DemoSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
           PermissionSeed::class,
           DefaultUsersSeed::class
        ]);
    }
}
