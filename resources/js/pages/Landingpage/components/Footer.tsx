import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-primary text-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl mb-4">LocalTreasure</h3>
            <p className="text-primary-foreground/80 mb-4">
              Connecting you with the authentic flavors and crafts of La Union
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById("home");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-accent transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById("places");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-accent transition-colors"
                >
                  Explore Places
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById("products");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-accent transition-colors"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById("about");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-accent transition-colors"
                >
                  About
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4">Contact Us</h4>
            <ul className="space-y-3 text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>San Fernando City, La Union, Philippines</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+63 912 345 6789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>hello@localtreasure.ph</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/80">
          <p>© {currentYear} LocalTreasure. All rights reserved. Made with love in La Union.</p>
        </div>
      </div>
    </footer>
  );
}
