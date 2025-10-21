import { useEffect, useState } from "react";

interface Town {
    code: string;
    name: string;
}

interface Barangay {
    code: string;
    name: string;
}

export function usePSGC(selectedTownCode: string) {
    const [towns, setTowns] = useState<Town[]>([]);
    const [barangays, setBarangays] = useState<Barangay[]>([]);
    const [loading, setLoading] = useState(false);

    // ✅ Fetch towns (La Union)
    useEffect(() => {
        fetch("https://psgc.gitlab.io/api/provinces/013300000/municipalities/")
            .then((res) => res.json())
            .then(setTowns)
            .catch((err) => console.error("Failed to fetch towns:", err));
    }, []);

    // ✅ Fetch barangays when a town is selected
    useEffect(() => {
        if (!selectedTownCode) {
            setBarangays([]);
            return;
        }

        const url = `https://psgc.gitlab.io/api/cities-municipalities/${selectedTownCode}/barangays/`;
        setLoading(true);
        console.log("Fetching barangays from:", url);

        fetch(url)
            .then((res) => res.json())
            .then(setBarangays)
            .catch((err) => console.error("Failed to fetch barangays:", err))
            .finally(() => setLoading(false));
    }, [selectedTownCode]);

    return { towns, barangays, loading };
}
