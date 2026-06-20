<?php

namespace App\Http\Requests;

use App\Models\Homestay;
use App\Models\MotorRental;
use App\Models\TourGuide;
use App\Models\TravelPackage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

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
            'items.*.bookable_id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.date_from' => ['required', 'date'],
            'items.*.date_to' => ['nullable', 'date', 'after_or_equal:items.*.date_from'],
            'items.*.notes' => ['nullable', 'string', 'max:500'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                $items = $this->input('items', []);

                foreach ($items as $index => $item) {
                    $model = match ($item['bookable_type'] ?? null) {
                        'travel_package' => TravelPackage::class,
                        'motor_rental' => MotorRental::class,
                        'tour_guide' => TourGuide::class,
                        'homestay' => Homestay::class,
                        default => null,
                    };

                    if ($model === null) {
                        $validator->errors()->add(
                            "items.{$index}.bookable_type",
                            'Invalid bookable type.'
                        );

                        continue;
                    }

                    $exists = $model::where('id', $item['bookable_id'])->exists();

                    if (! $exists) {
                        $validator->errors()->add(
                            "items.{$index}.bookable_id",
                            "The selected bookable ID {$item['bookable_id']} does not exist in {$item['bookable_type']}."
                        );
                    }
                }
            },
        ];
    }
}
