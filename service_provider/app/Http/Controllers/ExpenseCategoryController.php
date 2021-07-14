<?php

namespace App\Http\Controllers;

use App\Expense;
use App\ExpenseCategory;
use App\Role;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ExpenseCategoryController extends Controller
{
    private $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function all()
    {
        $roles = ExpenseCategory::with('creator')->when(!empty($this->request->search), function ($query) {
            return $query->where(function ($query) {
                $query->where('name', 'like', $this->request->search . '%');
            });
        })->get();
        return response($roles);
    }

    public function get($id){
        $record = ExpenseCategory::with('creator')->find($id);
        return response($record);
    }

    public function save()
    {
        $data = $this->request->all();
        if(!isset($data['id']) || $data['id'] == -1){
            $data['created_by'] = $this->request->user()->id;
            $data['updated_by'] = -1;
        }else{
            $data['updated_by'] = $this->request->user()->id;
        }

        $user = ExpenseCategory::updateOrCreate([
            'id' => !isset($data['id']) ? -1 : $data['id']
        ], $data);

        return response($user);
    }

    public function delete($id){
        $record = ExpenseCategory::find($id);
        if(!empty($record)){
            if (Expense::where('expense_category_id', '=', $record->id)->exists()) {
                return response('Unable to delete Category. Record is currently referenced to some expenses.',406);
            }
            $record->delete();
        }
        return response("Deleted", 204);
    }
}
