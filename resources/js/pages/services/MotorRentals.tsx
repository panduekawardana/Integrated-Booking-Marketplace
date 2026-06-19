import { router } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import ServiceCard from '@/components/shared/ServiceCard';
import Pagination from '@/components/ui/Pagination';
import { Input } from '@/components/ui';
import { useState } from 'react';

interface MotorRentalsProps {
    motors: {
        data: Array<Record<string, unknown>>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: Record<string, string>;
}

export default function MotorRentals({ motors, filters }: MotorRentalsProps) {
    const [searchBrand, setSearchBrand] = useState(filters.brand || '');

    return (
        <AppLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Motor Rentals</h1>

            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap gap-3">
                    <Input
                        placeholder="Search by brand..."
                        value={searchBrand}
                        onChange={(e) => setSearchBrand(e.target.value)}
                        className="max-w-xs"
                    />
                    <button
                        onClick={() => router.get(route('services.motor-rentals'), { brand: searchBrand }, { preserveState: true })}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {motors.data.map((motor) => (
                    <ServiceCard key={(motor as any).id} item={motor} type="motor_rental" routeName="services.motor-rentals.show" />
                ))}
            </div>

            {motors.data.length === 0 && (
                <p className="text-center text-gray-500 py-12">No motor rentals found.</p>
            )}

            <Pagination links={motors.links} />
        </AppLayout>
    );
}
