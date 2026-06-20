import { useEffect, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

declare global {
    interface Window {
        snap: {
            pay: (token: string, options: Record<string, unknown>) => void;
        };
    }
}

interface PaymentProcessProps {
    snapToken: string;
    paymentCode: string;
    booking: {
        id: number;
        booking_code: string;
        final_amount: number;
    };
}

export default function PaymentProcess({ snapToken, paymentCode, booking }: PaymentProcessProps) {
    const [scriptError, setScriptError] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        const existingScript = document.querySelector(
            `script[src="https://app.sandbox.midtrans.com/snap/snap.js"]`,
        );
        if (existingScript) {
            existingScript.remove();
        }

        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');
        script.async = true;

        script.onload = () => {
            setScriptLoaded(true);
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
                        order_id: paymentCode,
                    });
                },
            });
        };

        script.onerror = () => {
            setScriptError(true);
        };

        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [snapToken, paymentCode]);

    if (scriptError) {
        return (
            <AppLayout>
                <div className="max-w-md mx-auto text-center py-12">
                    <Card>
                        <CardContent className="py-8">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Gagal Memuat Pembayaran</h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Gateway pembayaran tidak dapat dimuat. Coba gunakan browser lain atau nonaktifkan adblocker.
                            </p>
                            <Link href={route('customer.bookings.show', booking.id)}>
                                <Button>Kembali ke Booking</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="max-w-md mx-auto text-center py-12">
                <Link
                    href={route('customer.bookings.show', booking.id)}
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali ke Booking
                </Link>

                <Card>
                    <CardContent className="py-8">
                        {scriptLoaded ? (
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                        ) : (
                            <div className="relative mx-auto mb-4 h-12 w-12">
                                <div className="animate-ping rounded-full h-12 w-12 bg-blue-200 mx-auto" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                            </div>
                        )}
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            {scriptLoaded ? 'Memproses Pembayaran' : 'Menyiapkan Pembayaran'}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">Booking: {booking.booking_code}</p>
                        <p className="text-2xl font-bold text-gray-900 mb-4">
                            Rp {Number(booking.final_amount).toLocaleString('id-ID')}
                        </p>
                        <p className="text-sm text-gray-400">
                            {scriptLoaded ? 'Membuka gateway pembayaran...' : 'Mohon tunggu sebentar...'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
