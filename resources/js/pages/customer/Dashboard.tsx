import AppLayout from '@/components/layout/AppLayout';
import StatsCard from '@/components/shared/StatsCard';
import ServiceCard from '@/components/shared/ServiceCard';
import { Link } from '@inertiajs/react';
import Badge from '@/components/ui/Badge';

interface DashboardProps {
    stats: {
        total_bookings: number;
        pending_bookings: number;
        completed_bookings: number;
    };
    recentBookings: Array<{
        id: number;
        booking_code: string;
        status: string;
        final_amount: number;
        created_at: string;
        items: Array<{ id: number }>;
    }>;
    travelPackages: Array<Record<string, unknown>>;
    motorRentals: Array<Record<string, unknown>>;
    tourGuides: Array<Record<string, unknown>>;
    homestays: Array<Record<string, unknown>>;
}

export default function Dashboard({ stats, recentBookings, travelPackages, motorRentals, tourGuides, homestays }: DashboardProps) {
    return (
        <AppLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Customer Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCard title="Total Bookings" value={stats.total_bookings} />
                <StatsCard title="Pending" value={stats.pending_bookings} />
                <StatsCard title="Completed" value={stats.completed_bookings} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                        <Link href={route('customer.bookings.index')} className="text-sm text-blue-600 hover:text-blue-700">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentBookings.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-8">No bookings yet.</p>
                        )}
                        {recentBookings.map((booking) => (
                            <Link
                                key={booking.id}
                                href={route('customer.bookings.show', booking.id)}
                                className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{booking.booking_code}</p>
                                        <p className="text-xs text-gray-500 mt-1">{booking.created_at}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            Rp {Number(booking.final_amount).toLocaleString('id-ID')}
                                        </p>
                                        <Badge variant={booking.status === 'pending' ? 'warning' : booking.status === 'confirmed' ? 'info' : booking.status === 'completed' ? 'success' : 'danger'}>
                                            {booking.status}
                                        </Badge>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Browse</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-700">Travel Packages</h3>
                                <Link href={route('services.travel-packages')} className="text-xs text-blue-600">View All</Link>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {travelPackages.map((pkg) => (
                                    <ServiceCard key={(pkg as any).id} item={pkg as any} type="travel_package" routeName="services.travel-packages.show" />
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-700">Motor Rentals</h3>
                                <Link href={route('services.motor-rentals')} className="text-xs text-blue-600">View All</Link>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {motorRentals.map((motor) => (
                                    <ServiceCard key={(motor as any).id} item={motor as any} type="motor_rental" routeName="services.motor-rentals.show" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
