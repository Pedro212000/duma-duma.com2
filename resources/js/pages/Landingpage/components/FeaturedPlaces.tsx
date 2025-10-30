import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MapPin } from "lucide-react";

const places = [
  {
    id: 1,
    name: "Naguilian",
    image: "https://images.unsplash.com/photo-1657707419315-98051e9ead91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMG1vdW50YWluJTIwdG93bnxlbnwxfHx8fDE3NjE2NTM2Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Known for its rich agricultural heritage and traditional products"
  },
  {
    id: 2,
    name: "Bauang",
    image: "https://images.unsplash.com/photo-1727940584070-b257471f1b99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2FzdGFsJTIwdG93biUyMHBoaWxpcHBpbmVzfGVufDF8fHx8MTc2MTY1MzY3OHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Coastal town famous for fresh seafood and local delicacies"
  },
  {
    id: 3,
    name: "San Fernando",
    image: "https://images.unsplash.com/photo-1640958902102-bdd5cc3f2ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHRvd24lMjBhZXJpYWx8ZW58MXx8fHwxNzYxNjUzNjc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "The capital city with vibrant markets and artisan crafts"
  }
];

interface FeaturedPlacesProps {
  onTownSelect: (townName: string) => void;
}

export function FeaturedPlaces({ onTownSelect }: FeaturedPlacesProps) {
  return (
    <section id="places" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4">Featured Places</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the unique character of each town and their local treasures
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {places.map((place) => (
            <Card
              key={place.id}
              className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border"
            >
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-white" />
                    <h3 className="text-white text-2xl">{place.name}</h3>
                  </div>
                  <p className="text-white/90 text-sm mb-4">
                    {place.description}
                  </p>
                  <Button
                    onClick={() => onTownSelect(place.name)}
                    variant="secondary"
                    className="w-full bg-white/90 hover:bg-white text-primary hover:scale-105 transition-all duration-200 hover:shadow-md"
                  >
                    View Products →
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}