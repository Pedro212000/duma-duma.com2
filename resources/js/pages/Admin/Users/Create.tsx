import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { OctagonX } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create a User',
        href: 'users/create',
    },
];

export default function Index() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="w-8/12 p-4">
                <form onSubmit={handleSubmit} action="" className='space-y-4'>
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
                    <div className='gap-1.5'>
                        <label htmlFor="Full Name">Name</label>
                        <Input placeholder='Fullname' value={data.name} onChange={(e) => setData('name', e.target.value)}></Input>
                    </div>
                    <div className='gap-1.5'>
                        <label htmlFor="email address">Email Address</label>
                        <Input placeholder='Email Address' value={data.email} onChange={(e) => setData('email', e.target.value)}></Input>
                    </div>
                    <div className='gap-1.5'>
                        <label htmlFor="password">Password</label>
                        <Input placeholder='Password' value={data.password} onChange={(e) => setData('password', e.target.value)}></Input>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="role" className="font-medium">
                            Role
                        </label>
                        <select
                            id="role"
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}>
                            <option value="">-- Select Role --</option>
                            <option value="admin">Admin</option>
                            <option value="publisher">Publisher</option>
                            <option value="viewer">Viewer</option>
                        </select>
                        {errors.role && (
                            <span className="text-red-500 text-sm">{errors.role}</span>
                        )}
                    </div>
                    <Button type='submit'>Add User</Button>
                </form>
            </div>
        </AppLayout>
    );
}
