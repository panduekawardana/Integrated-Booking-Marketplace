import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Link } from '@inertiajs/react';

interface MotorRentalDetailProps {
    service: {
        id: number;
        name: string;
        brand: string;
        motor_type: string;
        plate_number: string;
        description: string | null;
        price_per_day: number;
        insurance_price: number;
        cc: number | null;
        transmission: string | null;
        media?: Array<{ url: string; is_primary: boolean }>;
    };
    reviews: Array<{
        id: number;
        rating: number;
        review_text: string | null;
        user: { name: string } | null;
    }>;
}

export default function MotorRentalDetail({ service, reviews }: MotorRentalDetailProps) {
    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto">
                <Link href={route('services.motor-rentals')} className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
                    &larr; Back to Motor Rentals
                </Link>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div>
                        {service.media?.[0]?.url ? (
                            <img src={service.media[0].url} alt={service.name} className="w-full rounded-xl aspect-[4/3] object-cover" />
                        ) : (
                            <div className="w-full rounded-xl aspect-[4/3] bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400">No image</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h1>
                        <p className="text-gray-500 mb-2">{service.brand} - {service.motor_type}</p>
                        <p className="text-gray-500 mb-4">Plate: {service.plate_number}</p>
                        <p className="text-3xl font-bold text-blue-600 mb-4">
                            Rp {Number(service.price_per_day).toLocaleString('id-ID')}
                            <span className="text-sm text-gray-500 font-normal"> /day</span>
                        </p>
                        <div className="space-y-2 text-sm text-gray-600 mb-6">
                            <p>CC: {service.cc || 'N/A'}</p>
                            <p>Transmission: {service.transmission || 'N/A'}</p>
                            <p>Insurance: Rp {Number(service.insurance_price).toLocaleString('id-ID')}</p>
                        </div>
                        {service.description && (
                            <p className="text-gray-600 mb-6">{service.description}</p>
                        )}
                        <Button className="w-full" size="lg">Book Now</Button>
                    </div>
                </div>

                <Card>
                    <CardHeader><h2 className="text-lg font-semibold">Reviews ({reviews.length})</h2></CardHeader>
                    <CardContent>
                        {reviews.length === 0 ? (
                            <p className="text-sm text-gray-500">No reviews yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="border-b pb-4">
                                        <p className="font-medium text-sm">{review.user?.name || 'Anonymous'}</p>
                                        <div className="flex items-center my-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg key={star} className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        {review.review_text && <p className="text-sm text-gray-600">{review.review_text}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
