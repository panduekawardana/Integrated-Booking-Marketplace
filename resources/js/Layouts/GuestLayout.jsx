import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold text-white tracking-tight">
                        Booking Travel
                    </Link>
                    <p className="mt-2 text-blue-200 text-sm">Your trusted travel companion</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
