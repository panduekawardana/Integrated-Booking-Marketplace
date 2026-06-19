export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: 'customer' | 'admin';
    phone: string | null;
    avatar: string | null;
    address: string | null;
    nationality: string | null;
    currency_preference: string;
    is_active: boolean;
}

export interface Auth {
    user: User | null;
}
