<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'view services',
            'book services',
            'make payments',
            'write reviews',
            'manage travel packages',
            'manage motor rentals',
            'manage tour guides',
            'manage homestays',
            'manage bookings',
            'manage payments',
            'manage users',
            'manage reviews',
            'view reports',
            'manage settings',
        ];

        foreach ($permissions as $name) {
            Permission::create(['name' => $name]);
        }

        $customer = Role::create(['name' => 'customer']);
        $customerPermissions = Permission::whereIn('name', [
            'view services',
            'book services',
            'make payments',
            'write reviews',
        ])->get();
        $customer->syncPermissions($customerPermissions);

        $admin = Role::create(['name' => 'admin']);
        $admin->syncPermissions(Permission::all());
    }
}
