import { useForm } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

interface TravelPackageDetailProps {
    service: {
        id: number;
        name: string;
        origin: string;
        destination: string;
        description: string;
        itinerary: Record<string, unknown> | null;
        price: number;
        max_pax: number;
        duration_days: number;
        includes: string | null;
        excludes: string | null;
        media?: Array<{ url: string; is_primary: boolean }>;
    };
    reviews: Array<{
        id: number;
        rating: number;
        review_text: string | null;
        user: { name: string } | null;
    }>;
}

export default function TravelPackageDetail({ service, reviews }: TravelPackageDetailProps) {
    const [pax, setPax] = useState(1);
    const images = service.media?.filter(m => m.url) || [];

    const { data, setData, post, processing, errors } = useForm({
        items: [{
            bookable_type: 'travel_package',
            bookable_id: service.id,
            quantity: 1,
            date_from: '',
            notes: '',
        }],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setData('items.0.quantity', pax);
        post(route('customer.bookings.store'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto">
                <Link href={route('services.travel-packages')} className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
                    &larr; Back to Travel Packages
                </Link>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div>
                            {images.length > 0 ? (
                                <img
                                    src={images[0].url}
                                    alt={service.name}
                                    className="w-full rounded-xl aspect-[4/3] object-cover"
                                />
                            ) : (
                                <div className="w-full rounded-xl aspect-[4/3] bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-400">No image</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h1>
                            <p className="text-gray-500 mb-4">{service.origin} &rarr; {service.destination}</p>
                            <p className="text-3xl font-bold text-blue-600 mb-4">
                                Rp {Number(service.price).toLocaleString('id-ID')}
                                <span className="text-sm text-gray-500 font-normal"> /person</span>
                            </p>

                            <div className="space-y-2 text-sm text-gray-600 mb-6">
                                <p>Duration: {service.duration_days} days</p>
                                <p>Max Pax: {service.max_pax} persons</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Persons</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPax(Math.max(1, pax - 1))}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <span className="text-lg font-semibold w-8 text-center">{pax}</span>
                                    <button
                                        type="button"
                                        onClick={() => setPax(Math.min(service.max_pax, pax + 1))}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="mt-2 text-sm font-medium text-gray-900">
                                    Total: Rp {(service.price * pax).toLocaleString('id-ID')}
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                                <input
                                    type="date"
                                    value={data.items[0].date_from}
                                    onChange={e => setData('items.0.date_from', e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors['items.0.date_from'] && (
                                    <p className="text-sm text-red-600 mt-1">{errors['items.0.date_from']}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={processing}>
                                {processing ? 'Booking...' : 'Book Now'}
                            </Button>
                        </div>
                    </div>
                </form>

                <Card className="mb-6">
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Description</h2>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 whitespace-pre-line">{service.description}</p>
                    </CardContent>
                </Card>

                {service.includes && (
                    <Card className="mb-6">
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Includes</h2>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 whitespace-pre-line">{service.includes}</p>
                        </CardContent>
                    </Card>
                )}

                {service.excludes && (
                    <Card className="mb-6">
                        <CardHeader>
                            <h2 className="text-lg font-semibold">Excludes</h2>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 whitespace-pre-line">{service.excludes}</p>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Reviews ({reviews.length})</h2>
                    </CardHeader>
                    <CardContent>
                        {reviews.length === 0 ? (
                            <p className="text-sm text-gray-500">No reviews yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-medium text-gray-900">
                                                {review.user?.name || 'Anonymous'}
                                            </span>
                                            <div className="flex items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg
                                                        key={star}
                                                        className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                        {review.review_text && (
                                            <p className="text-sm text-gray-600">{review.review_text}</p>
                                        )}
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
