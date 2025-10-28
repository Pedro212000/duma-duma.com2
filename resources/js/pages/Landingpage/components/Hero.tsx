import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1581345796539-ac17c5668cc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGlsaXBwaW5lcyUyMG1hcmtldHBsYWNlfGVufDF8fHx8MTc2MTY1MzY3OHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Local marketplace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6">
          Discover Local Treasures of La Union
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
          Explore unique products from Bauang, Naguilian, and beyond.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="min-w-[200px]"
            onClick={() => scrollToSection("places")}
          >
            Explore Places
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-w-[200px] bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white"
            onClick={() => scrollToSection("products")}
          >
            View Products
          </Button>
        </div>
      </div>
    </section>
  );
}
