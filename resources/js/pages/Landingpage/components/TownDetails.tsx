import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowLeft, MapPin, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";


// Data for each town's products and places
const townData = {
  Naguilian: {
    products: [
      {
        id: 1,
        name: "Fresh Oranges",
        description: "Sweet and juicy oranges from local farms",
        image: "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400"
      },
      {
        id: 2,
        name: "Traditional Baskets",
        description: "Handwoven baskets made by local artisans",
        image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400"
      },
      {
        id: 3,
        name: "Local Honey",
        description: "Pure organic honey from mountain apiaries",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784990?w=400"
      },
      {
        id: 4,
        name: "Rice Cakes",
        description: "Traditional Filipino rice cakes and delicacies",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400"
      },
      {
        id: 5,
        name: "Coffee Beans",
        description: "Locally grown and roasted Arabica coffee",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400"
      },
      {
        id: 6,
        name: "Pottery",
        description: "Handcrafted clay pots and decorative items",
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400"
      }
    ],
    places: [
      {
        id: 1,
        name: "Naguilian Public Market",
        image: "https://images.unsplash.com/photo-1555529211-43e2f5c02c3f?w=400"
      },
      {
        id: 2,
        name: "Mountain View Farm",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400"
      },
      {
        id: 3,
        name: "Heritage Church",
        image: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=400"
      },
      {
        id: 4,
        name: "Rice Terraces Trail",
        image: "https://images.unsplash.com/photo-1536147210925-8c8ff5538d13?w=400"
      }
    ]
  },
  Bauang: {
    products: [
      {
        id: 1,
        name: "Fresh Seafood",
        description: "Daily catch from local fishermen",
        image: "https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=400"
      },
      {
        id: 2,
        name: "Dried Fish",
        description: "Traditionally sun-dried fish delicacy",
        image: "https://images.unsplash.com/photo-1580959375944-535986beb3f5?w=400"
      },
      {
        id: 3,
        name: "Bagoong",
        description: "Traditional fermented fish paste",
        image: "https://images.unsplash.com/photo-1601314002592-47eba007c229?w=400"
      },
      {
        id: 4,
        name: "Shell Crafts",
        description: "Beautiful handmade shell decorations",
        image: "https://images.unsplash.com/photo-1583225173851-ce43c8e50c5a?w=400"
      },
      {
        id: 5,
        name: "Beach Snacks",
        description: "Local street food and beach treats",
        image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400"
      },
      {
        id: 6,
        name: "Coconut Products",
        description: "Fresh coconut oil, water, and sweets",
        image: "https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=400"
      }
    ],
    places: [
      {
        id: 1,
        name: "Bauang Beach",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400"
      },
      {
        id: 2,
        name: "Fisherman's Wharf",
        image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400"
      },
      {
        id: 3,
        name: "Coastal Park",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
      },
      {
        id: 4,
        name: "Sunset Point",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400"
      }
    ]
  },
  "San Fernando": {
    products: [
      {
        id: 1,
        name: "Handwoven Textiles",
        description: "Traditional fabrics and clothing",
        image: "https://images.unsplash.com/photo-1558769132-cb1aea1c8f22?w=400"
      },
      {
        id: 2,
        name: "Pottery & Ceramics",
        description: "Artisan-made ceramics and vases",
        image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400"
      },
      {
        id: 3,
        name: "Fresh Produce",
        description: "Farm-fresh vegetables and fruits",
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400"
      },
      {
        id: 4,
        name: "Local Delicacies",
        description: "Traditional sweets and pastries",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400"
      },
      {
        id: 5,
        name: "Wood Crafts",
        description: "Hand-carved wooden souvenirs",
        image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400"
      },
      {
        id: 6,
        name: "Street Food",
        description: "Famous local street food specialties",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400"
      }
    ],
    places: [
      {
        id: 1,
        name: "Central Market",
        image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=400"
      },
      {
        id: 2,
        name: "City Plaza",
        image: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=400"
      },
      {
        id: 3,
        name: "Artisan District",
        image: "https://images.unsplash.com/photo-1561553590-267fc716698a?w=400"
      },
      {
        id: 4,
        name: "Botanical Garden",
        image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400"
      }
    ]
  }
};

interface TownDetailsProps {
  townName: string;
  onBack: () => void;
}

export function TownDetails({ townName, onBack }: TownDetailsProps) {
  const data = townData[townName as keyof typeof townData];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Town not found</h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-6 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center gap-3">
            <MapPin className="w-10 h-10" />
            <h1 className="text-4xl sm:text-5xl">{townName}</h1>
          </div>
          <p className="mt-4 text-primary-foreground/90">
            Discover the unique products and places of {townName}
          </p>
        </div>
      </div>

      {/* Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="w-8 h-8 text-primary" />
            <h2 className="text-3xl">Local Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border h-full">
                  <div className="relative h-56 overflow-hidden">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl mb-2">{product.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {product.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Places Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <MapPin className="w-8 h-8 text-primary" />
            <h2 className="text-3xl">Local Attractions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.places.map((place, index) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
              >
                <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border">
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white">{place.name}</h3>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
