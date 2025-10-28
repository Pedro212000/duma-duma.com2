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

interface PlaceImage {
    id: number;
    image_path: string;
}

interface Place {
    id: number;
    name: string;
    description: string;
    barangay: string;
    town_name: string;
    images: PlaceImage[];
}

interface PageProps {
    places: Place[];
    flash: { message?: string };
    [key: string]: unknown;
}

export default function Index() {
    const { processing } = useForm();
    const { places, flash } = usePage<PageProps>().props;
    const [activePlace, setActivePlace] = useState<Place | null>(null);
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Do you want to delete place ${id}. ${name}?`)) {
            router.delete(`/places/${id}`, {
                onSuccess: () => {
                    console.log('Place deleted successfully.');
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        }
    };


    const normalizeStoragePath = (url: string): string => {
        if (!url) return '/no-image.png';
        return url.startsWith('http') ? url : `/storage/${url.replace(/^\/?storage\//, '')}`;
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Places" />

            {flash?.message && (
                <div className="m-4 p-3 bg-green-100 text-green-700 rounded-lg">
                    {flash.message}
                </div>
            )}

            <div className="m-4">
                <Link href="/places/create">
                    <Button>Create Place</Button>
                </Link>
            </div>

            {places.length > 0 ? (
                <div className="m-4">
                    <Table>
                        <TableCaption>A list of places.</TableCaption>
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
                            {places.map((place) => (
                                <TableRow key={place.id}>
                                    <TableCell className="font-medium">{place.id}</TableCell>
                                    <TableCell>{place.name}</TableCell>
                                    <TableCell>{place.barangay + ", " + place.town_name}</TableCell>
                                    <TableCell>{place.description}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            {place.images.length > 0 ? (
                                                <img
                                                    src={place.images[0].image_path}
                                                    alt={place.name}
                                                    className="w-16 h-16 object-cover rounded border border-gray-300 cursor-pointer hover:opacity-80"
                                                    onClick={() => setActivePlace(place)}
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
                                                {place.images.length} image(s)
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <div className="flex flex-wrap justify-center gap-2">
                                            <Link href={`/places/${place.id}/edit`}>
                                                <Button className="bg-slate-600 hover:bg-slate-700 text-white">
                                                    Update
                                                </Button>
                                            </Link>
                                            <Button
                                                disabled={processing}
                                                onClick={() => handleDelete(place.id, place.name)}
                                                className="w-full sm:w-auto bg-red-500 hover:bg-red-700 text-white"
                                            >
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
                <p className="text-center text-gray-500 mt-6">No places found.</p>
            )}

            {/* ✅ Modal for Images */}
            {activePlace && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                    onClick={() => setActivePlace(null)}
                >
                    <div
                        className="bg-white p-6 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-semibold mb-4 text-center">
                            {activePlace.name}
                        </h3>

                        <div className="flex flex-col items-center gap-6">
                            {activePlace.images.length > 0 ? (
                                activePlace.images.map((img) => (
                                    <div key={img.id} className="relative flex flex-col items-center">
                                        <img
                                            src={normalizeStoragePath(img.image_path)}
                                            alt={activePlace.name}
                                            className="w-full max-w-[600px] h-auto object-contain rounded-lg border border-gray-300 shadow-sm"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "/no-image.png";
                                            }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No images available.</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                onClick={() => setActivePlace(null)}
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
