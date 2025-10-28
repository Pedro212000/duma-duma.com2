import { Heart, Users, Store } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-6">About LocalTreasure</h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            LocalTreasure is dedicated to promoting and preserving the rich cultural heritage of La Union. 
            We connect local artisans, farmers, and producers with customers who appreciate authentic, 
            handcrafted goods. By supporting local businesses, we help sustain traditional crafts, 
            boost the local economy, and celebrate the unique identity of each town in our province.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
              <Heart className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="mb-2">Support Local</h3>
            <p className="text-muted-foreground">
              Every purchase directly supports local families and their livelihoods
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
              <Store className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="mb-2">Authentic Products</h3>
            <p className="text-muted-foreground">
              Handpicked genuine products that showcase local craftsmanship
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4">
              <Users className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="mb-2">Community First</h3>
            <p className="text-muted-foreground">
              Building a stronger community through local commerce and culture
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
