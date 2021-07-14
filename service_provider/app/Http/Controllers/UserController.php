<?php

namespace App\Http\Controllers;

use App\Role;
use App\User;
use Dotenv\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    private $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function getFromToken()
    {
        $user = $this->request->user()->toArray();
        $user['roles'] = $this->request->user()->roles()->pluck('name');
        $user['permissions'] = Role::with(['permissions'])
            ->whereIn('id', $this->request->user()->roles()->pluck('id'))->get()->map(function ($data) {
            return $data->permissions->pluck('name')->values();
        })->values()[0];
        return response($user);

    }

    public function all()
    {
        $roles = User::with(['roles'])->when(!empty($this->request->search), function ($query) {
            return $query->where(function ($query) {
                $query->where('name', 'like', $this->request->search . '%');
            });
        })->get();
        return response($roles);
    }

    public function get($id){
        $user = User::with(['roles'])->find($id);
        $user['roles'] = $this->request->user()->roles()->pluck('name');
        $user['permissions'] = Role::with(['permissions'])
            ->whereIn('id', $this->request->user()->roles()->pluck('id'))->get()->map(function ($data) {
                return $data->permissions->pluck('name')->values();
            })->values()[0];
        return response($user);
    }

    public function save()
    {
        $data = $this->request->all();
        if(!isset($data['id']) || $data['id'] == -1){
            $data['password'] = bcrypt('password');
            $rules = array('email' => 'unique:users,email');

            $validator = \Illuminate\Support\Facades\Validator::make($data, $rules);

            if ($validator->fails()) {
                return response('That email address is already registered. You sure you don\'t have an account?',406);
            }
        }
        $user = User::updateOrCreate([
            'id' => !isset($data['id']) ? -1 : $data['id']
        ], $data);

        if(isset($data['roles']) && is_array($data['roles'])){
            $user->syncRoles($data['roles']);
        }

        return response($user);
    }

    public function change_password()
    {
        $data = $this->request->all();
        $user = $this->request->user();
        if(Hash::check($data['old_password'],$user->password) == false)
            return response('Old password didn\'t match with your current password.',406);
        else if(Hash::check($data['new_password'],bcrypt($data['confirm_password'])) == false)
            return response('New Password didn\'t match with Confirm. Please make sure the password matches.',406);

        $user->password = bcrypt($data['new_password']);
        $user->save();
        return response($user);
    }

    public function delete($id){
        $user = User::find($id);
        if(!empty($user))
            $user->delete();
        return response("Deleted", 204);
    }
}
