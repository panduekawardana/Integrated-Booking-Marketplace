import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Input } from '@/components/ui';
import { useState } from 'react';

interface BookingsIndexProps {
    bookings: {
        data: Array<{
            id: number;
            booking_code: string;
            user: { name: string };
            final_amount: number;
            status: string;
            items: Array<Record<string, unknown>>;
            created_at: string;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: Record<string, string>;
}

export default function Index({ bookings, filters }: BookingsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h1>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Input placeholder="Search booking code or customer..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && router.get(route('admin.bookings.index'), { search }, { preserveState: true })} className="max-w-xs" />
                        <Button variant="secondary" onClick={() => router.get(route('admin.bookings.index'), { search }, { preserveState: true })}>Search</Button>
                        <select
                            value={filters.status || ''}
                            onChange={(e) => router.get(route('admin.bookings.index'), { status: e.target.value }, { preserveState: true })}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>Booking Code</TableHeader>
                                <TableHeader>Customer</TableHeader>
                                <TableHeader>Amount</TableHeader>
                                <TableHeader>Items</TableHeader>
                                <TableHeader>Status</TableHeader>
                                <TableHeader>Date</TableHeader>
                                <TableHeader>Actions</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookings.data.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell><span className="font-mono font-medium">{booking.booking_code}</span></TableCell>
                                    <TableCell>{booking.user?.name || 'N/A'}</TableCell>
                                    <TableCell>Rp {Number(booking.final_amount).toLocaleString('id-ID')}</TableCell>
                                    <TableCell>{booking.items.length}</TableCell>
                                    <TableCell>
                                        <Badge variant={booking.status === 'pending' ? 'warning' : booking.status === 'confirmed' ? 'info' : booking.status === 'completed' ? 'success' : 'danger'}>
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs">{new Date(booking.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Link href={route('admin.bookings.show', booking.id)}>
                                            <Button variant="ghost" size="sm">View</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Pagination links={bookings.links} />
        </AdminLayout>
    );
}
