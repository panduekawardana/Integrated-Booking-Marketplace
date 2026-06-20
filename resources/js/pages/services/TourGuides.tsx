import { router } from '@inertiajs/react';
import AppLayout from '@/components/layout/AppLayout';
import Pagination from '@/components/ui/Pagination';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui';

interface TourGuidesProps {
    guides: {
        data: Array<{
            id: number;
            name: string;
            bio: string | null;
            languages: string[] | null;
            specialties: string[] | null;
            price_per_day: number;
            max_pax: number;
            media?: Array<{ url: string }>;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: Record<string, string>;
}

export default function TourGuides({ guides, filters }: TourGuidesProps) {
    const [language, setLanguage] = useState(filters.language || '');

    return (
        <AppLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Tour Guides</h1>

            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap gap-3">
                    <Input
                        placeholder="Filter by language..."
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="max-w-xs"
                    />
                    <button
                        onClick={() => router.get(route('services.tour-guides'), { language }, { preserveState: true })}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                        Filter
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.data.map((guide) => {
                    const imageUrl = guide.media?.[0]?.url || '/images/placeholder.svg';
                    return (
                        <Link key={guide.id} href={route('services.tour-guides.show', guide.id)} className="group">
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                                    <img src={imageUrl} alt={guide.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900">{guide.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {guide.languages?.join(', ') || 'No languages listed'}
                                    </p>
                                    <p className="text-sm font-medium text-blue-600 mt-2">
                                        Rp {Number(guide.price_per_day).toLocaleString('id-ID')} /day
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {guides.data.length === 0 && (
                <p className="text-center text-gray-500 py-12">No tour guides found.</p>
            )}

            <Pagination links={guides.links} />
        </AppLayout>
    );
}
