import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export default function Pagination({ links }: PaginationProps) {
    if (!links || links.length <= 3) return null;

    return (
        <nav className="flex items-center justify-center gap-1 mt-6">
            {links.map((link, i) => {
                if (link.url === null) {
                    return (
                        <span
                            key={i}
                            className={cn(
                                'px-3 py-2 text-sm rounded-lg',
                                'text-gray-400 cursor-not-allowed'
                            )}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={i}
                        href={link.url}
                        className={cn(
                            'px-3 py-2 text-sm rounded-lg transition-colors',
                            link.active
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </nav>
    );
}
