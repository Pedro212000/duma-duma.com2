import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

interface Product {
    id: number;
    name: string;
    description: string;
    picture: string | string[] | null;
    picture_url?: string;
}

interface PageProps {
    products: Product[];
    flash: {
        message?: string;
    };
    [key: string]: unknown;
}

export default function Index() {
    const { products, flash } = usePage<PageProps>().props;
    const { processing } = useForm();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            {/* Flash Message */}
            {flash?.message && (
                <div className="m-4 p-3 bg-green-100 text-green-700 rounded-lg">
                    {flash.message}
                </div>
            )}

            {/* Create Button */}
            <div className="m-4">
                <Link href="/products/create">
                    <Button>Create Product</Button>
                </Link>
            </div>

            {/* Product Table */}
            {products.length > 0 ? (
                <div className="m-4">
                    <Table>
                        <TableCaption>A list of products.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Picture</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.id}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell>
                                        <img
                                            src={`/storage/products/${product.picture}`}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <img
                                            src={product.picture_url}
                                            alt={product.name}
                                            className="w-16 h-16 object-cover rounded border border-gray-300"
                                            onError={(e) => (e.currentTarget.src = '/images/no-image.png')} // fallback
                                        />
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <div className="flex flex-wrap justify-center gap-2">
                                            <Link href={`/products/${product.id}/edit`}>
                                                <Button className="bg-slate-600 hover:bg-slate-700 text-white">
                                                    Update
                                                </Button>
                                            </Link>
                                            <Button variant="destructive">
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-6">No products found.</p>
            )}
        </AppLayout>
    );
}
