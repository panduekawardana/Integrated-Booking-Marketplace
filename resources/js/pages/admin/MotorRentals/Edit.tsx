import { Form } from '@inertiajs/react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ImageGallery from '@/components/shared/ImageGallery';
import { useState } from 'react';

interface EditProps {
    motor: {
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
        is_active: boolean;
        media?: Array<{ id: number; url: string; path: string; is_primary: boolean; sort_order: number }>;
    };
}

export default function Edit({ motor }: EditProps) {
    const [images, setImages] = useState(motor.media || []);

    const handleImageDeleted = (id: number) => {
        setImages((prev) => prev.filter((img) => img.id !== id));
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Motor Rental</h1>
            <div className="max-w-2xl">
                <Card>
                    <CardHeader><h2 className="text-lg font-semibold">Motor Details</h2></CardHeader>
                    <CardContent>
                        <Form action={route('admin.motor-rentals.update', motor.id)} method="post" encType="multipart/form-data">
                            {({ errors }) => (
                                <div className="space-y-4">
                                    <input type="hidden" name="_method" value="PUT" />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input type="text" name="name" defaultValue={motor.name} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                            <input type="text" name="brand" defaultValue={motor.brand} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                            <input type="text" name="motor_type" defaultValue={motor.motor_type} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
                                            <input type="text" name="plate_number" defaultValue={motor.plate_number} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price/Day</label>
                                            <input type="number" name="price_per_day" step="0.01" defaultValue={motor.price_per_day} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Insurance</label>
                                            <input type="number" name="insurance_price" step="0.01" defaultValue={motor.insurance_price} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea name="description" rows={3} defaultValue={motor.description || ''} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">CC</label>
                                            <input type="number" name="cc" min="0" defaultValue={motor.cc ?? ''} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                                            <select name="transmission" defaultValue={motor.transmission ?? ''} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="">Select...</option>
                                                <option value="manual">Manual</option>
                                                <option value="matic">Matic</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Images</label>
                                        <ImageGallery media={images} onDelete={handleImageDeleted} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Add New Images</label>
                                        <input type="file" name="images[]" multiple accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" name="is_active" value="1" defaultChecked={motor.is_active} />
                                        <label className="text-sm text-gray-700">Active</label>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <Button type="submit">Update Motor</Button>
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
