import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { OctagonX } from 'lucide-react';

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
    images: File[];
}

interface Props {
    product: Product;
}

interface ProductForm extends Product {
    images: File[]; // ✅ used for new image uploads
}
export default function UpdateProduct({ product }: Props) {
    const { data, setData, put, errors } = useForm<ProductForm>({
        name: product.name || '',
        location: product.location || '',
        description: product.description || '',
        images: [],
    });
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('products.update', product.id));
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);

        // ✅ Limit total count
        if (files.length > 7) {
            alert('You can upload a maximum of 7 pictures.');
            e.target.value = '';
            return;
        }

        // ✅ Limit file size (1 MB)
        const oversized = files.filter((file) => file.size > 1 * 1024 * 1024);
        if (oversized.length > 0) {
            alert('Each image must be 1 MB or less.');
            e.target.value = '';
            return;
        }

        setData('images', files); // ✅ works if images: File[] in useForm
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update Product" />
            <div className="w-8/12 p-4">
                <form onSubmit={handleUpdate} className="space-y-4">
                    {/* ✅ Error Display */}
                    {Object.keys(errors).length > 0 && (
                        <Alert>
                            <OctagonX />
                            <AlertTitle>Heads up!</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key}>{message as string}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* ✅ Product Name */}
                    <div className="gap-1.5">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            placeholder="Product Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>

                    {/* ✅ Product Location */}
                    <div className="gap-1.5">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            placeholder="Location"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                        />
                    </div>

                    {/* ✅ Product Description */}
                    <div className="gap-1.5">
                        <Label htmlFor="description">Product Description</Label>
                        <Input
                            placeholder="Product Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
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
                    />

                    {/* ✅ Image Preview */}


                    {/* ✅ Submit */}
                    <div className="flex flex-wrap justify-start gap-2">
                        {/* ✅ justify-start aligns button to the left */}

                        <Button
                            type="submit"
                            className="w-full sm:w-auto bg-black hover:bg-gray-900 text-white"
                        // ✅ changed color to black with dark gray hover
                        >
                            Update Product
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
