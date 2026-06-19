import { Form } from '@inertiajs/react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface EditProps {
    guide: {
        id: number;
        name: string;
        bio: string | null;
        price_per_day: number;
        max_pax: number;
        phone: string | null;
        is_active: boolean;
    };
}

export default function Edit({ guide }: EditProps) {
    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Tour Guide</h1>
            <div className="max-w-2xl">
                <Card>
                    <CardHeader><h2 className="text-lg font-semibold">Guide Details</h2></CardHeader>
                    <CardContent>
                        <Form action={route('admin.tour-guides.update', guide.id)} method="post" encType="multipart/form-data">
                            <input type="hidden" name="_method" value="PUT" />
                            {({ errors }) => (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input type="text" name="name" defaultValue={guide.name} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price/Day (Rp)</label>
                                            <input type="number" name="price_per_day" step="0.01" defaultValue={guide.price_per_day} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Pax</label>
                                            <input type="number" name="max_pax" min="1" defaultValue={guide.max_pax} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input type="text" name="phone" defaultValue={guide.phone || ''} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                        <textarea name="bio" rows={3} defaultValue={guide.bio || ''} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" name="is_active" value="1" defaultChecked={guide.is_active} />
                                        <label className="text-sm text-gray-700">Active</label>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button type="submit">Update Guide</Button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
