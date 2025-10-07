import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, Link, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BellPlus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

interface PageProps {
    flash: {
        message?: string
    }
}

export default function Index() {
    const { flash } = usePage().props as PageProps;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="m-4">
                <Link href={'users/create'}><Button>Create User</Button></Link>
            </div>
            <div className='m-4'>
                <div>
                    {flash.message && (
                        <Alert>
                            <BellPlus />
                            <AlertTitle>Heads up!</AlertTitle>
                            <AlertDescription>
                                {flash.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
