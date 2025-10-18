import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, Link, usePage } from '@inertiajs/react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from "react";
import Swal from 'sweetalert2';


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/products' },
];

interface Product {
    id: number;
    name: string;
    description: string;
    location: string;
    images: string | string[] | null;
    picture_url?: string;
}

interface PageProps {
    products: Product[];
    flash: { message?: string };
    [key: string]: unknown;
}

export default function Index() {
    const { products, flash } = usePage<PageProps>().props;
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);

    // 🔧 Utility to normalize image path
    const getSrc = (imgUrl: string) => {
        const path = imgUrl ? imgUrl.trim() : "";
        return path ? `/storage/${path}` : "/no-image.png";
    };

    // 🔧 Parse images from mixed data types
    const parseImages = (data: string | string[] | null): string[] => {
        try {
            if (Array.isArray(data)) return data;
            if (typeof data === "string") {
                const raw = data.trim();
                if (raw.startsWith("[") && raw.endsWith("]")) return JSON.parse(raw);
                if (raw !== "") return [raw];
            }
        } catch {
            console.warn("Error parsing images");
        }
        return [];
    };

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
                                <TableHead>Location</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Picture</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => {
                                const images = parseImages(product.images);
                                const count = images.length;

                                return (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.location}</TableCell>
                                        <TableCell>{product.description}</TableCell>

                                        {/* ✅ Single clickable image */}
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                {count > 0 ? (
                                                    <img
                                                        src={getSrc(images[0])}
                                                        alt={`${product.name || "Product"} 1`}
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
                                                    {count} image(s)
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Actions */}
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
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-6">No products found.</p>
            )}

            {/* ✅ Scrollable Modal */}
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
                            {activeProduct.name || "Product Images"}
                        </h3>

                        {/* ✅ One-column layout with delete button per image */}
                        <div className="flex flex-col items-center gap-6">
                            {parseImages(activeProduct.images).map((imgUrl, index) => (
                                <div
                                    key={`${activeProduct.id}-${index}`}
                                    className="relative flex flex-col items-center"
                                >
                                    <img
                                        src={getSrc(imgUrl)}
                                        alt={`${activeProduct.name || "Product"} ${index + 1}`}
                                        className="w-full max-w-[600px] h-auto object-contain rounded-lg border border-gray-300 shadow-sm"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "/no-image.png";
                                        }}
                                    />

                                    {/* ❌ Delete Button */}
                                    <button
                                        className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700 shadow-md"
                                        onClick={async () => {
                                            const swalResult = await Swal.fire({
                                                title: "Delete Image?",
                                                text: "Are you sure you want to delete this picture?",
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#d33",
                                                cancelButtonColor: "#3085d6",
                                                confirmButtonText: "Yes, delete it!",
                                            });

                                            if (swalResult.isConfirmed) {
                                                try {
                                                    // 🧠 Adjust endpoint as needed (example: /products/:id/image-delete)
                                                    const response = await fetch(
                                                        `/products/${activeProduct.id}/delete-image`,
                                                        {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                                "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
                                                            },
                                                            body: JSON.stringify({ image: imgUrl }),
                                                        }
                                                    );

                                                    if (response.ok) {
                                                        Swal.fire({
                                                            icon: "success",
                                                            title: "Deleted!",
                                                            text: "Image has been removed.",
                                                            timer: 1500,
                                                            showConfirmButton: false,
                                                        });

                                                        // ✅ Update UI after delete
                                                        setActiveProduct({
                                                            ...activeProduct,
                                                            images: parseImages(activeProduct.images).filter(
                                                                (i) => i !== imgUrl
                                                            ),
                                                        });
                                                    } else {
                                                        Swal.fire("Error", "Failed to delete image.", "error");
                                                    }
                                                } catch {
                                                    Swal.fire("Error", "Something went wrong.", "error");
                                                }
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
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
