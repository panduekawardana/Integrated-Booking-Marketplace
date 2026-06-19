import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui';
import { useState } from 'react';

interface TravelPackagesIndexProps {
    packages: {
        data: Array<{
            id: number;
            name: string;
            slug: string;
            origin: string;
            destination: string;
            price: number;
            max_pax: number;
            duration_days: number;
            is_active: boolean;
            deleted_at: string | null;
            created_at: string;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: Record<string, string>;
}

export default function Index({ packages, filters }: TravelPackagesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get(route('admin.travel-packages.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this travel package?')) {
            router.delete(route('admin.travel-packages.destroy', id));
        }
    };

    const handleRestore = (id: number) => {
        router.post(route('admin.travel-packages.restore', id));
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Travel Packages</h1>
                <Link href={route('admin.travel-packages.create')}>
                    <Button>Add New Package</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Input
                            placeholder="Search packages..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="max-w-xs"
                        />
                        <Button variant="secondary" onClick={handleSearch}>Search</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>Name</TableHeader>
                                <TableHeader>Route</TableHeader>
                                <TableHeader>Price</TableHeader>
                                <TableHeader>Duration</TableHeader>
                                <TableHeader>Status</TableHeader>
                                <TableHeader>Actions</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {packages.data.map((pkg) => (
                                <TableRow key={pkg.id}>
                                    <TableCell>
                                        <span className="font-medium">{pkg.name}</span>
                                    </TableCell>
                                    <TableCell>{pkg.origin} → {pkg.destination}</TableCell>
                                    <TableCell>Rp {Number(pkg.price).toLocaleString('id-ID')}</TableCell>
                                    <TableCell>{pkg.duration_days} days</TableCell>
                                    <TableCell>
                                        {pkg.deleted_at ? (
                                            <span className="text-red-600 text-xs font-medium">Deleted</span>
                                        ) : (
                                            <span className="text-green-600 text-xs font-medium">{pkg.is_active ? 'Active' : 'Inactive'}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Link href={route('admin.travel-packages.edit', pkg.id)}>
                                                <Button variant="ghost" size="sm">Edit</Button>
                                            </Link>
                                            {pkg.deleted_at ? (
                                                <Button variant="ghost" size="sm" onClick={() => handleRestore(pkg.id)}>Restore</Button>
                                            ) : (
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(pkg.id)}>Delete</Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {packages.data.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No travel packages found.</p>
                    )}
                </CardContent>
            </Card>
            <Pagination links={packages.links} />
        </AdminLayout>
    );
}
