<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTravelPackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'origin' => ['required', 'string', 'max:255'],
            'destination' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'itinerary' => ['nullable', 'json'],
            'price' => ['required', 'numeric', 'min:0'],
            'max_pax' => ['required', 'integer', 'min:1'],
            'duration_days' => ['required', 'integer', 'min:1'],
            'includes' => ['nullable', 'string'],
            'excludes' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ];
    }
}
