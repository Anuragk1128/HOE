"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ShoppingBag, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { CartSidebar } from "@/components/cart-sidebar"
import { useAuth } from "@/contexts/auth-context";
import { getLogoImage } from "@/lib/website-images-service";

const categories = [
  { name: "All Products", path: "/shop" },
          { name: "Jewelry", path: "/category/jewellery" },
  { name: "Sportswear", path: "/category/sportswear" },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [logoImage, setLogoImage] = useState<string>("/images/icons/logo.png")
  const { totalItems, toggleCart } = useCart()
  const { user } = useAuth();

  // Fetch logo image on component mount
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const logo = await getLogoImage();
        if (logo) {
          setLogoImage(logo.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <img src={logoImage} alt="House of Evolve Logo" className="h-14 w-14 object-contain" />
              <span className="font-playfair text-xl font-bold text-primary">House of Evolve</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.path}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Search and Cart */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden sm:flex">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-[200px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>

              {/* Cart */}
              <Button variant="ghost" size="icon" onClick={toggleCart} className="relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge variant="destructive" className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
              {/* Profile Link */}
              {user ? (
                <Link href="/profile" className="ml-2 text-sm font-medium text-muted-foreground hover:text-primary">
                  Profile
                </Link>
              ) : (
                <div className="ml-2 flex items-center gap-2">
                  <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
                    Login
                  </Link>
                  <span className="text-muted-foreground">|</span>
                  <Link href="/register" className="text-sm font-medium text-muted-foreground hover:text-primary">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="border-t py-4 md:hidden">
              <div className="flex flex-col space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="sm:hidden">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>

                {/* Mobile Categories */}
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.path}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
      <CartSidebar />
    </>
  )
}
