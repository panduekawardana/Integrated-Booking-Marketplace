export interface TravelPackage {
    id: number;
    name: string;
    slug: string;
    origin: string;
    destination: string;
    description: string;
    itinerary: Record<string, unknown> | null;
    price: number;
    max_pax: number;
    duration_days: number;
    includes: string | null;
    excludes: string | null;
    is_active: boolean;
    created_at: string;
    media?: Media[];
    primary_image?: Media | null;
}

export interface MotorRental {
    id: number;
    name: string;
    slug: string;
    brand: string;
    motor_type: string;
    plate_number: string;
    description: string | null;
    price_per_day: number;
    insurance_price: number;
    cc: number | null;
    transmission: 'manual' | 'matic' | null;
    is_active: boolean;
    created_at: string;
    media?: Media[];
    primary_image?: Media | null;
}

export interface TourGuide {
    id: number;
    name: string;
    slug: string;
    bio: string | null;
    languages: string[] | null;
    specialties: string[] | null;
    price_per_day: number;
    max_pax: number;
    phone: string | null;
    is_active: boolean;
    created_at: string;
    media?: Media[];
    primary_image?: Media | null;
}

export interface Homestay {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    address: string;
    city: string;
    latitude: number | null;
    longitude: number | null;
    facilities: string[] | null;
    rules: string | null;
    check_in_time: string;
    check_out_time: string;
    is_active: boolean;
    created_at: string;
    media?: Media[];
    rooms?: HomestayRoom[];
    rooms_count?: number;
}

export interface HomestayRoom {
    id: number;
    homestay_id: number;
    name: string;
    description: string | null;
    price_per_night: number;
    max_guests: number;
    total_rooms: number;
    facilities: string[] | null;
    size_sqm: number | null;
    is_active: boolean;
}

export interface Media {
    id: number;
    mediable_type: string;
    mediable_id: number;
    url: string;
    path: string;
    disk: string;
    mime_type: string | null;
    size: number | null;
    is_primary: boolean;
    sort_order: number;
}
