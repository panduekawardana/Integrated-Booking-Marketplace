import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui';
import { useState } from 'react';

interface TourGuidesIndexProps {
    guides: {
        data: Array<{
            id: number;
            name: string;
            languages: string[] | null;
            specialties: string[] | null;
            price_per_day: number;
            max_pax: number;
            is_active: boolean;
            deleted_at: string | null;
            created_at: string;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: Record<string, string>;
}

export default function Index({ guides, filters }: TourGuidesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Tour Guides</h1>
                <Link href={route('admin.tour-guides.create')}>
                    <Button>Add New Guide</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Input placeholder="Search guides..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && router.get(route('admin.tour-guides.index'), { search }, { preserveState: true })} className="max-w-xs" />
                        <Button variant="secondary" onClick={() => router.get(route('admin.tour-guides.index'), { search }, { preserveState: true })}>Search</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>Name</TableHeader>
                                <TableHeader>Languages</TableHeader>
                                <TableHeader>Price/Day</TableHeader>
                                <TableHeader>Max Pax</TableHeader>
                                <TableHeader>Status</TableHeader>
                                <TableHeader>Actions</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {guides.data.map((guide) => (
                                <TableRow key={guide.id}>
                                    <TableCell><span className="font-medium">{guide.name}</span></TableCell>
                                    <TableCell>{guide.languages?.join(', ') || '-'}</TableCell>
                                    <TableCell>Rp {Number(guide.price_per_day).toLocaleString('id-ID')}</TableCell>
                                    <TableCell>{guide.max_pax}</TableCell>
                                    <TableCell>
                                        {guide.deleted_at ? (
                                            <span className="text-red-600 text-xs font-medium">Deleted</span>
                                        ) : (
                                            <span className="text-green-600 text-xs font-medium">{guide.is_active ? 'Active' : 'Inactive'}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link href={route('admin.tour-guides.edit', guide.id)}>
                                                <Button variant="ghost" size="sm">Edit</Button>
                                            </Link>
                                            {guide.deleted_at ? (
                                                <Button variant="ghost" size="sm" onClick={() => router.post(route('admin.tour-guides.restore', guide.id))}>Restore</Button>
                                            ) : (
                                                <Button variant="danger" size="sm" onClick={() => { if (confirm('Are you sure?')) router.delete(route('admin.tour-guides.destroy', guide.id)); }}>Delete</Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Pagination links={guides.links} />
        </AdminLayout>
    );
}
