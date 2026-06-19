import { Form } from '@inertiajs/react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

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
    };
}

export default function Edit({ motor }: EditProps) {
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
