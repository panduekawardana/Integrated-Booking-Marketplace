import { Link, router } from '@inertiajs/react';
import { type ReactNode, useState } from 'react';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-8">
                            <Link href={route('customer.dashboard')} className="text-xl font-bold text-gray-900">
                                Booking Travel
                            </Link>
                            <nav className="hidden md:flex items-center gap-6">
                                <Link href={route('customer.dashboard')} className="text-sm text-gray-600 hover:text-gray-900">
                                    Dashboard
                                </Link>
                                <Link href={route('customer.bookings.index')} className="text-sm text-gray-600 hover:text-gray-900">
                                    My Bookings
                                </Link>
                                <Link href={route('services.travel-packages')} className="text-sm text-gray-600 hover:text-gray-900">
                                    Travel Packages
                                </Link>
                                <Link href={route('services.motor-rentals')} className="text-sm text-gray-600 hover:text-gray-900">
                                    Motor Rentals
                                </Link>
                                <Link href={route('services.tour-guides')} className="text-sm text-gray-600 hover:text-gray-900">
                                    Tour Guides
                                </Link>
                                <Link href={route('services.homestays')} className="text-sm text-gray-600 hover:text-gray-900">
                                    Homestays
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href={route('customer.reviews.index')} className="text-sm text-gray-600 hover:text-gray-900">
                                My Reviews
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Logout
                            </button>
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="md:hidden p-2 text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                {showMobileMenu && (
                    <div className="md:hidden border-t px-4 py-3 space-y-2">
                        <Link href={route('customer.dashboard')} className="block text-sm text-gray-600 py-1">Dashboard</Link>
                        <Link href={route('customer.bookings.index')} className="block text-sm text-gray-600 py-1">My Bookings</Link>
                        <Link href={route('services.travel-packages')} className="block text-sm text-gray-600 py-1">Travel Packages</Link>
                        <Link href={route('services.motor-rentals')} className="block text-sm text-gray-600 py-1">Motor Rentals</Link>
                        <Link href={route('services.tour-guides')} className="block text-sm text-gray-600 py-1">Tour Guides</Link>
                        <Link href={route('services.homestays')} className="block text-sm text-gray-600 py-1">Homestays</Link>
                    </div>
                )}
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
