import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui';
import { useState } from 'react';

interface HomestaysIndexProps {
    homestays: {
        data: Array<{
            id: number;
            name: string;
            city: string;
            rooms_count: number;
            is_active: boolean;
            deleted_at: string | null;
            created_at: string;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: Record<string, string>;
}

export default function Index({ homestays, filters }: HomestaysIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Homestays</h1>
                <Link href={route('admin.homestays.create')}>
                    <Button>Add New Homestay</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Input placeholder="Search homestays..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && router.get(route('admin.homestays.index'), { search }, { preserveState: true })} className="max-w-xs" />
                        <Button variant="secondary" onClick={() => router.get(route('admin.homestays.index'), { search }, { preserveState: true })}>Search</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>Name</TableHeader>
                                <TableHeader>City</TableHeader>
                                <TableHeader>Rooms</TableHeader>
                                <TableHeader>Status</TableHeader>
                                <TableHeader>Actions</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {homestays.data.map((homestay) => (
                                <TableRow key={homestay.id}>
                                    <TableCell><span className="font-medium">{homestay.name}</span></TableCell>
                                    <TableCell>{homestay.city}</TableCell>
                                    <TableCell>{homestay.rooms_count}</TableCell>
                                    <TableCell>
                                        {homestay.deleted_at ? (
                                            <span className="text-red-600 text-xs font-medium">Deleted</span>
                                        ) : (
                                            <span className="text-green-600 text-xs font-medium">{homestay.is_active ? 'Active' : 'Inactive'}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link href={route('admin.homestays.edit', homestay.id)}>
                                                <Button variant="ghost" size="sm">Edit</Button>
                                            </Link>
                                            <Link href={route('admin.homestays.rooms', homestay.id)}>
                                                <Button variant="ghost" size="sm">Rooms</Button>
                                            </Link>
                                            {homestay.deleted_at ? (
                                                <Button variant="ghost" size="sm" onClick={() => router.post(route('admin.homestays.restore', homestay.id))}>Restore</Button>
                                            ) : (
                                                <Button variant="danger" size="sm" onClick={() => { if (confirm('Are you sure?')) router.delete(route('admin.homestays.destroy', homestay.id)); }}>Delete</Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Pagination links={homestays.links} />
        </AdminLayout>
    );
}
