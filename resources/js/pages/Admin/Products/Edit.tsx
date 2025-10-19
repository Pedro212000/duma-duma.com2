import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { OctagonX } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Update a Product',
        href: 'products/update',
    },
];

interface Product {
    id?: number;
    name: string;
    location: string;
    description: string;
    images: string[];
}

interface Props {
    product: Product;
}

export default function UpdateProduct({ product }: Props) {
    const [data, setData] = useState({
        name: product.name || '',
        location: product.location || '',
        description: product.description || '',
        images: [] as File[],
    });

    const [existingImages, setExistingImages] = useState<string[]>(() => {
        if (!Array.isArray(product.images)) return [];
        return product.images.map((img: string) => {
            const cleaned = img.replace(/(\/storage\/)+/g, "/storage/");
            if (cleaned.startsWith("http")) return cleaned;
            if (cleaned.includes("/storage/")) return cleaned;
            return `/storage/${cleaned}`;
        });
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // ✅ Handle file input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        const total = existingImages.length + files.length;

        if (total > 7) {
            Swal.fire({
                icon: 'warning',
                title: 'Too Many Images!',
                text: `You already have ${existingImages.length} image(s). You can only add ${7 - existingImages.length} more.`,
            });
            e.target.value = '';
            return;
        }

        const oversized = files.filter((f) => f.size > 1 * 1024 * 1024);
        if (oversized.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'File Too Large!',
                text: 'Each image must be 1 MB or less.',
            });
            e.target.value = '';
            return;
        }

        setData({ ...data, images: files });
    };

    // ✅ Remove image
    const removeExistingImage = (index: number) => {
        Swal.fire({
            icon: 'question',
            title: 'Remove this image?',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it',
        }).then((result) => {
            if (result.isConfirmed) {
                const updated = existingImages.filter((_, i) => i !== index);
                setExistingImages(updated);
            }
        });
    };

    // ✅ Submit
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('location', data.location);
        formData.append('description', data.description);

        existingImages.forEach((img, i) => {
            formData.append(`existingImages[${i}]`, img);
        });

        data.images.forEach((file) => {
            formData.append('images[]', file);
        });

        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to update this product?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post(`/products/${product.id}?_method=PUT`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    })
                    .then(() => {
                        Swal.fire('Updated!', 'Product updated successfully!', 'success');
                    })
                    .catch(() => {
                        Swal.fire('Error!', 'Something went wrong.', 'error');
                    });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update Product" />
            <div className="w-8/12 p-4">
                <form onSubmit={handleUpdate} className="space-y-4">
                    {/* ✅ Product Name */}
                    <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                    </div>

                    {/* ✅ Product Location */}
                    <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={data.location}
                            onChange={(e) => setData({ ...data, location: e.target.value })}
                        />
                    </div>

                    {/* ✅ Product Description */}
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData({ ...data, description: e.target.value })
                            }
                        />
                    </div>

                    {/* ✅ Product Images */}
                    <Label htmlFor="images" className="mt-2">
                        Product Images (Max: 7, 1 MB each)
                    </Label>
                    <input
                        type="file"
                        id="images"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="border p-2 rounded-md"
                        disabled={existingImages.length >= 7}
                    />

                    {/* ✅ Previews */}
                    <div className="grid grid-cols-3 gap-3 mt-3">
                        {existingImages.map((img, i) => (
                            <div key={i} className="relative">
                                <img
                                    src={img}
                                    alt={`Image ${i}`}
                                    className="w-full h-32 object-cover rounded-md border cursor-pointer transition-transform duration-200 hover:scale-105"
                                    onClick={() => setPreviewImage(img)}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(i)}
                                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                        {data.images.map((file, i) => (
                            <div key={`new-${i}`} className="relative">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`New ${i}`}
                                    className="w-full h-32 object-cover rounded-md border cursor-pointer"
                                    onClick={() =>
                                        setPreviewImage(URL.createObjectURL(file))
                                    }
                                />
                            </div>
                        ))}
                    </div>

                    {/* ✅ Fullscreen Preview */}
                    {previewImage && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                            onClick={() => setPreviewImage(null)}
                        >
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
                            />
                            <button
                                className="absolute top-5 right-5 bg-red-600 text-white px-3 py-1 rounded"
                                onClick={() => setPreviewImage(null)}
                            >
                                ✕ Close
                            </button>
                        </div>
                    )}

                    <p className="text-sm text-gray-500">
                        Total Images: {existingImages.length + data.images.length}/7
                    </p>

                    {/* ✅ Submit Button */}
                    <div>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto bg-black hover:bg-gray-900 text-white"
                        >
                            Update Product
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
