"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { getProductsWithFilters } from "@/lib/products-service"
import type { Product } from "@/contexts/cart-context"

export default function Shop() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedGenders, setSelectedGenders] = useState<string[]>([])
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [showAllSubcategories, setShowAllSubcategories] = useState(false)
  const [showAllBrands, setShowAllBrands] = useState(false)
  const [showAllGenders, setShowAllGenders] = useState(false)
  const [sortBy, setSortBy] = useState("name")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Unique filter options
  const categoryOptions = Array.from(new Set(products.map(p => p.category))).filter(Boolean)
  const subcategoryOptions = Array.from(new Set(products.map(p => p.subcategory))).filter(Boolean)
  const brandOptions = Array.from(new Set(products.map(p => p.brand))).filter(Boolean)
  const genderOptions = Array.from(new Set(products.map(p => p.gender))).filter(Boolean)

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError("")
        const params: { search?: string; sort?: string } = {}
        if (searchQuery) params.search = searchQuery
        if (sortBy) params.sort = sortBy
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
  }, [searchQuery, sortBy])

  // Filtering logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
    const matchesSubcategory = selectedSubcategories.length === 0 || selectedSubcategories.includes(product.subcategory)
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    const matchesGender = selectedGenders.length === 0 || selectedGenders.includes(product.gender)
    return matchesCategory && matchesSubcategory && matchesBrand && matchesGender
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <div className="container mx-auto px-2 sm:px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-playfair text-3xl font-bold mb-4">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Shop All Products"}
            </h1>
            <p className="text-muted-foreground">
              {searchQuery 
                ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} matching your search`
                : "Discover our complete collection of sustainable and stylish products"
              }
            </p>
          </div>

          {/* Main Content: Sidebar + Grid */}
          <div className="flex flex-row gap-4 min-h-[60vh]">
            {/* Sidebar Filters */}
            <aside className="w-32 md:w-56 max-h-[80vh] overflow-y-auto flex-shrink-0 bg-white rounded-lg border p-2 md:p-4 shadow-sm text-xs md:text-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button className="text-sm text-primary font-semibold" onClick={() => {
                  setSelectedCategories([])
                  setSelectedSubcategories([])
                  setSelectedBrands([])
                  setSelectedGenders([])
                }}>CLEAR ALL</button>
              </div>
              {/* Category Filter */}
              <div className="mb-6">
                <div className="font-semibold text-sm mb-2">Category</div>
                {(showAllCategories ? categoryOptions : categoryOptions.slice(0, 5)).map(cat => (
                  <label key={cat} className="flex items-center mb-1 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => setSelectedCategories(selectedCategories.includes(cat)
                        ? selectedCategories.filter(c => c !== cat)
                        : [...selectedCategories, cat])}
                      className="mr-2"
                    />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)} <span className="ml-1 text-muted-foreground">({products.filter(p => p.category === cat).length})</span>
                  </label>
                ))}
                {categoryOptions.length > 5 && (
                  <button className="text-xs text-primary mt-1" onClick={() => setShowAllCategories(v => !v)}>
                    {showAllCategories ? 'Show Less' : `\t${categoryOptions.length - 5} More`}
                  </button>
                )}
            </div>
              {/* Subcategory Filter */}
              <div className="mb-6">
                <div className="font-semibold text-sm mb-2">Subcategory</div>
                {(showAllSubcategories ? subcategoryOptions : subcategoryOptions.slice(0, 5)).map(sub => (
                  <label key={sub} className="flex items-center mb-1 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={selectedSubcategories.includes(sub)}
                      onChange={() => setSelectedSubcategories(selectedSubcategories.includes(sub)
                        ? selectedSubcategories.filter(s => s !== sub)
                        : [...selectedSubcategories, sub])}
                      className="mr-2"
                    />
                    {sub} <span className="ml-1 text-muted-foreground">({products.filter(p => p.subcategory === sub).length})</span>
                  </label>
                ))}
                {subcategoryOptions.length > 5 && (
                  <button className="text-xs text-primary mt-1" onClick={() => setShowAllSubcategories(v => !v)}>
                    {showAllSubcategories ? 'Show Less' : `\t${subcategoryOptions.length - 5} More`}
                  </button>
                )}
          </div>
              {/* Brand Filter */}
              <div className="mb-6">
                <div className="font-semibold text-sm mb-2">Brand</div>
                {(showAllBrands ? brandOptions : brandOptions.slice(0, 5)).map(brand => (
                  <label key={brand} className="flex items-center mb-1 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => setSelectedBrands(selectedBrands.includes(brand)
                        ? selectedBrands.filter(b => b !== brand)
                        : [...selectedBrands, brand])}
                      className="mr-2"
                    />
                    {brand} <span className="ml-1 text-muted-foreground">({products.filter(p => p.brand === brand).length})</span>
                  </label>
                ))}
                {brandOptions.length > 5 && (
                  <button className="text-xs text-primary mt-1" onClick={() => setShowAllBrands(v => !v)}>
                    {showAllBrands ? 'Show Less' : `\t${brandOptions.length - 5} More`}
                </button>
                )}
              </div>
              {/* Gender Filter */}
              <div className="mb-6">
                <div className="font-semibold text-sm mb-2">Gender</div>
                {(showAllGenders ? genderOptions : genderOptions.slice(0, 5)).map(gender => (
                  <label key={gender} className="flex items-center mb-1 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={selectedGenders.includes(gender)}
                      onChange={() => setSelectedGenders(selectedGenders.includes(gender)
                        ? selectedGenders.filter(g => g !== gender)
                        : [...selectedGenders, gender])}
                      className="mr-2"
                    />
                    {gender.charAt(0).toUpperCase() + gender.slice(1)} <span className="ml-1 text-muted-foreground">({products.filter(p => p.gender === gender).length})</span>
                  </label>
                ))}
                {genderOptions.length > 5 && (
                  <button className="text-xs text-primary mt-1" onClick={() => setShowAllGenders(v => !v)}>
                    {showAllGenders ? 'Show Less' : `\t${genderOptions.length - 5} More`}
                </button>
            )}
          </div>
            </aside>
            {/* Product Grid */}
            <main className="flex-1 min-w-0">
              {/* Search Bar */}
              <div className="mb-6">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
          {/* Results Count */}
              <div className="mb-4">
            <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} products
            </p>
          </div>
              {/* Products Grid */}
              {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-lg">Loading products...</span>
            </div>
              ) : error ? (
            <div className="text-center py-12">
              <p className="text-lg font-medium mb-2 text-red-600">Error loading products</p>
              <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={() => { setSearchQuery(""); setSelectedCategories([]); setSortBy("name"); }}>Try Again</Button>
            </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto min-w-0">
                  {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
              ) : (
            <div className="text-center py-12">
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
                  <Button onClick={() => { setSearchQuery(""); setSelectedCategories([]); setSelectedSubcategories([]); setSelectedBrands([]); setSelectedGenders([]); setSortBy("name"); }}>Clear Filters</Button>
            </div>
          )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
