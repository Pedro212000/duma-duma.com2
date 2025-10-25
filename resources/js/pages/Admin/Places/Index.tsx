import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from "react";
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Places', href: '/places' },
];

export default function Index() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Places" />
            <div className="m-4">
                <Link href="/places/create">
                    <Button>Create Place</Button>
                </Link>
            </div>
        </AppLayout>
    );
}
