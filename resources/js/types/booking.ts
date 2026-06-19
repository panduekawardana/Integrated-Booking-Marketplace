export interface Booking {
    id: number;
    booking_code: string;
    user_id: number;
    total_amount: string;
    discount_amount: string;
    final_amount: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes: string | null;
    admin_notes: string | null;
    cancellation_reason: string | null;
    confirmed_at: string | null;
    completed_at: string | null;
    cancelled_at: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    items?: BookingItem[];
    payments?: Payment[];
    reviews?: Review[];
}

export interface BookingItem {
    id: number;
    booking_id: number;
    bookable_type: string;
    bookable_id: number;
    quantity: number;
    unit_price: string;
    subtotal: string;
    date_from: string;
    date_to: string | null;
    notes: string | null;
    bookable?: Record<string, unknown>;
}

export interface Review {
    id: number;
    user_id: number;
    booking_id: number;
    rating: number;
    review_text: string | null;
    is_approved: boolean;
    approved_at: string | null;
    created_at: string;
    user?: {
        id: number;
        name: string;
        avatar: string | null;
    };
}
