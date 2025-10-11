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
        title: 'Create a Product',
        href: 'products/create',
    },
];

export default function CreateProduct() {
    const { data, setData, post, errors, reset } = useForm<{
        name: string;
        location: string;
        description: string;
        images: File[]; // 👈 define images as an array of Files
    }>({
        name: '',
        location: '',
        description: '',
        images: [],
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // ✅ Build FormData for file upload
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('location', data.location);
        formData.append('description', data.description);
        data.images.forEach((file) => formData.append('images[]', file));

        post(route('products.store'), {
            forceFormData: true, // 🔑 Needed to send multipart/form-data
            onSuccess: () => reset(),
        });
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
            <Head title="Create Product" />
            <div className="w-8/12 p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        {data.images.map((file, index) => (
                            <img
                                key={index}
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index}`}
                                className="w-full h-32 object-cover rounded-md border"
                            />
                        ))}
                    </div>

                    {/* ✅ Submit */}
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Add Product
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
