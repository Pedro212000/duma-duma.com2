import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { Select } from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Update a Place',
        href: 'places/update',
    },
];

interface Place {
    id?: number;
    name: string;
    town_code: string;
    town: string;
    barangay: string;
    description: string;
    images: {
        id: number;
        image_path: string;
    }[];
}

interface Props {
    place: Place;
}
interface Town {
    code: string; // PSGC codes are usually strings like "013301000"
    name: string;
}

interface Barangay {
    code: string;
    name: string;
    municipalityCode: string;
}

export default function UpdateProduct({ place }: Props) {
    const [data, setData] = useState({
        name: place.name || '',
        town_code: place.town_code || '',
        town: place.town || '',
        town_name: place.name || '',
        barangay: place.barangay || '',
        description: place.description || '',
        images: [] as File[],


    });

    const [towns, setTowns] = useState<Town[]>([]);
    const [barangays, setBarangays] = useState<Barangay[]>([]);

    useEffect(() => {
        fetch("https://psgc.gitlab.io/api/provinces/013300000/municipalities/")
            .then((res) => res.json())
            .then(setTowns)
            .catch((err) => console.error("Failed to fetch towns:", err));
    }, []);

    useEffect(() => {
        if (data.town_code) {
            const url = `https://psgc.gitlab.io/api/cities-municipalities/${data.town_code}/barangays/`;
            console.log("Fetching barangays from:", url);

            fetch(url)
                .then((res) => res.json())
                .then(setBarangays)
                .catch((err) => console.error("Failed to fetch barangays:", err));
        } else {
            setBarangays([]);
        }
    }, [data.town_code]);

    // ✅ Initialize existing images with full URLs
    const [existingImages, setExistingImages] = useState(
        place.images.map((img) => ({
            id: img.id,
            url: img.image_path.startsWith('http')
                ? img.image_path
                : `/storage/${img.image_path.replace(/^\/?storage\//, '')}`,
        }))
    );

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // ✅ CSRF setup (required for Laravel)
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
    if (token) axios.defaults.headers.common['X-CSRF-TOKEN'] = token;

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

    // ✅ Remove existing image (calls backend)
    const removeExistingImage = (imageId: number, index: number) => {
        Swal.fire({
            icon: 'question',
            title: 'Remove this image?',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it',
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post(`/places/${place.id}/delete-image`, {
                        image_id: imageId,
                    })
                    .then(() => {
                        Swal.fire('Deleted!', 'Image removed successfully.', 'success');
                        setExistingImages((prev) => prev.filter((_, i) => i !== index));
                    })
                    .catch((err) => {
                        Swal.fire(
                            'Error!',
                            err.response?.data?.message || 'Failed to delete image.',
                            'error'
                        );
                    });
            }
        });
    };

    // ✅ Submit update form
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('town_name', data.town_name);
        formData.append('town_code', data.town_code);
        formData.append('barangay', data.barangay);
        formData.append('description', data.description);
        console.log(data.town_name);

        data.images.forEach((file) => {
            formData.append('images[]', file);
        });

        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to update this place?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post(`/places/${place.id}?_method=PUT`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    })
                    .then(() => {
                        Swal.fire('Updated!', 'Place updated successfully!', 'success');
                    })
                    .catch(() => {
                        Swal.fire('Error!', 'Something went wrong.', 'error');
                    });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update Place" />
            <div className="w-8/12 p-4">
                {/* ✅ Back Button */}
                <div className="mb-4">
                    <Link href={route('places.index')}>
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2 border-gray-400 text-gray-700 hover:bg-gray-100"
                        >
                            <ArrowLeft size={16} /> {/* ✅ back icon */}
                            Back
                        </Button>
                    </Link>
                </div>
                <form onSubmit={handleUpdate} className="space-y-4">
                    {/* ✅ Place Name */}
                    <div>
                        <Label htmlFor="name">Place Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                    </div>

                    {/* ✅ Place Location */}
                    <div className="space-y-3">
                        {/* ✅ Town Dropdown */}
                        <div>
                            <Label htmlFor="town">Town</Label>
                            <Select
                                value={data.town_code} // ✅ this should match the field in your form data
                                onValueChange={(val) => {
                                    const selectedTown = towns.find((t) => t.code === val);
                                    setData({
                                        ...data,
                                        town: val,
                                        town_code: val,
                                        town_name: selectedTown?.name ?? "",
                                    });
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Town" />
                                </SelectTrigger>
                                <SelectContent>
                                    {towns.map((town) => (
                                        <SelectItem key={town.code} value={town.code}>
                                            {town.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>


                        {/* ✅ Barangay Dropdown */}
                        <div>
                            <Label htmlFor="barangay">Barangay</Label>
                            <Select
                                value={data.barangay}
                                onValueChange={(val) =>
                                    setData({
                                        ...data,
                                        barangay: val,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Barangay" />
                                </SelectTrigger>
                                <SelectContent>
                                    {barangays.map((brgy) => (
                                        <SelectItem key={brgy.code} value={brgy.name}>
                                            {brgy.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* ✅ Place Description */}
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

                    {/* ✅ Place Images */}
                    <Label htmlFor="images" className="mt-2">
                        Place Images (Max: 7, 1 MB each)
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
                            <div key={img.id} className="relative">
                                <img
                                    src={img.url}
                                    alt={`Image ${i}`}
                                    className="w-full h-32 object-cover rounded-md border cursor-pointer transition-transform duration-200 hover:scale-105"
                                    onClick={() => setPreviewImage(img.url)}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(img.id, i)}
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
                            Update Place
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
