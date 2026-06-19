import { Form } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useState } from 'react';

interface ReviewFormProps {
    booking: {
        id: number;
        booking_code: string;
        total_amount: number;
        items: Array<{
            id: number;
            bookable: Record<string, unknown> | null;
        }>;
    };
}

export default function ReviewForm({ booking }: ReviewFormProps) {
    const [rating, setRating] = useState(5);

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Review Booking {booking.booking_code}
                </h1>

                <Card>
                    <CardHeader>
                        <h2 className="text-sm font-medium text-gray-700">Your Rating & Review</h2>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={route('customer.reviews.store', booking.id)}
                            method="post"
                        >
                            {({ errors }) => (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rating
                                        </label>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className="focus:outline-none"
                                                >
                                                    <svg
                                                        className={`w-8 h-8 cursor-pointer transition-colors ${
                                                            star <= rating ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-200'
                                                        }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                        <input type="hidden" name="rating" value={rating} />
                                        {errors.rating && (
                                            <p className="text-sm text-red-600 mt-1">{errors.rating}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="review_text" className="block text-sm font-medium text-gray-700 mb-2">
                                            Review (Optional)
                                        </label>
                                        <textarea
                                            id="review_text"
                                            name="review_text"
                                            rows={4}
                                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Share your experience..."
                                        />
                                        {errors.review_text && (
                                            <p className="text-sm text-red-600 mt-1">{errors.review_text}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <Button type="submit">Submit Review</Button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
