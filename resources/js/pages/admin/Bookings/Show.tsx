import { router } from '@inertiajs/react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

interface BookingShowProps {
    booking: {
        id: number;
        booking_code: string;
        status: string;
        total_amount: number;
        discount_amount: number;
        final_amount: number;
        notes: string | null;
        admin_notes: string | null;
        cancellation_reason: string | null;
        created_at: string;
        confirmed_at: string | null;
        completed_at: string | null;
        cancelled_at: string | null;
        user: {
            id: number;
            name: string;
            email: string;
            phone: string | null;
        };
        items: Array<{
            id: number;
            bookable_type: string;
            bookable_id: number;
            quantity: number;
            unit_price: number;
            subtotal: number;
            date_from: string;
            date_to: string | null;
            bookable: Record<string, unknown> | null;
        }>;
        payments: Array<{
            id: number;
            payment_code: string;
            gross_amount: number;
            status: string;
            payment_method: string | null;
            paid_at: string | null;
        }>;
        reviews: Array<Record<string, unknown>>;
    };
}

export default function Show({ booking }: BookingShowProps) {
    const [cancelReason, setCancelReason] = useState('');

    const handleConfirm = () => {
        if (confirm('Confirm this booking?')) {
            router.post(route('admin.bookings.confirm', booking.id));
        }
    };

    const handleComplete = () => {
        if (confirm('Mark this booking as completed?')) {
            router.post(route('admin.bookings.complete', booking.id));
        }
    };

    const handleCancel = () => {
        const reason = prompt('Cancellation reason:');
        if (reason !== null) {
            router.post(route('admin.bookings.cancel', booking.id), {
                cancellation_reason: reason,
            });
        }
    };

    return (
        <AdminLayout>
            <Link href={route('admin.bookings.index')} className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
                &larr; Back to Bookings
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">{booking.booking_code}</h1>
                                    <p className="text-sm text-gray-500">{new Date(booking.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <Badge variant={booking.status === 'pending' ? 'warning' : booking.status === 'confirmed' ? 'info' : booking.status === 'completed' ? 'success' : 'danger'}>
                                    {booking.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {booking.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {(item.bookable as any)?.name || item.bookable_type.split('\\').pop()}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {item.quantity}x @ Rp {Number(item.unit_price).toLocaleString('id-ID')} | {item.date_from}{item.date_to ? ` - ${item.date_to}` : ''}
                                            </p>
                                        </div>
                                        <p className="font-medium">Rp {Number(item.subtotal).toLocaleString('id-ID')}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span>Rp {Number(booking.total_amount).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold">
                                    <span>Total</span>
                                    <span>Rp {Number(booking.final_amount).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {booking.notes && (
                        <Card>
                            <CardHeader><h3 className="font-medium">Customer Notes</h3></CardHeader>
                            <CardContent><p className="text-sm text-gray-600">{booking.notes}</p></CardContent>
                        </Card>
                    )}

                    {booking.cancellation_reason && (
                        <Card>
                            <CardHeader><h3 className="font-medium text-red-700">Cancellation Reason</h3></CardHeader>
                            <CardContent><p className="text-sm text-red-600">{booking.cancellation_reason}</p></CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader><h3 className="font-medium">Actions</h3></CardHeader>
                        <CardContent className="space-y-3">
                            {booking.status === 'pending' && (
                                <Button onClick={handleConfirm} className="w-full">Confirm Booking</Button>
                            )}
                            {booking.status === 'confirmed' && (
                                <Button onClick={handleComplete} className="w-full">Mark Completed</Button>
                            )}
                            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                <Button variant="danger" onClick={handleCancel} className="w-full">Cancel Booking</Button>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><h3 className="font-medium">Customer</h3></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p><span className="text-gray-500">Name:</span> {booking.user.name}</p>
                            <p><span className="text-gray-500">Email:</span> {booking.user.email}</p>
                            <p><span className="text-gray-500">Phone:</span> {booking.user.phone || '-'}</p>
                        </CardContent>
                    </Card>

                    {booking.payments.length > 0 && (
                        <Card>
                            <CardHeader><h3 className="font-medium">Payment</h3></CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                {booking.payments.map((payment) => (
                                    <div key={payment.id} className="border-b pb-2 last:border-0">
                                        <p><span className="text-gray-500">Code:</span> {payment.payment_code}</p>
                                        <p><span className="text-gray-500">Amount:</span> Rp {Number(payment.gross_amount).toLocaleString('id-ID')}</p>
                                        <p><span className="text-gray-500">Status:</span> <Badge variant={payment.status === 'success' ? 'success' : payment.status === 'pending' ? 'warning' : 'danger'}>{payment.status}</Badge></p>
                                        {payment.payment_method && <p><span className="text-gray-500">Method:</span> {payment.payment_method}</p>}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
