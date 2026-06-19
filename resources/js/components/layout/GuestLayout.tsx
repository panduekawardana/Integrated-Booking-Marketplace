import { Link } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface GuestLayoutProps {
    children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="text-xl font-bold text-gray-900">
                            Booking Travel
                        </Link>
                        <nav className="flex items-center gap-4">
                            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Register
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>
            <main>{children}</main>
        </div>
    );
}
