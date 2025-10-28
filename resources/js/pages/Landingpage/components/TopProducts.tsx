import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShoppingBag } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Basi Wine",
    price: "₱450",
    town: "Naguilian",
    image: "https://images.unsplash.com/photo-1562601579-599dec564e06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwYm90dGxlc3xlbnwxfHx8fDE3NjE2MjczMzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Traditional sugarcane wine"
  },
  {
    id: 2,
    name: "Dried Fish",
    price: "₱280",
    town: "Bauang",
    image: "https://images.unsplash.com/photo-1572420054337-2cf7054ddd42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGZpc2glMjBtYXJrZXR8ZW58MXx8fHwxNzYxNjUzNjgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Premium dried seafood"
  },
  {
    id: 3,
    name: "Native Handicrafts",
    price: "₱650",
    town: "San Fernando",
    image: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNyYWZ0c3xlbnwxfHx8fDE3NjE1ODA0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Handmade artisan crafts"
  },
  {
    id: 4,
    name: "Woven Baskets",
    price: "₱350",
    town: "Naguilian",
    image: "https://images.unsplash.com/photo-1567696154083-9547fd0c8e1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3ZlbiUyMGJhc2tldHN8ZW58MXx8fHwxNzYxNjUzNjgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Traditional woven containers"
  },
  {
    id: 5,
    name: "Local Honey",
    price: "₱320",
    town: "Bauang",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784210?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Pure organic honey"
  },
  {
    id: 6,
    name: "Pottery & Ceramics",
    price: "₱580",
    town: "San Fernando",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Handcrafted pottery pieces"
  }
];

export function TopProducts() {
  return (
    <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4">Top Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our curated selection of authentic local products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer border-border"
            >
              <div className="relative h-56 overflow-hidden bg-muted">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-accent text-accent-foreground">
                    {product.town}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl">{product.name}</h3>
                  <ShoppingBag className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl text-primary">{product.price}</span>
                  <button className="text-primary hover:text-primary/80 transition-colors">
                    View Details →
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
