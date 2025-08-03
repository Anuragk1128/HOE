import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Badge } from "@/components/ui/badge"
import { fetchProductsByCategory } from "@/lib/products-service"
import { getCategoryImage } from "@/lib/website-images-service"
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

  // Fetch products and image for this category
  let products: Product[] = []
  let categoryImage = info.image

  try {
    // Fetch products
    products = await fetchProductsByCategory(category)
    
    // Fetch category image
    const image = await getCategoryImage(category)
    if (image) {
      categoryImage = image.imageUrl
    }
  } catch (error) {
    console.error("Error loading category data:", error)
    // Continue with empty products array
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Category Hero */}
        <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            {/* Category Hero Image - Required: 1200x600px (2:1 ratio) */}
            <img src={categoryImage || "/placeholder.svg"} alt={info.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative z-10 text-center text-white px-4">
            <Badge variant="secondary" className="mb-4 capitalize bg-white/20 text-white border-white/30">
              {category}
            </Badge>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">{info.title}</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">{info.description}</p>
          </div>
        </section>

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
