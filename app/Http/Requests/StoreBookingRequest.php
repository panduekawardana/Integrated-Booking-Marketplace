<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.bookable_type' => ['required', 'string', 'in:travel_package,motor_rental,tour_guide,homestay'],
            'items.*.bookable_id' => ['required', 'integer', 'exists:'.($this->getBookableTable($this->input('items.*.bookable_type'))).',id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.date_from' => ['required', 'date'],
            'items.*.date_to' => ['nullable', 'date', 'after_or_equal:items.*.date_from'],
            'items.*.notes' => ['nullable', 'string', 'max:500'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    private function getBookableTable(?string $type): string
    {
        return match ($type) {
            'travel_package' => 'travel_packages',
            'motor_rental' => 'motor_rentals',
            'tour_guide' => 'tour_guides',
            'homestay' => 'homestays',
            default => 'travel_packages',
        };
    }
}
