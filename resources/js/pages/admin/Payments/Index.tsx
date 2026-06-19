import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Badge from '@/components/ui/Badge';
import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface PaymentsIndexProps {
    payments: {
        data: Array<{
            id: number;
            payment_code: string;
            gross_amount: number;
            status: string;
            payment_method: string | null;
            created_at: string;
            booking: {
                booking_code: string;
                user: { name: string };
            };
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: Record<string, string>;
}

export default function Index({ payments, filters }: PaymentsIndexProps) {
    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Payments</h1>

            <Card>
                <CardHeader>
                    <select
                        value={filters.status || ''}
                        onChange={(e) => router.get(route('admin.payments.index'), { status: e.target.value }, { preserveState: true })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                        <option value="expired">Expired</option>
                        <option value="refund">Refund</option>
                    </select>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>Payment Code</TableHeader>
                                <TableHeader>Booking</TableHeader>
                                <TableHeader>Customer</TableHeader>
                                <TableHeader>Amount</TableHeader>
                                <TableHeader>Method</TableHeader>
                                <TableHeader>Status</TableHeader>
                                <TableHeader>Date</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments.data.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell><span className="font-mono font-medium">{payment.payment_code}</span></TableCell>
                                    <TableCell>
                                        <Link href={route('admin.bookings.show', payment.booking)} className="text-blue-600 hover:text-blue-700">
                                            {payment.booking.booking_code}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{payment.booking.user.name}</TableCell>
                                    <TableCell>Rp {Number(payment.gross_amount).toLocaleString('id-ID')}</TableCell>
                                    <TableCell className="capitalize">{payment.payment_method?.replace('_', ' ') || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={payment.status === 'success' ? 'success' : payment.status === 'pending' ? 'warning' : 'danger'}>
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs">{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Pagination links={payments.links} />
        </AdminLayout>
    );
}
