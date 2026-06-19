import { router } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import Pagination from '@/components/ui/Pagination';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui';

interface HomestaysProps {
    homestays: {
        data: Array<{
            id: number;
            name: string;
            city: string;
            rooms: Array<{ price_per_night: number }> | null;
            rooms_count: number;
            media?: Array<{ url: string }>;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: Record<string, string>;
}

export default function Homestays({ homestays, filters }: HomestaysProps) {
    const [searchCity, setSearchCity] = useState(filters.city || '');

    return (
        <AppLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Homestays</h1>

            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap gap-3">
                    <Input
                        placeholder="Search by city..."
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        className="max-w-xs"
                    />
                    <button
                        onClick={() => router.get(route('services.homestays'), { city: searchCity }, { preserveState: true })}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {homestays.data.map((homestay) => {
                    const imageUrl = homestay.media?.[0]?.url || '/images/placeholder.jpg';
                    const minPrice = homestay.rooms?.[0]?.price_per_night || 0;
                    return (
                        <Link key={homestay.id} href={route('services.homestays.show', homestay.id)} className="group">
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                                    <img src={imageUrl} alt={homestay.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900">{homestay.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{homestay.city}</p>
                                    <p className="text-sm text-gray-500">{homestay.rooms_count} room(s)</p>
                                    <p className="text-sm font-medium text-blue-600 mt-2">
                                        From Rp {Number(minPrice).toLocaleString('id-ID')} /night
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {homestays.data.length === 0 && (
                <p className="text-center text-gray-500 py-12">No homestays found.</p>
            )}

            <Pagination links={homestays.links} />
        </AppLayout>
    );
}
