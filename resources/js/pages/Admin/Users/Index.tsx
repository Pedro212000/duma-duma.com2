import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, Link, usePage } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BellPlus } from 'lucide-react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
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
        title: 'Users',
        href: '/users',
    },
];
interface Users {
    id: number,
    name: string,
    email: string,
}

interface PageProps extends InertiaPageProps {
    users: Users[]
    flash: {
        message?: string
    }

}

export default function Index() {
    const { users, flash } = usePage<PageProps>().props;


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
            {users.length > 0 && (
                <div className='m-4'>
                    <Table>
                        <TableCaption>A list of your recent invoices.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Fullname</TableHead>
                                <TableHead>Email Address</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user: { id: number; name: string; email: string }) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="text-right"></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </AppLayout>
    );
}
