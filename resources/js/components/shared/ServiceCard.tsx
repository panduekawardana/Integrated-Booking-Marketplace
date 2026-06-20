import { Link } from '@inertiajs/react';
import type { TravelPackage, MotorRental, TourGuide, Homestay } from '@/types/service';

type ServiceItem = TravelPackage | MotorRental | TourGuide | Homestay;

interface ServiceCardProps {
    item: ServiceItem;
    type: 'travel_package' | 'motor_rental' | 'tour_guide' | 'homestay';
    routeName: string;
}

export default function ServiceCard({ item, type, routeName }: ServiceCardProps) {
    const imageUrl = (item as any).media?.[0]?.url || '/images/placeholder.svg';

    const getPriceLabel = () => {
        switch (type) {
            case 'travel_package':
                return `Rp ${Number((item as TravelPackage).price).toLocaleString('id-ID')} /person`;
            case 'motor_rental':
                return `Rp ${Number((item as MotorRental).price_per_day).toLocaleString('id-ID')} /day`;
            case 'tour_guide':
                return `Rp ${Number((item as TourGuide).price_per_day).toLocaleString('id-ID')} /day`;
            case 'homestay':
                return 'Start from Rp ' + Number((item as Homestay).rooms?.[0]?.price_per_night || 0).toLocaleString('id-ID') + ' /night';
            default:
                return '';
        }
    };

    const getLocation = () => {
        switch (type) {
            case 'travel_package':
                return `${(item as TravelPackage).origin} → ${(item as TravelPackage).destination}`;
            case 'homestay':
                return (item as Homestay).city;
            case 'motor_rental':
                return `${(item as MotorRental).brand} - ${(item as MotorRental).motor_type}`;
            default:
                return null;
        }
    };

    return (
        <Link href={route(routeName, item.id)} className="group">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    {getLocation() && (
                        <p className="text-sm text-gray-500 mt-1">{getLocation()}</p>
                    )}
                    <p className="text-sm font-medium text-blue-600 mt-2">{getPriceLabel()}</p>
                </div>
            </div>
        </Link>
    );
}
