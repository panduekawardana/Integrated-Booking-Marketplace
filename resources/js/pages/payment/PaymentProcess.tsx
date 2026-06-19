import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/Card';

declare global {
    interface Window {
        snap: {
            pay: (token: string, options: Record<string, unknown>) => void;
        };
    }
}

interface PaymentProcessProps {
    snapToken: string;
    booking: {
        booking_code: string;
        final_amount: number;
    };
}

export default function PaymentProcess({ snapToken, booking }: PaymentProcessProps) {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');
        script.async = true;

        script.onload = () => {
            window.snap.pay(snapToken, {
                onSuccess: (result: Record<string, unknown>) => {
                    router.get(route('customer.payment.finish'), {
                        order_id: result.order_id,
                    });
                },
                onPending: (result: Record<string, unknown>) => {
                    router.get(route('customer.payment.unfinish'), {
                        order_id: result.order_id,
                    });
                },
                onError: (result: Record<string, unknown>) => {
                    router.get(route('customer.payment.error'), {
                        order_id: result.order_id,
                    });
                },
                onClose: () => {
                    router.get(route('customer.payment.unfinish'), {
                        order_id: booking.booking_code,
                    });
                },
            });
        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [snapToken]);

    return (
        <AppLayout>
            <div className="max-w-md mx-auto text-center py-12">
                <Card>
                    <CardContent className="py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h2>
                        <p className="text-sm text-gray-500 mb-4">Booking: {booking.booking_code}</p>
                        <p className="text-2xl font-bold text-gray-900 mb-4">
                            Rp {Number(booking.final_amount).toLocaleString('id-ID')}
                        </p>
                        <p className="text-sm text-gray-400">Opening payment gateway...</p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
