"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { fetchProducts } from "@/lib/products-service"
import { getHeroImage, getCategoryImage } from "@/lib/website-images-service"
import type { Product } from "@/contexts/cart-context"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [heroImage, setHeroImage] = useState("/images/hero-bg.png")
  const [sportswearImage, setSportswearImage] = useState("/images/sportwer.jpeg")
  const [jewelryImage, setJewelryImage] = useState("/images/jewel.png")

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    setIsLoaded(true)

    // Parallax scroll effect
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch featured products and images
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Fetch products
        const allProducts = await fetchProducts()
        setFeaturedProducts(allProducts.slice(0, 4))
        
        // Fetch images
        const [hero, sportswear, jewelry] = await Promise.all([
          getHeroImage(),
          getCategoryImage("sportswear"),
          getCategoryImage("jewellery")
        ]);
        
        if (hero) setHeroImage(hero.imageUrl);
        if (sportswear) setSportswearImage(sportswear.imageUrl);
        if (jewelry) setJewelryImage(jewelry.imageUrl);
        
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section with Parallax and Fade-in Effects */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <img
            src={heroImage}
            alt="House of Evolve Hero"
            className="h-[120%] w-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div
          className={`relative z-10 text-center text-white px-4 transition-all duration-1000 ease-out ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1
            className={`font-playfair text-4xl md:text-6xl font-bold mb-4 transition-all duration-1200 ease-out delay-200 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Welcome to House of Evolve
          </h1>
          <p
            className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90 transition-all duration-1200 ease-out delay-400 ${
              isLoaded ? "opacity-90 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Modern lifestyle brand committed to sustainability, conscious living, and minimalist elegance.
          </p>
          <div
            className={`transition-all duration-1200 ease-out delay-600 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Rest of the sections remain the same */}
      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="font-playfair text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg">
              <Link href="/category/sportswear">
                <CardContent className="p-0">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={sportswearImage}
                      alt="Sportswear"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="font-playfair text-2xl font-bold mb-2">Sportswear</h3>
                        <p className="text-sm opacity-90">Sustainable athletic wear</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg">
              <Link href="/category/jewellery">
                <CardContent className="p-0">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={jewelryImage}
                      alt="Jewelry"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="font-playfair text-2xl font-bold mb-2">Jewelry</h3>
                        <p className="text-sm opacity-90">Ethically crafted accessories</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully curated selection of sustainable and stylish products
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading featured products...</span>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products available at the moment.</p>
            </div>
          )}

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything we do is guided by our commitment to sustainability and ethical practices
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Sustainable</h3>
              <p className="text-muted-foreground">
                All our products are made with eco-friendly materials and processes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality</h3>
              <p className="text-muted-foreground">
                We believe in creating products that last, reducing waste and maximizing value
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Ethical</h3>
              <p className="text-muted-foreground">
                Fair trade practices and ethical sourcing are at the heart of our business
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
