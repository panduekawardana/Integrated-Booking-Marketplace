import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Link } from '@inertiajs/react';

interface PaymentShowProps {
    payment: {
        id: number;
        payment_code: string;
        gross_amount: number;
        status: string;
        payment_method: string | null;
        midtrans_transaction_id: string | null;
        midtrans_redirect_url: string | null;
        paid_at: string | null;
        created_at: string;
        booking: {
            id: number;
            booking_code: string;
            final_amount: number;
            status: string;
            user: {
                id: number;
                name: string;
                email: string;
                phone: string | null;
            };
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
        };
    };
}

export default function Show({ payment }: PaymentShowProps) {
    return (
        <AdminLayout>
            <Link href={route('admin.payments.index')} className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
                &larr; Back to Payments
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">{payment.payment_code}</h1>
                                    <p className="text-sm text-gray-500">{new Date(payment.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <Badge variant={payment.status === 'success' ? 'success' : payment.status === 'pending' ? 'warning' : 'danger'}>
                                    {payment.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-gray-500">Gross Amount</span>
                                    <span className="font-medium">Rp {Number(payment.gross_amount).toLocaleString('id-ID')}</span>
                                </div>
                                {payment.payment_method && (
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-500">Payment Method</span>
                                        <span className="capitalize">{payment.payment_method.replace('_', ' ')}</span>
                                    </div>
                                )}
                                {payment.midtrans_transaction_id && (
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-500">Transaction ID</span>
                                        <span className="font-mono text-sm">{payment.midtrans_transaction_id}</span>
                                    </div>
                                )}
                                {payment.paid_at && (
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-500">Paid At</span>
                                        <span>{new Date(payment.paid_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h3 className="font-medium">Booking Items</h3>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {payment.booking.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
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
                            <div className="mt-4 pt-4 border-t flex justify-between font-bold">
                                <span>Total</span>
                                <span>Rp {Number(payment.booking.final_amount).toLocaleString('id-ID')}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader><h3 className="font-medium">Customer</h3></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p><span className="text-gray-500">Name:</span> {payment.booking.user.name}</p>
                            <p><span className="text-gray-500">Email:</span> {payment.booking.user.email}</p>
                            <p><span className="text-gray-500">Phone:</span> {payment.booking.user.phone || '-'}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><h3 className="font-medium">Booking</h3></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>
                                <Link href={route('admin.bookings.show', payment.booking.id)} className="text-blue-600 hover:text-blue-700">
                                    {payment.booking.booking_code}
                                </Link>
                            </p>
                            <p><span className="text-gray-500">Status:</span> <Badge variant={payment.booking.status === 'pending' ? 'warning' : payment.booking.status === 'confirmed' ? 'info' : payment.booking.status === 'completed' ? 'success' : 'danger'}>{payment.booking.status}</Badge></p>
                        </CardContent>
                    </Card>

                    {payment.midtrans_redirect_url && (
                        <Card>
                            <CardHeader><h3 className="font-medium">Midtrans</h3></CardHeader>
                            <CardContent>
                                <a
                                    href={payment.midtrans_redirect_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    View on Midtrans
                                </a>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
