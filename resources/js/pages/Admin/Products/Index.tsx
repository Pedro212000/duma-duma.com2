import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BellPlus } from 'lucide-react';
import { PageProps as InertiaPageProps, router } from '@inertiajs/core';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/users',
    },
];



interface Users {
    id: number,
    name: string,
    email: string,
}

// interface PageProps extends InertiaPageProps {
//     users: Users[]
//     flash: {
//         message?: string
//     }

// }

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="m-4">
                <Link href={'products/create'}><Button>Create Product</Button></Link>
            </div>
        </AppLayout>
    );
}
