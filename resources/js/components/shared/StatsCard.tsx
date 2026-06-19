import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: string;
    className?: string;
}

export default function StatsCard({ title, value, icon, className }: StatsCardProps) {
    return (
        <div className={cn('bg-white rounded-xl border border-gray-200 p-6 shadow-sm', className)}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                {icon && (
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}
