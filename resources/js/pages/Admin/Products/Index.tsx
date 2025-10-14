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
    images: string | string[] | null;
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
                                    {/* Replace your current TableCell image block with this */}
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {(() => {
                                                    // Debug info: show raw value in console
                                                    console.log('RAW product.images for id', product.id, ':', product.images);

                                                    let images: string[] = [];

                                                    try {
                                                        // If it's already an array (from props), use it
                                                        if (Array.isArray(product.images)) {
                                                            images = product.images;
                                                        } else if (typeof product.images === 'string') {
                                                            const raw = product.images.trim();

                                                            // If it looks like a JSON array, parse it
                                                            if (raw.startsWith('[') && raw.endsWith(']')) {
                                                                try {
                                                                    images = JSON.parse(raw);
                                                                } catch (err) {
                                                                    console.warn('JSON.parse failed for product.images', product.id, err);
                                                                    images = [];
                                                                }
                                                            } else if (raw !== '') {
                                                                // It's a single path string (not JSON array)
                                                                images = [raw];
                                                            } else {
                                                                images = [];
                                                            }
                                                        } else {
                                                            images = [];
                                                        }
                                                    } catch (err) {
                                                        console.error('Error parsing images for product', product.id, err);
                                                        images = [];
                                                    }

                                                    // Debug: show parsed images in console
                                                    console.log('PARSED images for id', product.id, images);

                                                    // If still empty, show fallback
                                                    if (images.length === 0) {
                                                        return (
                                                            <img
                                                                src="/no-image.png"
                                                                alt="No image"
                                                                className="w-16 h-16 object-cover rounded border border-gray-300"
                                                            />
                                                        );
                                                    }

                                                    // Render all images
                                                    return images.map((imgUrl: string, index: number) => {
                                                        // normalize (trim) the path
                                                        const path = imgUrl ? imgUrl.trim() : '';
                                                        // if the DB contains "products/..." then we want /storage/products/...
                                                        const src = path ? `/storage/${path}` : '/no-image.png';

                                                        return (
                                                            <img
                                                                key={`${product.id}-${index}`}
                                                                src={src}
                                                                alt={`${product.name || 'Product'} ${index + 1}`}
                                                                className="w-16 h-16 object-cover rounded border border-gray-300"
                                                                onError={(e) => {
                                                                    e.currentTarget.onerror = null; // prevent loop
                                                                    e.currentTarget.src = '/no-image.png';
                                                                }}
                                                            />
                                                        );
                                                    });
                                                })()}
                                            </div>

                                            {/* Small debug text so you can see number of images per product in UI */}
                                            <div className="text-xs text-gray-500 mt-1">
                                                {(() => {
                                                    try {
                                                        let count = 0;
                                                        if (Array.isArray(product.images)) count = product.images.length;
                                                        else if (typeof product.images === 'string' && product.images.trim().startsWith('[')) {
                                                            count = JSON.parse(product.images || '[]').length;
                                                        } else if (typeof product.images === 'string' && product.images.trim() !== '') {
                                                            count = 1;
                                                        }
                                                        return `${count} image(s)`;
                                                    } catch {
                                                        return '0 image(s)';
                                                    }
                                                })()}
                                            </div>
                                        </div>
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
