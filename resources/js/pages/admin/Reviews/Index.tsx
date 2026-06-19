import { router } from '@inertiajs/react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface ReviewsIndexProps {
    reviews: {
        data: Array<{
            id: number;
            rating: number;
            review_text: string | null;
            is_approved: boolean;
            created_at: string;
            user: { name: string } | null;
            booking: { booking_code: string } | null;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: Record<string, string>;
}

export default function Index({ reviews, filters }: ReviewsIndexProps) {
    const handleApprove = (id: number) => {
        router.post(route('admin.reviews.approve', id));
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this review?')) {
            router.delete(route('admin.reviews.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h1>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>User</TableHeader>
                                <TableHeader>Booking</TableHeader>
                                <TableHeader>Rating</TableHeader>
                                <TableHeader>Review</TableHeader>
                                <TableHeader>Status</TableHeader>
                                <TableHeader>Actions</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reviews.data.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell>{review.user?.name || 'Deleted User'}</TableCell>
                                    <TableCell className="font-mono text-xs">{review.booking?.booking_code || '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">{review.review_text || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={review.is_approved ? 'success' : 'warning'}>
                                            {review.is_approved ? 'Approved' : 'Pending'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {!review.is_approved && (
                                                <Button variant="ghost" size="sm" onClick={() => handleApprove(review.id)}>Approve</Button>
                                            )}
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(review.id)}>Delete</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Pagination links={reviews.links} />
        </AdminLayout>
    );
}
