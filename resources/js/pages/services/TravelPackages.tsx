import AppLayout from '@/components/layout/AppLayout';
import ServiceCard from '@/components/shared/ServiceCard';
import Pagination from '@/components/ui/Pagination';
import { Input } from '@/components/ui';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface TravelPackagesProps {
    packages: {
        data: Array<Record<string, unknown>>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: Record<string, string>;
}

export default function TravelPackages({ packages, filters }: TravelPackagesProps) {
    const [searchOrigin, setSearchOrigin] = useState(filters.origin || '');
    const [searchDest, setSearchDest] = useState(filters.destination || '');

    const handleFilter = () => {
        router.get(route('services.travel-packages'), {
            origin: searchOrigin,
            destination: searchDest,
        }, { preserveState: true });
    };

    return (
        <AppLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Travel Packages</h1>

            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap gap-3">
                    <Input
                        placeholder="From (origin)..."
                        value={searchOrigin}
                        onChange={(e) => setSearchOrigin(e.target.value)}
                        className="max-w-xs"
                    />
                    <Input
                        placeholder="To (destination)..."
                        value={searchDest}
                        onChange={(e) => setSearchDest(e.target.value)}
                        className="max-w-xs"
                    />
                    <button onClick={handleFilter} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        Search
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.data.map((pkg) => (
                    <ServiceCard
                        key={(pkg as any).id}
                        item={pkg}
                        type="travel_package"
                        routeName="services.travel-packages.show"
                    />
                ))}
            </div>

            {packages.data.length === 0 && (
                <p className="text-center text-gray-500 py-12">No travel packages found.</p>
            )}

            <Pagination links={packages.links} />
        </AppLayout>
    );
}
