import { Form } from '@inertiajs/react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface EditProps {
    package: {
        id: number;
        name: string;
        origin: string;
        destination: string;
        price: number;
        max_pax: number;
        duration_days: number;
        description: string;
        includes: string | null;
        excludes: string | null;
        is_active: boolean;
        media?: Array<{ id: number; url: string; is_primary: boolean }>;
    };
}

export default function Edit({ package: pkg }: EditProps) {
    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Travel Package</h1>

            <div className="max-w-2xl">
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Package Details</h2>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={route('admin.travel-packages.update', pkg.id)}
                            method="post"
                            encType="multipart/form-data"
                        >
                            {({ errors }) => (
                                <div className="space-y-4">
                                    <input type="hidden" name="_method" value="PUT" />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input type="text" name="name" defaultValue={pkg.name} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                                            <input type="text" name="origin" defaultValue={pkg.origin} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                                            <input type="text" name="destination" defaultValue={pkg.destination} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rp)</label>
                                            <input type="number" name="price" step="0.01" min="0" defaultValue={pkg.price} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Pax</label>
                                            <input type="number" name="max_pax" min="1" defaultValue={pkg.max_pax} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                                            <input type="number" name="duration_days" min="1" defaultValue={pkg.duration_days} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea name="description" rows={4} defaultValue={pkg.description} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Includes</label>
                                        <textarea name="includes" rows={3} defaultValue={pkg.includes || ''} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Excludes</label>
                                        <textarea name="excludes" rows={3} defaultValue={pkg.excludes || ''} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Images</label>
                                        <input type="file" name="images[]" multiple accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" name="is_active" value="1" defaultChecked={pkg.is_active} />
                                        <label className="text-sm text-gray-700">Active</label>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button type="submit">Update Package</Button>
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
