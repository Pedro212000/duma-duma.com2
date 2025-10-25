import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, OctagonX } from 'lucide-react';
import { useState, useEffect } from "react";
import { Select } from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create a Place',
        href: 'places/create',
    },
];
interface Town {
    code: string; // PSGC codes are usually strings like "013301000"
    name: string;
}

interface Barangay {
    code: string;
    name: string;
    municipalityCode: string;
}
export default function CreateProduct() {

    const [towns, setTowns] = useState<Town[]>([]);
    const [barangays, setBarangays] = useState<Barangay[]>([]);

    const { data, setData, post, errors, reset, processing } = useForm<{
        name: string;
        location: string;
        description: string;
        images: File[];
        town: string;
        barangay: string;
        town_name: string;
        town_code: string;
    }>({
        name: "",
        location: "",
        description: "",
        images: [],
        town: "",
        barangay: "",
        town_name: "",
        town_code: "",
    });
    useEffect(() => {
        fetch("https://psgc.gitlab.io/api/provinces/013300000/municipalities/")
            .then((res) => res.json())
            .then(setTowns)
            .catch((err) => console.error("Failed to fetch towns:", err));
    }, []);

    useEffect(() => {
        if (data.town) {
            const url = `https://psgc.gitlab.io/api/cities-municipalities/${data.town}/barangays/`;
            console.log("Fetching barangays from:", url);

            fetch(url)
                .then((res) => res.json())
                .then(setBarangays)
                .catch((err) => console.error("Failed to fetch barangays:", err));
        } else {
            setBarangays([]);
        }
    }, [data.town]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // ✅ Build FormData for file upload
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('location', data.location);
        formData.append('description', data.description);
        data.images.forEach((file) => formData.append('images[]', file));

        post(route('places.store'), {
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
            <Head title="Create Place" />
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

                    {/* ✅ Places Name */}
                    <div className="gap-1.5">
                        <Label htmlFor="name">Place Name</Label>
                        <Input
                            placeholder="Place Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>

                    {/* ✅ Place Location */}
                    <div className="space-y-3">
                        {/* ✅ Town Dropdown */}
                        <div>
                            <Label htmlFor="town">Town</Label>
                            <Select
                                onValueChange={(val) => {
                                    const selectedTown = towns.find((t) => t.code === val);
                                    setData("town", val); // keep the code
                                    setData("town_name", selectedTown?.name ?? "");
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

                            <Select onValueChange={(val) => setData("barangay", val)}>
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
                    <div className="gap-1.5">
                        <Label htmlFor="description">Place Description</Label>
                        <textarea
                            id="description"
                            placeholder="Place Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                        ></textarea>
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
                    <Button
                        type="submit"
                        disabled={processing}
                        className={`${processing
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            } text-white`}
                    >
                        {processing ? "Processing..." : "Create Place"}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
