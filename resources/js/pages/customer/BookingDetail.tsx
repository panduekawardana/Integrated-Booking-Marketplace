import { Link } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import Badge from '@/components/ui/Badge';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface BookingDetailProps {
    booking: {
        id: number;
        booking_code: string;
        status: string;
        total_amount: number;
        discount_amount: number;
        final_amount: number;
        notes: string | null;
        created_at: string;
        confirmed_at: string | null;
        completed_at: string | null;
        cancelled_at: string | null;
        cancellation_reason: string | null;
        items: Array<{
            id: number;
            bookable_type: string;
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
        reviews: Array<{ id: number; rating: number }>;
    };
}

export default function BookingDetail({ booking }: BookingDetailProps) {
    const statusVariant = booking.status === 'pending' ? 'warning' : booking.status === 'confirmed' ? 'info' : booking.status === 'completed' ? 'success' : 'danger';

    const latestPayment = booking.payments?.[0];

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto">
                <Link href={route('customer.bookings.index')} className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
                    &larr; Back to Bookings
                </Link>

                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{booking.booking_code}</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Booked on {new Date(booking.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <Badge variant={statusVariant}>{booking.status}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Booking Items</h3>
                                {booking.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {(item.bookable as any)?.name || item.bookable_type.split('\\').pop()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.quantity}x @ Rp {Number(item.unit_price).toLocaleString('id-ID')}
                                                {item.date_from && ` | ${item.date_from}`}
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Rp {Number(item.subtotal).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-1 pt-4 border-t">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span>Rp {Number(booking.total_amount).toLocaleString('id-ID')}</span>
                                </div>
                                {Number(booking.discount_amount) > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Discount</span>
                                        <span className="text-green-600">-Rp {Number(booking.discount_amount).toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base font-bold pt-2 border-t">
                                    <span>Total</span>
                                    <span>Rp {Number(booking.final_amount).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {booking.notes && (
                    <Card className="mb-6">
                        <CardHeader>
                            <h3 className="text-sm font-medium text-gray-700">Notes</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">{booking.notes}</p>
                        </CardContent>
                    </Card>
                )}

                {booking.cancellation_reason && (
                    <Card className="mb-6 border-red-200">
                        <CardHeader>
                            <h3 className="text-sm font-medium text-red-700">Cancellation Reason</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-red-600">{booking.cancellation_reason}</p>
                        </CardContent>
                    </Card>
                )}

                {latestPayment && (
                    <Card className="mb-6">
                        <CardHeader>
                            <h3 className="text-sm font-medium text-gray-700">Payment</h3>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Payment Code</span>
                                    <span className="font-medium">{latestPayment.payment_code}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Amount</span>
                                    <span className="font-medium">Rp {Number(latestPayment.gross_amount).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <Badge variant={latestPayment.status === 'success' ? 'success' : latestPayment.status === 'pending' ? 'warning' : 'danger'}>
                                        {latestPayment.status}
                                    </Badge>
                                </div>
                                {latestPayment.payment_method && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Method</span>
                                        <span className="font-medium capitalize">{latestPayment.payment_method.replace('_', ' ')}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="flex gap-3">
                    {booking.status === 'pending' && (
                        <Link href={route('customer.payment.process', booking.id)}>
                            <Button>Pay Now</Button>
                        </Link>
                    )}
                    {booking.status === 'completed' && booking.reviews.length === 0 && (
                        <Link href={route('customer.reviews.create', booking.id)}>
                            <Button variant="secondary">Write a Review</Button>
                        </Link>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
