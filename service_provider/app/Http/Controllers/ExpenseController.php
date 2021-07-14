<?php

namespace App\Http\Controllers;

use App\ExpenseCategory;
use App\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExpenseController extends Controller
{
    private $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function report()
    {
        $result = DB::table('expenses')
            ->select([
                'expense_categories.name as category_name',
                'expense_categories.hex_color as color',
                DB::raw('SUM(expenses.amount) as total')
            ])
            ->join('expense_categories','expenses.expense_category_id','=','expense_categories.id')
            ->when($this->request->user()->hasRole('Administrator') == false,function ($query){
                return $query->where('expenses.created_by','=',$this->request->user()->id);
            })
            ->groupBy('expenses.expense_category_id,expense_categories.name,expense_categories.hex_color')
            ->get();
        return response($result);
    }

    public function all()
    {
        $roles = Expense::with(['creator','category'])
        ->when(!empty($this->request->search), function ($query) {
            return $query->where(function ($query) {
                $query->where('name', 'like', $this->request->search . '%');
            });
        })
        ->when($this->request->user()->hasRole('Administrator') == false,function ($query){
            return $query->where('created_by','=',$this->request->user()->id);
        })
        ->get();
        return response($roles);
    }

    public function get($id){
        $record = Expense::with(['creator','category'])->find($id);
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

        $user = Expense::updateOrCreate([
            'id' => !isset($data['id']) ? -1 : $data['id']
        ], $data);

        return response($user);
    }

    public function delete($id){
        $record = Expense::find($id);
        if(!empty($record))
            $record->delete();
        return response("Deleted", 204);
    }
}
