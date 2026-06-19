import { Form } from '@inertiajs/react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface SettingsIndexProps {
    settings: {
        app_name: string;
        midtrans_server_key: string;
        midtrans_client_key: string;
        midtrans_production: boolean;
    };
}

export default function Index({ settings }: SettingsIndexProps) {
    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

            <div className="max-w-2xl space-y-6">
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Website Settings</h2>
                    </CardHeader>
                    <CardContent>
                        <Form action={route('admin.settings.update')} method="post">
                            {({ errors }) => (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Application Name</label>
                                        <input
                                            type="text"
                                            name="app_name"
                                            defaultValue={settings.app_name}
                                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.app_name && <p className="text-sm text-red-600 mt-1">{errors.app_name}</p>}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit">Save Settings</Button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Payment Configuration</h2>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div>
                            <p className="text-gray-500">Midtrans Server Key</p>
                            <p className="font-mono">{(settings.midtrans_server_key || 'Not configured').substring(0, 20)}...</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Midtrans Client Key</p>
                            <p className="font-mono">{(settings.midtrans_client_key || 'Not configured').substring(0, 20)}...</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Environment</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${settings.midtrans_production ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {settings.midtrans_production ? 'Production' : 'Sandbox'}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
