import { Form } from '@inertiajs/react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Link } from '@inertiajs/react';

interface EditProps {
    homestay: {
        id: number;
        name: string;
        address: string;
        city: string;
        description: string | null;
        facilities: string[] | null;
        is_active: boolean;
        rooms: Array<{
            id: number;
            name: string;
            price_per_night: number;
            max_guests: number;
            total_rooms: number;
            is_active: boolean;
        }>;
    };
}

export default function Edit({ homestay }: EditProps) {
    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Homestay</h1>
            <div className="max-w-2xl">
                <Card>
                    <CardHeader><h2 className="text-lg font-semibold">Homestay Details</h2></CardHeader>
                    <CardContent>
                        <Form action={route('admin.homestays.update', homestay.id)} method="post" encType="multipart/form-data">
                            <input type="hidden" name="_method" value="PUT" />
                            {({ errors }) => (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input type="text" name="name" defaultValue={homestay.name} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                            <input type="text" name="address" defaultValue={homestay.address} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input type="text" name="city" defaultValue={homestay.city} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea name="description" rows={3} defaultValue={homestay.description || ''} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" name="is_active" value="1" defaultChecked={homestay.is_active} />
                                        <label className="text-sm text-gray-700">Active</label>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Link href={route('admin.homestays.rooms', homestay.id)}>
                                            <Button variant="secondary" type="button">Manage Rooms</Button>
                                        </Link>
                                        <Button type="submit">Update Homestay</Button>
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
