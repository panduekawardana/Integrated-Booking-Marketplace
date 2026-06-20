import { useForm } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Link } from '@inertiajs/react';

interface HomestayDetailProps {
    service: {
        id: number;
        name: string;
        description: string | null;
        address: string;
        city: string;
        facilities: string[] | null;
        rules: string | null;
        check_in_time: string;
        check_out_time: string;
        media?: Array<{ url: string; is_primary: boolean }>;
        rooms?: Array<{
            id: number;
            name: string;
            description: string | null;
            price_per_night: number;
            max_guests: number;
            total_rooms: number;
            facilities: string[] | null;
        }>;
    };
    reviews: Array<{
        id: number;
        rating: number;
        review_text: string | null;
        user: { name: string } | null;
    }>;
}

export default function HomestayDetail({ service, reviews }: HomestayDetailProps) {
    const { data, setData, post, processing, errors } = useForm({
        items: [{
            bookable_type: 'homestay',
            bookable_id: service.id,
            quantity: 1,
            date_from: '',
            date_to: '',
            notes: '',
        }],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('customer.bookings.store'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto">
                <Link href={route('services.homestays')} className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
                    &larr; Back to Homestays
                </Link>

                <form onSubmit={handleSubmit}>
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
                            <p className="text-gray-500 mb-1">{service.address}</p>
                            <p className="text-gray-500 mb-4">{service.city}</p>
                            <div className="text-sm text-gray-600 mb-4">
                                <p>Check-in: {service.check_in_time} | Check-out: {service.check_out_time}</p>
                            </div>
                            {service.facilities && service.facilities.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Facilities:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {service.facilities.map((fac) => (
                                            <span key={fac} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{fac}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {service.description && <p className="text-gray-600 mb-6">{service.description}</p>}

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                                    <input
                                        type="date"
                                        value={data.items[0].date_to}
                                        onChange={e => setData('items.0.date_to', e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors['items.0.date_to'] && (
                                        <p className="text-sm text-red-600 mt-1">{errors['items.0.date_to']}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    value={data.items[0].notes}
                                    onChange={e => setData('items.0.notes', e.target.value)}
                                    rows={2}
                                    placeholder="Any special requests..."
                                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={processing}>
                                {processing ? 'Booking...' : 'Book Now'}
                            </Button>
                        </div>
                    </div>
                </form>

                {service.rooms && service.rooms.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Available Rooms</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {service.rooms.map((room) => (
                                <Card key={room.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold">{room.name}</h3>
                                            <p className="text-lg font-bold text-blue-600">Rp {Number(room.price_per_night).toLocaleString('id-ID')}<span className="text-sm font-normal text-gray-500">/night</span></p>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>Max Guests: {room.max_guests}</p>
                                            <p>Available: {room.total_rooms} room(s)</p>
                                        </div>
                                        {room.facilities && room.facilities.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {room.facilities.map((fac) => (
                                                    <span key={fac} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">{fac}</span>
                                                ))}
                                            </div>
                                        )}
                                        {room.description && <p className="text-sm text-gray-500 mt-2">{room.description}</p>}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {service.rules && (
                    <Card className="mb-6">
                        <CardHeader><h2 className="text-lg font-semibold">House Rules</h2></CardHeader>
                        <CardContent><p className="text-sm text-gray-600 whitespace-pre-line">{service.rules}</p></CardContent>
                    </Card>
                )}

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
