import AdminLayout from '@/components/layout/AdminLayout';
import StatsCard from '@/components/shared/StatsCard';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Link } from '@inertiajs/react';

interface DashboardProps {
    stats: {
        total_bookings: number;
        total_revenue: number;
        total_customers: number;
        total_travel_packages: number;
        total_motor_rentals: number;
        total_tour_guides: number;
        total_homestays: number;
    };
    recentBookings: Array<{
        id: number;
        booking_code: string;
        user: string;
        total_amount: number;
        status: string;
        items_count: number;
        created_at: string;
    }>;
}

export default function Dashboard({ stats, recentBookings }: DashboardProps) {
    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard title="Total Bookings" value={stats.total_bookings} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                <StatsCard title="Revenue" value={`Rp ${Number(stats.total_revenue).toLocaleString('id-ID')}`} icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <StatsCard title="Customers" value={stats.total_customers} icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
                <StatsCard title="Services" value={stats.total_travel_packages + stats.total_motor_rentals + stats.total_tour_guides + stats.total_homestays} icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Services Overview</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Travel Packages</span>
                                <span className="text-sm font-semibold">{stats.total_travel_packages}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Motor Rentals</span>
                                <span className="text-sm font-semibold">{stats.total_motor_rentals}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Tour Guides</span>
                                <span className="text-sm font-semibold">{stats.total_tour_guides}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Homestays</span>
                                <span className="text-sm font-semibold">{stats.total_homestays}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Recent Bookings</h2>
                            <Link href={route('admin.bookings.index')} className="text-sm text-blue-600 hover:text-blue-700">
                                View All
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentBookings.map((booking) => (
                                <Link
                                    key={booking.id}
                                    href={route('admin.bookings.show', booking.id)}
                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{booking.booking_code}</p>
                                        <p className="text-xs text-gray-500">{booking.user}</p>
                                    </div>
                                    <Badge variant={booking.status === 'pending' ? 'warning' : booking.status === 'confirmed' ? 'info' : booking.status === 'completed' ? 'success' : 'danger'}>
                                        {booking.status}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
