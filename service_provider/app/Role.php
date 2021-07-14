<?php

namespace App;

use Carbon\Carbon;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    protected $appends = [
        'created_at_f'
    ];

    public function getCreatedAtFAttribute(): string
    {
        return Carbon::parse($this->created_at)->toDateString();
    }
}
