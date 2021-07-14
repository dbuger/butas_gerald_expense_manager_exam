<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExpenseCategory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'created_by',
        'updated_by',
        'hex_color'
    ];

    protected $appends = [
        'created_at_f'
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
    #endregion

    #region Getters
    public function getCreatedAtFAttribute(): string
    {
        return Carbon::parse($this->created_at)->toDateString();
    }
    #endregion
}
