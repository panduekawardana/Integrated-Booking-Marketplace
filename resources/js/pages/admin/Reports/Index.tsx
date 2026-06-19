import { router } from '@inertiajs/react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import StatsCard from '@/components/shared/StatsCard';
import Button from '@/components/ui/Button';

interface ReportsIndexProps {
    revenueData: Array<{ label: string; value: number }>;
    bookingData: Array<{ label: string; value: number }>;
    totalRevenue: number;
    totalBookings: number;
    serviceBreakdown: Record<string, number>;
    filters: {
        period: string;
        start_date: string;
        end_date: string;
    };
}

export default function Index({ revenueData, bookingData, totalRevenue, totalBookings, serviceBreakdown, filters }: ReportsIndexProps) {
    const maxRevenue = Math.max(...revenueData.map(d => d.value), 1);
    const maxBookings = Math.max(...bookingData.map(d => d.value), 1);

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                <div className="flex items-center gap-3">
                    <select
                        value={filters.period}
                        onChange={(e) => router.get(route('admin.reports.index'), { period: e.target.value }, { preserveState: true })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatsCard title="Total Revenue" value={`Rp ${Number(totalRevenue).toLocaleString('id-ID')}`} />
                <StatsCard title="Total Bookings" value={totalBookings} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Revenue Trend</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {revenueData.map((point) => (
                                <div key={point.label} className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 w-24 flex-shrink-0">{point.label}</span>
                                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-full rounded-full transition-all"
                                            style={{ width: `${(point.value / maxRevenue) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium w-24 text-right">Rp {point.value.toLocaleString('id-ID')}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Booking Trend</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {bookingData.map((point) => (
                                <div key={point.label} className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 w-24 flex-shrink-0">{point.label}</span>
                                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                                        <div
                                            className="bg-green-600 h-full rounded-full transition-all"
                                            style={{ width: `${(point.value / maxBookings) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium w-16 text-right">{point.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold">Service Breakdown</h2>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(serviceBreakdown).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 rounded-lg p-4 text-center">
                                <p className="text-2xl font-bold text-gray-900">{value}</p>
                                <p className="text-sm text-gray-500 mt-1 capitalize">{key.replace('_', ' ')}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
