
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CategoryHeroCarousel } from "@/components/category-hero-carousel"
import { fetchProductsByCategory } from "@/lib/products-service"
import { getAllCategoryImages } from "@/lib/website-images-service"
import type { Product } from "@/contexts/cart-context"
import { CategoryClientPage } from "./CategoryClientPage"

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
    title: "",
    description: "",
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
        <CategoryHeroCarousel 
          images={categoryImages}
          title={info.title}
          description={info.description}
          category={category}
        />
        <CategoryClientPage
          products={products}
          info={info}
          category={category}
        />
      </div>
      <Footer />
    </div>
  )
}
