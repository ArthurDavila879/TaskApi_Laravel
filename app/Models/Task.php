<?php

namespace App\Models;

use App\TaskStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    /**
     * Atributos que podem ser preenchidos em massa.
     */
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
        'due_date',
    ];

    /**
     * Casts de atributos (converte os tipos automaticamente ao buscar do banco).
     */
    protected $casts = [
         'status' => TaskStatus::class,
        'is_completed' => 'boolean',
        'due_date' => 'datetime',
    ];

    /**
     * Relacionamento: Uma tarefa pertence a um Usuário.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
