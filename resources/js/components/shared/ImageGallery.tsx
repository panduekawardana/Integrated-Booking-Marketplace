import { router } from '@inertiajs/react';
import { useState } from 'react';

interface MediaItem {
    id: number;
    url: string;
    path: string;
    is_primary: boolean;
    sort_order: number;
}

interface ImageGalleryProps {
    media: MediaItem[];
    onDelete?: (id: number) => void;
}

export default function ImageGallery({ media, onDelete }: ImageGalleryProps) {
    const [deleting, setDeleting] = useState<number | null>(null);

    const handleDelete = (item: MediaItem) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        setDeleting(item.id);

        router.delete(route('admin.media.destroy', item.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleting(null);
                onDelete?.(item.id);
            },
            onError: () => {
                setDeleting(null);
            },
        });
    };

    if (!media || media.length === 0) {
        return (
            <div className="text-sm text-gray-500 py-4 text-center border-2 border-dashed border-gray-200 rounded-lg">
                No images yet. Upload images below.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {media.map((item) => (
                <div key={item.id} className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                        src={item.url}
                        alt=""
                        className="w-full h-full object-cover"
                    />

                    {item.is_primary && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-semibold rounded">
                            Primary
                        </span>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={deleting === item.id}
                            className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                            title="Delete image"
                        >
                            {deleting === item.id ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
