<?php

namespace App\Http\Controllers;

use App\Role;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;


class RoleController extends Controller
{
    private $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function permissions()
    {
        $roles = Permission::when(!empty($this->request->search), function ($query) {
            return $query->where(function ($query) {
                $query->where('name', 'like', $this->request->search . '%');
            });
        })->get();
        return response($roles);
    }

    public function all()
    {
        $roles = Role::when(!empty($this->request->search), function ($query) {
            return $query->where(function ($query) {
                $query->where('name', 'like', $this->request->search . '%');
            });
        })->get();
        return response($roles);
    }


    public function get($id){
        $role = Role::with(['permissions'])->find($id);
        return response($role);
    }

    public function save()
    {
        $data = $this->request->all();
        $role = Role::updateOrCreate([
            'id' => !isset($data['id']) ? -1 : $data['id']
        ], $data);
        if(isset($data['permissions'])){
            $role->syncPermissions(collect($data['permissions'])->pluck('id')->values());
        }

        return response($role);
    }

    public function delete($id){
        $role = Role::with(['permissions'])->find($id);
        if(!empty($role))
            $role->delete();
        return response("Deleted", 204);
    }
}
