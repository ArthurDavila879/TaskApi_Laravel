<?php

namespace App\Http\Requests;

use App\TaskStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return True;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "title"=>["required","string"],
            "description"=>["nullable","string"],
            "status"=>["nullable",new Enum(TaskStatus::class)],
            "due_date"=>["nullable","date"],
            "cep"=>["nullable","string"],
        ];
    }
}
