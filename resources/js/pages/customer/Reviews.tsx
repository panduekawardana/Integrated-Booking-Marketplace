import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/shared/EmptyState';
import { Link } from '@inertiajs/react';

interface ReviewItem {
    id: number;
    rating: number;
    review_text: string | null;
    is_approved: boolean;
    created_at: string;
    booking: {
        booking_code: string;
    } | null;
}

interface ReviewsProps {
    reviews: {
        data: ReviewItem[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function Reviews({ reviews }: ReviewsProps) {
    return (
        <AppLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h1>

            {reviews.data.length === 0 ? (
                <EmptyState
                    title="No reviews yet"
                    description="You can review your completed bookings."
                />
            ) : (
                <div className="space-y-4">
                    {reviews.data.map((review) => (
                        <Card key={review.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900">
                                            {review.booking?.booking_code || 'Deleted Booking'}
                                        </span>
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                    <Badge variant={review.is_approved ? 'success' : 'warning'}>
                                        {review.is_approved ? 'Approved' : 'Pending'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            {review.review_text && (
                                <CardContent>
                                    <p className="text-sm text-gray-600">{review.review_text}</p>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            <Pagination links={reviews.links} />
        </AppLayout>
    );
}
