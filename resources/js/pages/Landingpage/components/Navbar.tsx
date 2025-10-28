import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { SharedData } from "@/types";

export function Navbar() {
  const { auth } = usePage<SharedData>().props;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-card z-50 border-b border-border shadow-sm">
      {auth.user ? (
        <Link
          href={route('publisher.dashboard')}
          className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
        >
          Dashboard
        </Link>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h2 className="text-primary">LocalTreasure</h2>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {["home", "places", "products", "about", "contact"].map((id) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" onClick={() => window.location.href = "/login"}>
                Login
              </Button>
              <Button onClick={() => window.location.href = "/register"}>Register</Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-4 py-4 space-y-3">
            {["home", "places", "products", "about", "contact"].map((id) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}

            <div className="pt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = "/login"}
              >
                Login
              </Button>
              <Button
                className="w-full"
                onClick={() => window.location.href = "/register"}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
