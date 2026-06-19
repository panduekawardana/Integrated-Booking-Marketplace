import { router } from '@inertiajs/react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';

interface RoomsIndexProps {
    homestay: {
        id: number;
        name: string;
        rooms: Array<{
            id: number;
            name: string;
            description: string | null;
            price_per_night: number;
            max_guests: number;
            total_rooms: number;
            is_active: boolean;
        }>;
    };
}

export default function Index({ homestay }: RoomsIndexProps) {
    const [showCreate, setShowCreate] = useState(false);
    const [editingRoom, setEditingRoom] = useState<number | null>(null);

    const handleDelete = (roomId: number) => {
        if (confirm('Delete this room?')) {
            router.delete(route('admin.homestays.rooms.destroy', [homestay.id, roomId]));
        }
    };

    return (
        <AdminLayout>
            <Link href={route('admin.homestays.edit', homestay.id)} className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
                &larr; Back to {homestay.name}
            </Link>

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Rooms - {homestay.name}</h1>
                <Button onClick={() => setShowCreate(true)}>Add Room</Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>Name</TableHeader>
                                <TableHeader>Price/Night</TableHeader>
                                <TableHeader>Max Guests</TableHeader>
                                <TableHeader>Total Rooms</TableHeader>
                                <TableHeader>Status</TableHeader>
                                <TableHeader>Actions</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {homestay.rooms.map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell><span className="font-medium">{room.name}</span></TableCell>
                                    <TableCell>Rp {Number(room.price_per_night).toLocaleString('id-ID')}</TableCell>
                                    <TableCell>{room.max_guests}</TableCell>
                                    <TableCell>{room.total_rooms}</TableCell>
                                    <TableCell>
                                        <span className={`text-xs font-medium ${room.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                            {room.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => setEditingRoom(room.id)}>Edit</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(room.id)}>Delete</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add Room">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const data = {
                        name: (form.elements.namedItem('name') as HTMLInputElement).value,
                        price_per_night: (form.elements.namedItem('price_per_night') as HTMLInputElement).value,
                        max_guests: (form.elements.namedItem('max_guests') as HTMLInputElement).value,
                        total_rooms: (form.elements.namedItem('total_rooms') as HTMLInputElement).value,
                        is_active: (form.elements.namedItem('is_active') as HTMLInputElement).checked ? '1' : '0',
                    };
                    router.post(route('admin.homestays.rooms.store', homestay.id), data as any, {
                        onSuccess: () => setShowCreate(false),
                    });
                }}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                            <input type="text" name="name" required className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price/Night (Rp)</label>
                                <input type="number" name="price_per_night" step="0.01" required className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                                <input type="number" name="max_guests" min="1" required className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Rooms</label>
                            <input type="number" name="total_rooms" min="0" required className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="is_active" value="1" defaultChecked />
                            <label className="text-sm text-gray-700">Active</label>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="submit">Create Room</Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
