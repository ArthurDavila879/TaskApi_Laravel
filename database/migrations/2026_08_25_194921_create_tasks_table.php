<?php

use App\TaskStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            // Cria a coluna user_id e a chave estrangeira vinculada à tabela users
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->string('title');
            $table->text('description')->nullable(); // nullable significa que o campo é opcional
            $table->enum('status', array_column(TaskStatus::cases(), 'value'))
                ->default(TaskStatus::PENDING->value);
            $table->timestamp('due_date')->nullable(); // data de vencimento opcional
            $table->timestamps(); // cria created_at e updated_at automaticamente
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
