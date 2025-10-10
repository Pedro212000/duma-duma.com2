import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react'; // ✅ useForm + Link
import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { OctagonX, ArrowLeft } from 'lucide-react'; // ✅ added ArrowLeft icon

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Update User',
        href: 'users/update',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Props {
    user: User;
}

export default function Edit({ user }: Props) {
    const { data, setData, put, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />

            <div className="w-full sm:w-8/12 p-4 mx-auto"> {/* ✅ responsive container */}
                {/* ✅ Back Button */}
                <div className="mb-4">
                    <Link href={route('users.index')}>
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2 border-gray-400 text-gray-700 hover:bg-gray-100"
                        >
                            <ArrowLeft size={16} /> {/* ✅ back icon */}
                            Back
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                    {Object.keys(errors).length > 0 && (
                        <Alert>
                            <OctagonX />
                            <AlertTitle>Heads up!</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key}>{message as string}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="gap-1.5">
                        <label htmlFor="name">Name</label>
                        <Input
                            id="name"
                            placeholder="Fullname"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>

                    <div className="gap-1.5">
                        <label htmlFor="email">Email Address</label>
                        <Input
                            id="email"
                            placeholder="Email Address"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>

                    <div className="gap-1.5">
                        <label htmlFor="password">Password</label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Leave blank to keep current password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="role" className="font-medium">
                            Role
                        </label>
                        <select
                            id="role"
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                        >
                            <option value="">-- Select Role --</option>
                            <option value="admin">Admin</option>
                            <option value="publisher">Publisher</option>
                            <option value="viewer">Viewer</option>
                        </select>
                        {errors.role && (
                            <span className="text-red-500 text-sm">{errors.role}</span>
                        )}
                    </div>

                    {/* ✅ Responsive button section */}
                    <div className="flex flex-wrap justify-start gap-2">
                        {/* ✅ justify-start aligns button to the left */}

                        <Button
                            type="submit"
                            className="w-full sm:w-auto bg-black hover:bg-gray-900 text-white"
                        // ✅ changed color to black with dark gray hover
                        >
                            Update User
                        </Button>
                    </div>

                </form>
            </div>
        </AppLayout>
    );
}
