<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHomestayRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'max_guests' => ['required', 'integer', 'min:1'],
            'total_rooms' => ['required', 'integer', 'min:0'],
            'facilities' => ['nullable', 'array'],
            'facilities.*' => ['string', 'max:100'],
            'size_sqm' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }
}
