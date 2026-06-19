import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui';
import { useState } from 'react';

interface MotorRentalsIndexProps {
    motors: {
        data: Array<{
            id: number;
            name: string;
            brand: string;
            motor_type: string;
            plate_number: string;
            price_per_day: number;
            transmission: string | null;
            is_active: boolean;
            deleted_at: string | null;
            created_at: string;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: Record<string, string>;
}

export default function Index({ motors, filters }: MotorRentalsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get(route('admin.motor-rentals.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure?')) {
            router.delete(route('admin.motor-rentals.destroy', id));
        }
    };

    const handleRestore = (id: number) => {
        router.post(route('admin.motor-rentals.restore', id));
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Motor Rentals</h1>
                <Link href={route('admin.motor-rentals.create')}>
                    <Button>Add New Motor</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Input placeholder="Search motors..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="max-w-xs" />
                        <Button variant="secondary" onClick={handleSearch}>Search</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>Name</TableHeader>
                                <TableHeader>Brand / Type</TableHeader>
                                <TableHeader>Plate</TableHeader>
                                <TableHeader>Price/Day</TableHeader>
                                <TableHeader>Status</TableHeader>
                                <TableHeader>Actions</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {motors.data.map((motor) => (
                                <TableRow key={motor.id}>
                                    <TableCell><span className="font-medium">{motor.name}</span></TableCell>
                                    <TableCell>{motor.brand} - {motor.motor_type}</TableCell>
                                    <TableCell>{motor.plate_number}</TableCell>
                                    <TableCell>Rp {Number(motor.price_per_day).toLocaleString('id-ID')}</TableCell>
                                    <TableCell>
                                        {motor.deleted_at ? (
                                            <span className="text-red-600 text-xs font-medium">Deleted</span>
                                        ) : (
                                            <span className="text-green-600 text-xs font-medium">{motor.is_active ? 'Active' : 'Inactive'}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link href={route('admin.motor-rentals.edit', motor.id)}>
                                                <Button variant="ghost" size="sm">Edit</Button>
                                            </Link>
                                            {motor.deleted_at ? (
                                                <Button variant="ghost" size="sm" onClick={() => handleRestore(motor.id)}>Restore</Button>
                                            ) : (
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(motor.id)}>Delete</Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Pagination links={motors.links} />
        </AdminLayout>
    );
}
