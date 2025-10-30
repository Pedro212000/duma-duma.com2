import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { FeaturedPlaces } from "./components/FeaturedPlaces";
import { TopProducts } from "./components/TopProducts";
import { About } from "./components/About";
import { Footer } from "./components/Footer";
import { Link, usePage } from '@inertiajs/react';
import { SharedData } from "@/types";
import { useState } from "react";
import { TownDetails } from "./components/TownDetails";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
    const [selectedTown, setSelectedTown] = useState<string | null>(null);

    const handleTownSelect = (townName: string) => {
        setSelectedTown(townName);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleBackToHome = () => {
        setSelectedTown(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen">
            <AnimatePresence mode="wait">
                {selectedTown ? (
                    <motion.div
                        key="town-details"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                    >
                        <TownDetails townName={selectedTown} onBack={handleBackToHome} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="home"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Navbar />
                        <Hero />
                        <FeaturedPlaces onTownSelect={handleTownSelect} />
                        <TopProducts />
                        <About />
                        <Footer />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}