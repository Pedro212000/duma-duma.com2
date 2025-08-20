import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create a User',
        href: 'users/create',
    },
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="w-18/12 p-4">
                <Form action="">
                    <div className="gap-1.5 max-w-sm">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" placeholder="Username" />
                    </div>
                </Form>
            </div>
        </AppLayout>
    );
}
