<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    protected $fillable = [
        'expense_category_id',
        'amount',
        'entry_at',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'amount' => 'float'
    ];

    protected $appends = [
        'created_at_f',
        'entry_at_f'
    ];

    #region Relationships
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class,'created_by','id');
    }

    public function updator(): BelongsTo
    {
        return $this->belongsTo(User::class,'updated_by','id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ExpenseCategory::class,'expense_category_id','id');
    }
    #endregion

    #region Getters
    public function getCreatedAtFAttribute(): string
    {
        return Carbon::parse($this->created_at)->toDateString();
    }
    public function getEntryAtFAttribute(): string
    {
        return Carbon::parse($this->entry_at)->toDateString();
    }
    #endregion
}
