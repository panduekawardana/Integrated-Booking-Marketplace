import { Link } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/shared/EmptyState';

interface BookingItem {
    id: number;
    booking_code: string;
    final_amount: number;
    status: string;
    created_at: string;
    items: Array<{ id: number }>;
}

interface BookingsProps {
    bookings: {
        data: BookingItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function Bookings({ bookings }: BookingsProps) {
    return (
        <AppLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                <Link
                    href={route('services.travel-packages')}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    Book Now
                </Link>
            </div>

            {bookings.data.length === 0 ? (
                <EmptyState
                    title="No bookings yet"
                    description="Start exploring our services and make your first booking."
                    action={
                        <Link
                            href={route('services.travel-packages')}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Browse Services
                        </Link>
                    }
                />
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {bookings.data.map((booking) => (
                            <Link
                                key={booking.id}
                                href={route('customer.bookings.show', booking.id)}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">{booking.booking_code}</p>
                                    <p className="text-sm text-gray-500 mt-1">{new Date(booking.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="text-sm text-gray-500">{booking.items.length} item(s)</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">
                                        Rp {Number(booking.final_amount).toLocaleString('id-ID')}
                                    </p>
                                    <Badge variant={booking.status === 'pending' ? 'warning' : booking.status === 'confirmed' ? 'info' : booking.status === 'completed' ? 'success' : 'danger'}>
                                        {booking.status}
                                    </Badge>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <Pagination links={bookings.links} />
        </AppLayout>
    );
}
