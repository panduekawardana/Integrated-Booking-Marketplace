import { Link } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import Badge from '@/components/ui/Badge';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface MediaItem {
    id: number;
    url: string;
    is_primary: boolean;
}

interface BookableItem {
    id: number;
    name?: string;
    title?: string;
    description?: string;
    media?: MediaItem[];
}

interface BookingItem {
    id: number;
    bookable_type: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    date_from: string;
    date_to: string | null;
    bookable: BookableItem | null;
}

interface PaymentItem {
    id: number;
    payment_code: string;
    gross_amount: number;
    status: string;
    payment_method: string | null;
    paid_at: string | null;
}

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
        items: BookingItem[];
        payments: PaymentItem[];
        reviews: Array<{ id: number; rating: number }>;
    };
}

function getBookableName(item: BookingItem): string {
    if (item.bookable) {
        return item.bookable.name || item.bookable.title || 'Unknown';
    }
    return item.bookable_type.split('\\').pop() || 'Unknown';
}

function getPrimaryImage(item: BookingItem): string | null {
    const media = item.bookable?.media;
    if (!media || media.length === 0) return null;
    const primary = media.find((m) => m.is_primary);
    return primary?.url || media[0]?.url || null;
}

function getBookableRoute(item: BookingItem): string {
    const typeMap: Record<string, string> = {
        'App\\Models\\TravelPackage': 'services.travel-packages.show',
        'App\\Models\\MotorRental': 'services.motor-rentals.show',
        'App\\Models\\TourGuide': 'services.tour-guides.show',
        'App\\Models\\Homestay': 'services.homestays.show',
    };
    return typeMap[item.bookable_type] || '';
}

const statusStyles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
    confirmed: 'bg-blue-100 text-blue-800 ring-blue-600/20',
    completed: 'bg-green-100 text-green-800 ring-green-600/20',
    cancelled: 'bg-red-100 text-red-800 ring-red-600/20',
};

export default function BookingDetail({ booking }: BookingDetailProps) {
    const latestPayment = booking.payments?.[0];
    const isPending = booking.status === 'pending';

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto">
                <Link
                    href={route('customer.bookings.index')}
                    className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to My Bookings
                </Link>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{booking.booking_code}</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Booked on {new Date(booking.created_at).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                    <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${statusStyles[booking.status] || 'bg-gray-100 text-gray-800'}`}
                    >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                </div>

                <div className="space-y-4">
                    {booking.items.map((item) => {
                        const image = getPrimaryImage(item);
                        const routeName = getBookableRoute(item);

                        return (
                            <Card key={item.id}>
                                <CardContent className="p-4">
                                    <div className="flex gap-4">
                                        {image && (
                                            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                <img
                                                    src={image}
                                                    alt={getBookableName(item)}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {getBookableName(item)}
                                                    </h3>
                                                    {routeName && item.bookable?.id && (
                                                        <Link
                                                            href={route(routeName, item.bookable.id)}
                                                            className="text-xs text-blue-600 hover:text-blue-700"
                                                        >
                                                            View Service &rarr;
                                                        </Link>
                                                    )}
                                                </div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    Rp {Number(item.subtotal).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-500 space-y-0.5">
                                                <p>{item.quantity}x @ Rp {Number(item.unit_price).toLocaleString('id-ID')}</p>
                                                {item.date_from && (
                                                    <p>
                                                        {item.date_from}
                                                        {item.date_to && ` — ${item.date_to}`}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Card className="mt-4">
                    <CardContent className="p-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="text-gray-900">Rp {Number(booking.total_amount).toLocaleString('id-ID')}</span>
                            </div>
                            {Number(booking.discount_amount) > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Discount</span>
                                    <span className="text-green-600">-Rp {Number(booking.discount_amount).toLocaleString('id-ID')}</span>
                                </div>
                            )}
                            <div className="flex justify-between border-t pt-2 text-base font-bold">
                                <span>Total</span>
                                <span>Rp {Number(booking.final_amount).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {booking.notes && (
                    <Card className="mt-4">
                        <CardHeader>
                            <h3 className="text-sm font-medium text-gray-700">Notes</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600">{booking.notes}</p>
                        </CardContent>
                    </Card>
                )}

                {booking.cancellation_reason && (
                    <Card className="mt-4 border-red-200">
                        <CardHeader>
                            <h3 className="text-sm font-medium text-red-700">Cancellation Reason</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-red-600">{booking.cancellation_reason}</p>
                        </CardContent>
                    </Card>
                )}

                {latestPayment && (
                    <Card className="mt-4">
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
                                    <Badge
                                        variant={
                                            latestPayment.status === 'success'
                                                ? 'success'
                                                : latestPayment.status === 'pending'
                                                  ? 'warning'
                                                  : 'danger'
                                        }
                                    >
                                        {latestPayment.status}
                                    </Badge>
                                </div>
                                {latestPayment.payment_method && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Method</span>
                                        <span className="font-medium capitalize">
                                            {latestPayment.payment_method.replace('_', ' ')}
                                        </span>
                                    </div>
                                )}
                                {latestPayment.paid_at && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Paid At</span>
                                        <span className="font-medium">
                                            {new Date(latestPayment.paid_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="mt-6 flex gap-3">
                    {isPending && (
                        <Link href={route('customer.payment.process', booking.id)}>
                            <Button size="lg">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                    />
                                </svg>
                                Pay Now — Rp {Number(booking.final_amount).toLocaleString('id-ID')}
                            </Button>
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
