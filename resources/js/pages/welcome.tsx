import { Head, Link } from '@inertiajs/react';
import ServiceCard from '@/components/shared/ServiceCard';
import type { TravelPackage, MotorRental, TourGuide, Homestay } from '@/types/service';

interface WelcomeProps {
    canLogin: boolean;
    canRegister: boolean;
    laravelVersion: string;
    phpVersion: string;
    travelPackages: TravelPackage[];
    motorRentals: MotorRental[];
    tourGuides: TourGuide[];
    homestays: Homestay[];
}

export default function Welcome({ canLogin, canRegister, travelPackages, motorRentals, tourGuides, homestays }: WelcomeProps) {
    return (
        <>
            <Head title="Home - Booking Travel" />

            <div className="min-h-screen bg-white">
                <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Booking Travel
                            </Link>
                            <nav className="flex items-center gap-3">
                                {canLogin ? (
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        Log in
                                    </Link>
                                ) : null}
                                {canRegister ? (
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
                                    >
                                        Register
                                    </Link>
                                ) : null}
                            </nav>
                        </div>
                    </div>
                </header>

                <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
                    <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 -translate-y-1/3 -translate-x-1/4 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-3xl" />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
                                Your Adventure Awaits
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                                Discover Your Next
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Great Adventure</span>
                            </h1>
                            <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
                                Explore curated travel packages, premium motor rentals, expert tour guides, and authentic homestays across Indonesia.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href={canLogin ? route('login') : route('register')}
                                    className="inline-flex items-center px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/25"
                                >
                                    Get Started
                                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                <Link
                                    href={route('services.travel-packages')}
                                    className="inline-flex items-center px-8 py-3.5 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                                >
                                    Explore Services
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="relative py-16 bg-gradient-to-r from-blue-600 to-indigo-600 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl sm:text-4xl font-bold text-white">500+</div>
                                <div className="mt-1.5 text-blue-200 text-sm font-medium">Destinations</div>
                            </div>
                            <div>
                                <div className="text-3xl sm:text-4xl font-bold text-white">10K+</div>
                                <div className="mt-1.5 text-blue-200 text-sm font-medium">Happy Travelers</div>
                            </div>
                            <div>
                                <div className="text-3xl sm:text-4xl font-bold text-white">200+</div>
                                <div className="mt-1.5 text-blue-200 text-sm font-medium">Tour Guides</div>
                            </div>
                            <div>
                                <div className="text-3xl sm:text-4xl font-bold text-white">1K+</div>
                                <div className="mt-1.5 text-blue-200 text-sm font-medium">Homestays</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 sm:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How It Works</h2>
                            <p className="mt-4 text-gray-500 max-w-xl mx-auto">
                                Plan your perfect trip in three simple steps.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[
                                { step: '01', title: 'Browse Services', desc: 'Explore our curated selection of travel packages, motor rentals, tour guides, and homestays.' },
                                { step: '02', title: 'Book & Pay', desc: 'Securely book your chosen service and complete payment with ease.' },
                                { step: '03', title: 'Enjoy Your Trip', desc: 'Sit back, relax, and enjoy a seamless travel experience.' },
                            ].map((item) => (
                                <div key={item.step} className="relative text-center">
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20">
                                        {item.step}
                                    </div>
                                    <h3 className="mt-6 text-lg font-semibold text-gray-900">{item.title}</h3>
                                    <p className="mt-2 text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {travelPackages.length > 0 && (
                    <section className="bg-gray-50 py-16 sm:py-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-end justify-between mb-10">
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Travel Packages</h2>
                                    <p className="mt-2 text-gray-500">Curated journeys to the best destinations.</p>
                                </div>
                                <Link href={route('services.travel-packages')} className="hidden sm:inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                                    View all
                                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {travelPackages.map((pkg) => (
                                    <ServiceCard
                                        key={pkg.id}
                                        item={pkg}
                                        type="travel_package"
                                        routeName="services.travel-packages.show"
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {motorRentals.length > 0 && (
                    <section className="py-16 sm:py-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-end justify-between mb-10">
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Motor Rentals</h2>
                                    <p className="mt-2 text-gray-500">Premium motorcycles for your journey.</p>
                                </div>
                                <Link href={route('services.motor-rentals')} className="hidden sm:inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                                    View all
                                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {motorRentals.map((motor) => (
                                    <ServiceCard
                                        key={motor.id}
                                        item={motor}
                                        type="motor_rental"
                                        routeName="services.motor-rentals.show"
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {tourGuides.length > 0 && (
                    <section className="bg-gray-50 py-16 sm:py-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-end justify-between mb-10">
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tour Guides</h2>
                                    <p className="mt-2 text-gray-500">Expert local guides for unforgettable experiences.</p>
                                </div>
                                <Link href={route('services.tour-guides')} className="hidden sm:inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                                    View all
                                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tourGuides.map((guide) => (
                                    <ServiceCard
                                        key={guide.id}
                                        item={guide}
                                        type="tour_guide"
                                        routeName="services.tour-guides.show"
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {homestays.length > 0 && (
                    <section className="py-16 sm:py-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-end justify-between mb-10">
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Homestays</h2>
                                    <p className="mt-2 text-gray-500">Cozy and authentic stays across Indonesia.</p>
                                </div>
                                <Link href={route('services.homestays')} className="hidden sm:inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                                    View all
                                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {homestays.map((homestay) => (
                                    <ServiceCard
                                        key={homestay.id}
                                        item={homestay}
                                        type="homestay"
                                        routeName="services.homestays.show"
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <section className="relative py-20 bg-gradient-to-r from-blue-600 to-indigo-600 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to Start Your Journey?</h2>
                        <p className="mt-4 text-blue-200 max-w-xl mx-auto">
                            Join thousands of travelers who have discovered amazing experiences with Booking Travel.
                        </p>
                        <div className="mt-10">
                            <Link
                                href={canRegister ? route('register') : route('login')}
                                className="inline-flex items-center px-8 py-3.5 text-base font-semibold text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-lg"
                            >
                                Create Your Account
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>

                <footer className="bg-gray-900 pt-16 pb-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-gray-800">
                            <div className="col-span-2 md:col-span-1">
                                <Link href="/" className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                    Booking Travel
                                </Link>
                                <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                                    Your trusted platform for discovering and booking amazing travel experiences across Indonesia.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Services</h4>
                                <ul className="mt-4 space-y-3">
                                    <li><Link href={route('services.travel-packages')} className="text-sm text-gray-400 hover:text-white transition-colors">Travel Packages</Link></li>
                                    <li><Link href={route('services.motor-rentals')} className="text-sm text-gray-400 hover:text-white transition-colors">Motor Rentals</Link></li>
                                    <li><Link href={route('services.tour-guides')} className="text-sm text-gray-400 hover:text-white transition-colors">Tour Guides</Link></li>
                                    <li><Link href={route('services.homestays')} className="text-sm text-gray-400 hover:text-white transition-colors">Homestays</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h4>
                                <ul className="mt-4 space-y-3">
                                    <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">About</Link></li>
                                    <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                                    <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                                    <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Support</h4>
                                <ul className="mt-4 space-y-3">
                                    <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                                    <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                                    <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                                    <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="pt-8 text-center">
                            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Booking Travel. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
