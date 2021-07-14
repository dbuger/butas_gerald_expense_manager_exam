<?php

use App\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;

class PermissionSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $can_create_user = Permission::create(['name' => 'can_create_user', 'guard_name'=>'api']);
        $can_update_user = Permission::create(['name' => 'can_update_user', 'guard_name'=>'api']);
        $can_delete_user = Permission::create(['name' => 'can_delete_user', 'guard_name'=>'api']);

        $can_create_expense_category = Permission::create(['name' => 'can_create_expense_category', 'guard_name'=>'api']);
        $can_update_expense_category = Permission::create(['name' => 'can_update_expense_category', 'guard_name'=>'api']);
        $can_delete_expense_category = Permission::create(['name' => 'can_delete_expense_category', 'guard_name'=>'api']);

        $can_create_expense = Permission::create(['name' => 'can_create_expense', 'guard_name'=>'api']);
        $can_update_expense = Permission::create(['name' => 'can_update_expense', 'guard_name'=>'api']);
        $can_delete_expense = Permission::create(['name' => 'can_delete_expense', 'guard_name'=>'api']);

        $can_manage_users = Permission::create(['name' => 'can_manage_users', 'guard_name'=>'api']);
        $can_change_password = Permission::create(['name' => 'can_change_password', 'guard_name'=>'api']);

        $admin_permissions = [
            $can_create_user->id,
            $can_update_user->id,
            $can_delete_user->id,
            $can_create_expense_category->id,
            $can_update_expense_category->id,
            $can_delete_expense_category->id,
            $can_create_expense->id,
            $can_update_expense->id,
            $can_delete_expense->id,
            $can_manage_users->id,
            $can_change_password->id
        ];

        $admin_role = Role::create(['name'=>'Administrator','description'=>'super user', 'guard_name'=>'api']);
        $admin_role->syncPermissions($admin_permissions);

        $user_permissions = [
            $can_create_expense->id,
            $can_update_expense->id,
            $can_delete_expense->id,
            $can_change_password->id
        ];

        $user_role = Role::create(['name'=>'User','description'=>'can add expenses', 'guard_name'=>'api']);
        $user_role->syncPermissions($user_permissions);

    }
}
