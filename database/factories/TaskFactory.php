<?php

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
        'title'       => $this->faker->sentence(),
        'description' => $this->faker->paragraph(),
        'status'      => $this->faker->randomElement(['pending', 'completed']),
        'due_date'    => $this->faker->dateTimeBetween('now', '+1 month'),
        'user_id'     => \App\Models\User::factory(),
        ];
    }
}
