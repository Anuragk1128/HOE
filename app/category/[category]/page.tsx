import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { CategoryHeroCarousel } from "@/components/category-hero-carousel"
import { fetchProductsByCategory } from "@/lib/products-service"
import { getAllCategoryImages } from "@/lib/website-images-service"
import type { Product } from "@/contexts/cart-context"

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

const categoryInfo = {
  jewellery: {
    title: "Jewellery Collection",
    description:
      "Discover our ethically crafted jewellerry collection featuring sustainable materials and timeless designs.",
    image: "/images/jwl.jpeg",
  },
  sportswear: {
    title: "Sportswear Collection",
    description: "Sustainable athletic wear designed for performance and comfort, made from eco-friendly materials.",
    image: "/images/sprtwer.jpeg",
  },
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params

  if (!categoryInfo[category as keyof typeof categoryInfo]) {
    notFound()
  }

  const info = categoryInfo[category as keyof typeof categoryInfo]

  // Fetch products and images for this category
  let products: Product[] = []
  let categoryImages: string[] = [info.image] // Start with default image

  try {
    // Fetch products
    products = await fetchProductsByCategory(category)
    
    // Fetch all category images
    const images = await getAllCategoryImages(category)
    if (images.length > 0) {
      categoryImages = images.map(img => img.imageUrl)
    }
  } catch (error) {
    console.error("Error loading category data:", error)
    // Continue with empty products array
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Category Hero Carousel */}
        <CategoryHeroCarousel 
          images={categoryImages}
          title={info.title}
          description={info.description}
          category={category}
        />

        {/* Products Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h2 className="font-playfair text-2xl font-bold">
                  {info.title} ({products.length} items)
                </h2>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg font-medium mb-2">No products found</p>
                <p className="text-muted-foreground">Check back soon for new arrivals!</p>
              </div>
            )}
          </div>
        </section>

        {/* Category Features */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
                <p className="text-muted-foreground">
                  {category === "jewellery"
                    ? "Handcrafted with the finest sustainable materials"
                    : "High-performance fabrics designed for active lifestyles"}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Sustainable</h3>
                <p className="text-muted-foreground">
                  {category === "jewellery"
                    ? "Ethically sourced materials and responsible production"
                    : "Made from recycled and organic materials"}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Timeless Design</h3>
                <p className="text-muted-foreground">
                  {category === "jewellery"
                    ? "Classic pieces that never go out of style"
                    : "Versatile designs for both workout and casual wear"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
