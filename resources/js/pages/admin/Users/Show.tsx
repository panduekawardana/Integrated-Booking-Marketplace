import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Link } from '@inertiajs/react';

interface UserShowProps {
    user: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
        avatar: string | null;
        address: string | null;
        nationality: string | null;
        is_active: boolean;
        bookings_count: number;
        created_at: string;
        bookings: Array<{
            id: number;
            booking_code: string;
            final_amount: number;
            status: string;
            created_at: string;
        }>;
    };
}

export default function Show({ user }: UserShowProps) {
    return (
        <AdminLayout>
            <Link href={route('admin.users.index')} className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
                &larr; Back to Users
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">User Details</h2>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div>
                            <p className="text-gray-500">Name</p>
                            <p className="font-medium">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="font-medium">{user.phone || '-'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Nationality</p>
                            <p className="font-medium">{user.nationality || '-'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Address</p>
                            <p className="font-medium">{user.address || '-'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Status</p>
                            <Badge variant={user.is_active ? 'success' : 'danger'}>
                                {user.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-gray-500">Total Bookings</p>
                            <p className="font-medium">{user.bookings_count}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Member Since</p>
                            <p className="font-medium">{new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Recent Bookings</h2>
                        </CardHeader>
                        <CardContent>
                            {user.bookings.length === 0 ? (
                                <p className="text-sm text-gray-500">No bookings yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {user.bookings.map((booking) => (
                                        <Link
                                            key={booking.id}
                                            href={route('admin.bookings.show', booking.id)}
                                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                                        >
                                            <div>
                                                <p className="font-medium text-sm">{booking.booking_code}</p>
                                                <p className="text-xs text-gray-500">{new Date(booking.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">Rp {Number(booking.final_amount).toLocaleString('id-ID')}</p>
                                                <Badge variant={booking.status === 'pending' ? 'warning' : booking.status === 'confirmed' ? 'info' : booking.status === 'completed' ? 'success' : 'danger'}>
                                                    {booking.status}
                                                </Badge>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
