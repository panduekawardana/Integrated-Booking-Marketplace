import { router } from '@inertiajs/react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Input } from '@/components/ui';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

interface UsersIndexProps {
    users: {
        data: Array<{
            id: number;
            name: string;
            email: string;
            phone: string | null;
            is_active: boolean;
            nationality: string | null;
            bookings_count: number;
            created_at: string;
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: Record<string, string>;
}

export default function Index({ users, filters }: UsersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && router.get(route('admin.users.index'), { search }, { preserveState: true })} className="max-w-xs" />
                        <Button variant="secondary" onClick={() => router.get(route('admin.users.index'), { search }, { preserveState: true })}>Search</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>Name</TableHeader>
                                <TableHeader>Email</TableHeader>
                                <TableHeader>Phone</TableHeader>
                                <TableHeader>Bookings</TableHeader>
                                <TableHeader>Status</TableHeader>
                                <TableHeader>Actions</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell><span className="font-medium">{user.name}</span></TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone || '-'}</TableCell>
                                    <TableCell>{user.bookings_count}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.is_active ? 'success' : 'danger'}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link href={route('admin.users.show', user.id)}>
                                                <Button variant="ghost" size="sm">View</Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm(`${user.is_active ? 'Deactivate' : 'Activate'} this user?`)) {
                                                        router.post(route('admin.users.toggle-active', user.id));
                                                    }
                                                }}
                                            >
                                                {user.is_active ? 'Deactivate' : 'Activate'}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Pagination links={users.links} />
        </AdminLayout>
    );
}
