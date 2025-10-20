import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, Link, usePage } from '@inertiajs/react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from "react";
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/products' },
];

interface ProductImage {
    id: number;
    image_path: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    location: string;
    images: ProductImage[];
}

interface PageProps {
    products: Product[];
    flash: { message?: string };
    [key: string]: unknown;
}

export default function Index() {
    const { products, flash } = usePage<PageProps>().props;
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);


    const normalizeStoragePath = (url: string): string => {
        if (!url) return '/no-image.png';
        return url.startsWith('http') ? url : `/storage/${url.replace(/^\/?storage\//, '')}`;
    };


    // ✅ Delete image function
    const handleDeleteImage = async (productId: number, imageId: number) => {
        const swalResult = await Swal.fire({
            title: "Delete Image?",
            text: "Are you sure you want to delete this picture?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        const response = await fetch(`/products/${productId}/delete-image`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
                "X-Requested-With": "XMLHttpRequest", // ✅ Add this line
            },
            body: JSON.stringify({ image_id: imageId }),
        });


        if (!swalResult.isConfirmed) return;

        // ✅ Instead of fetch, use Inertia's router.post()
        router.post(`/products/${productId}/delete-image`, { image_id: imageId }, {
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Image has been removed.",
                    timer: 1500,
                    showConfirmButton: false,
                });

                if (activeProduct) {
                    setActiveProduct({
                        ...activeProduct,
                        images: activeProduct.images.filter(img => img.id !== imageId),
                    });
                }
            },
            onError: () => {
                Swal.fire("Error", "Failed to delete image.", "error");
            }
        });
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            {flash?.message && (
                <div className="m-4 p-3 bg-green-100 text-green-700 rounded-lg">
                    {flash.message}
                </div>
            )}

            <div className="m-4">
                <Link href="/products/create">
                    <Button>Create Product</Button>
                </Link>
            </div>

            {products.length > 0 ? (
                <div className="m-4">
                    <Table>
                        <TableCaption>A list of products.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Location</TableHead>
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
                                    <TableCell>{product.location}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            {product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0].image_path}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded border border-gray-300 cursor-pointer hover:opacity-80"
                                                    onClick={() => setActiveProduct(product)}
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = "/no-image.png";
                                                    }}
                                                />

                                            ) : (
                                                <img
                                                    src="/no-image.png"
                                                    alt="No image"
                                                    className="w-16 h-16 object-cover rounded border border-gray-300"
                                                />
                                            )}
                                            <div className="text-xs text-gray-500 mt-1">
                                                {product.images.length} image(s)
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
                                            <Button variant="destructive">Delete</Button>
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

            {/* ✅ Modal for Images */}
            {activeProduct && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                    onClick={() => setActiveProduct(null)}
                >
                    <div
                        className="bg-white p-6 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            {activeProduct.name}
                        </h3>

                        <div className="flex flex-col items-center gap-6">
                            {activeProduct.images.length > 0 ? (
                                activeProduct.images.map((img) => (
                                    <div key={img.id} className="relative flex flex-col items-center">
                                        <img
                                            src={normalizeStoragePath(img.image_path)}
                                            alt={activeProduct.name}
                                            className="w-full max-w-[600px] h-auto object-contain rounded-lg border border-gray-300 shadow-sm"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "/no-image.png";
                                            }}
                                        />

                                        <button
                                            className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700 shadow-md"
                                            onClick={() => handleDeleteImage(activeProduct.id, img.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No images available.</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                onClick={() => setActiveProduct(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
