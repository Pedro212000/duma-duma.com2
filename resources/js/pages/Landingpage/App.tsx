import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { FeaturedPlaces } from "./components/FeaturedPlaces";
import { TopProducts } from "./components/TopProducts";
import { About } from "./components/About";
import { Footer } from "./components/Footer";
import { Link, usePage } from '@inertiajs/react';
import { SharedData } from "@/types";


export default function App() {
    const { auth } = usePage<SharedData>().props;
    return (
        <div className="min-h-screen">
            <Navbar />
            <Hero />
            <FeaturedPlaces />
            <TopProducts />
            <About />
            <Footer />
        </div>
    );
}
