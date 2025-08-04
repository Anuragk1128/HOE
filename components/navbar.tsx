"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingBag, Menu, X, User, Home, ShoppingCart, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { CartSidebar } from "@/components/cart-sidebar"
import { useAuth } from "@/contexts/auth-context";
import { getLogoImage } from "@/lib/website-images-service";

const categories = [
  { name: "All Products", path: "/shop" },
  { name: "Jewellery", path: "/category/jewellery" },
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
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`
    }
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMenuOpen && !target.closest('nav')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 min-w-0">
              {/* Logo Image - Required: 48x48px (1:1 ratio) - scales from 28px to 48px - Responsive */}
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10">
                <Image
                  src={logoImage} 
                  alt="House of Evolve Logo" 
                  fill
                  sizes="(max-width: 640px) 28px, (max-width: 768px) 32px, (max-width: 1024px) 36px, 40px"
                  className="object-contain" 
                  priority
                />
              </div>
              <span className="font-playfair text-sm sm:text-base md:text-lg lg:text-xl font-bold text-primary truncate">
                House of Evolve
              </span>
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.path}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary whitespace-nowrap"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-3">
              {/* Search - Hidden on very small screens, shown on sm+ */}
              <form onSubmit={handleSearch} className="hidden sm:flex lg:flex">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] pl-8 text-sm h-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>

              {/* Cart Button */}
              <Button variant="ghost" size="sm" onClick={toggleCart} className="relative h-8 w-8 p-0">
                <ShoppingBag className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge variant="destructive" className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* Profile/Auth Links - Responsive text */}
              {user ? (
                <Link 
                  href="/profile" 
                  className="hidden sm:inline-flex items-center space-x-1 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden md:inline">Profile</span>
                </Link>
              ) : (
                <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm">
                  <Link href="/login" className="font-medium text-muted-foreground hover:text-primary">
                    Login
                  </Link>
                  <span className="text-muted-foreground">|</span>
                  <Link href="/register" className="font-medium text-muted-foreground hover:text-primary">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden h-8 w-8 p-0" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation - Enhanced */}
          {isMenuOpen && (
            <div className="border-t py-4 lg:hidden bg-background/95 backdrop-blur">
              <div className="flex flex-col space-y-4">
                {/* Mobile Search - Always visible in mobile menu */}
                <form onSubmit={handleSearch} className="px-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-10 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>

                {/* Mobile Categories */}
                <div className="px-2 space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.path}
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-muted/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>{category.name}</span>
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Links */}
                <div className="border-t pt-4 px-2">
                  {user ? (
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-muted/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserIcon className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link
                        href="/login"
                        className="flex items-center space-x-3 py-2 px-3 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-muted/50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>Login</span>
                      </Link>
                      <Link
                        href="/register"
                        className="flex items-center space-x-3 py-2 px-3 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-muted/50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>Sign Up</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      <CartSidebar />
    </>
  )
}
