"use client"

import { useState, useMemo, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2 } from "lucide-react"
import { getProductsWithFilters } from "@/lib/products-service"
import type { Product } from "@/contexts/cart-context"

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const categories = ["all", "jewellery", "sportswear"]

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError("")
        
        const params: {
          category?: string;
          search?: string;
          sort?: string;
        } = {}
        
        if (selectedCategory !== "all") {
          params.category = selectedCategory
        }
        
        if (searchQuery) {
          params.search = searchQuery
        }
        
        if (sortBy) {
          params.sort = sortBy
        }
        
        const fetchedProducts = await getProductsWithFilters(params)
        setProducts(fetchedProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("Failed to load products. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchQuery, selectedCategory, sortBy])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-playfair text-3xl font-bold mb-4">Shop All Products</h1>
            <p className="text-muted-foreground">
              Discover our complete collection of sustainable and stylish products
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-destructive">
                  ×
                </button>
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-destructive">
                  ×
                </button>
              </Badge>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {products.length} products
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-lg">Loading products...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-lg font-medium mb-2 text-red-600">Error loading products</p>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSortBy("name")
                }}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* No Products State */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSortBy("name")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
