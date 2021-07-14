<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ExpenseCategoryController;
use App\Http\Controllers\ExpenseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:api'])->prefix('user')->group(function () {
    Route::get('/get_from_token', [UserController::class,'getFromToken']);
    Route::get('/', [UserController::class,'all']);
    Route::get('/{id}', [UserController::class,'get'])->where('id', '[0-9]+');
    Route::post('/save', [UserController::class,'save']);
    Route::delete('/{id}', [UserController::class,'delete'])->where('id', '[0-9]+');
    Route::post('/change_password', [UserController::class,'change_password']);

});

Route::middleware(['auth:api'])->prefix('roles')->group(function () {
    Route::get('/', [RoleController::class,'all']);
    Route::get('/permissions', [RoleController::class,'permissions']);
    Route::get('/{id}', [RoleController::class,'get'])->where('id', '[0-9]+');
    Route::post('/save', [RoleController::class,'save']);
    Route::delete('/{id}', [RoleController::class,'delete'])->where('id', '[0-9]+');
});

Route::middleware(['auth:api'])->prefix('expense_categories')->group(function () {
    Route::get('/', [ExpenseCategoryController::class,'all']);
    Route::get('/{id}', [ExpenseCategoryController::class,'get'])->where('id', '[0-9]+');
    Route::post('/save', [ExpenseCategoryController::class,'save']);
    Route::delete('/{id}', [ExpenseCategoryController::class,'delete'])->where('id', '[0-9]+');
});


Route::middleware(['auth:api'])->prefix('expenses')->group(function () {
    Route::get('/report', [ExpenseController::class,'report']);
    Route::get('/', [ExpenseController::class,'all']);
    Route::get('/{id}', [ExpenseController::class,'get'])->where('id', '[0-9]+');
    Route::post('/save', [ExpenseController::class,'save']);
    Route::delete('/{id}', [ExpenseController::class,'delete'])->where('id', '[0-9]+');
});
