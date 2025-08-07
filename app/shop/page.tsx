"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
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
  
  // Price filtering
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [maxPrice, setMaxPrice] = useState(10000)
  
  // Attribute filtering
  const [selectedMetalTypes, setSelectedMetalTypes] = useState<string[]>([])
  const [selectedStoneTypes, setSelectedStoneTypes] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedFitTypes, setSelectedFitTypes] = useState<string[]>([])
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("name")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Unique filter options
  const categoryOptions = Array.from(new Set(products.map(p => p.category))).filter(Boolean)
  const subcategoryOptions = Array.from(new Set(products.map(p => p.subcategory))).filter(Boolean)
  const brandOptions = Array.from(new Set(products.map(p => p.brand))).filter(Boolean)
  const genderOptions = Array.from(new Set(products.map(p => p.gender))).filter(Boolean)
  
  // Price range calculation
  useState(() => {
    const prices = products.map(p => p.price).filter(Boolean)
    if (prices.length > 0) {
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      setMaxPrice(max)
      setPriceRange([min, max])
    }
  })
  
  // Attribute filter options
  const metalTypeOptions = Array.from(new Set(products.filter(p => p.category === 'jewellery').map(p => p.jewelleryAttributes?.metalType).filter((metalType): metalType is string => Boolean(metalType))))
  const stoneTypeOptions = Array.from(new Set(products.filter(p => p.category === 'jewellery').map(p => p.jewelleryAttributes?.stoneType).filter((stoneType): stoneType is string => Boolean(stoneType))))
  const materialOptions = Array.from(new Set(products.filter(p => p.category === 'sportswear').map(p => p.sportswearAttributes?.material).filter(Boolean))) as string[]
  const fitTypeOptions = Array.from(new Set(products.filter(p => p.category === 'sportswear').map(p => p.sportswearAttributes?.fitType).filter((fitType): fitType is string => Boolean(fitType))))
  const activityTypeOptions = Array.from(new Set(products.filter(p => p.category === 'sportswear').map(p => p.sportswearAttributes?.activityType).filter(Boolean))) as string[]

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
    
    // Price filtering
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    
    // Attribute filtering for jewellery
    const matchesMetalType = selectedMetalTypes.length === 0 || 
      (product.jewelleryAttributes?.metalType && selectedMetalTypes.includes(product.jewelleryAttributes.metalType))
    const matchesStoneType = selectedStoneTypes.length === 0 || 
      (product.jewelleryAttributes?.stoneType && selectedStoneTypes.includes(product.jewelleryAttributes.stoneType))
    
    // Attribute filtering for sportswear
    const matchesMaterial = selectedMaterials.length === 0 || 
      (product.sportswearAttributes?.material && selectedMaterials.includes(product.sportswearAttributes.material))
    const matchesFitType = selectedFitTypes.length === 0 || 
      (product.sportswearAttributes?.fitType && selectedFitTypes.includes(product.sportswearAttributes.fitType))
    const matchesActivityType = selectedActivityTypes.length === 0 || 
      (product.sportswearAttributes?.activityType && selectedActivityTypes.includes(product.sportswearAttributes.activityType))
    
    return matchesCategory && matchesSubcategory && matchesBrand && matchesGender && matchesPrice && 
           matchesMetalType && matchesStoneType && matchesMaterial && matchesFitType && matchesActivityType
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
                  setPriceRange([0, maxPrice])
                  setSelectedMetalTypes([])
                  setSelectedStoneTypes([])
                  setSelectedMaterials([])
                  setSelectedFitTypes([])
                  setSelectedActivityTypes([])
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
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <div className="font-semibold text-sm mb-2">Price Range</div>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    max={maxPrice}
                    min={0}
                    step={100}
                    className="w-full mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              {/* Jewellery Attributes */}
              {metalTypeOptions.length > 0 && (
                <div className="mb-6">
                  <div className="font-semibold text-sm mb-2">Metal Type</div>
                  {metalTypeOptions.map(metalType => (
                    <label key={metalType} className="flex items-center mb-1 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedMetalTypes.includes(metalType)}
                        onChange={() => setSelectedMetalTypes(selectedMetalTypes.includes(metalType)
                          ? selectedMetalTypes.filter(m => m !== metalType)
                          : [...selectedMetalTypes, metalType])}
                        className="mr-2"
                      />
                      {metalType} <span className="ml-1 text-muted-foreground">({products.filter(p => p.jewelleryAttributes?.metalType === metalType).length})</span>
                    </label>
                  ))}
                </div>
              )}
              
              {stoneTypeOptions.length > 0 && (
                <div className="mb-6">
                  <div className="font-semibold text-sm mb-2">Stone Type</div>
                  {stoneTypeOptions.map(stoneType => (
                    <label key={stoneType} className="flex items-center mb-1 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedStoneTypes.includes(stoneType)}
                        onChange={() => setSelectedStoneTypes(selectedStoneTypes.includes(stoneType)
                          ? selectedStoneTypes.filter(s => s !== stoneType)
                          : [...selectedStoneTypes, stoneType])}
                        className="mr-2"
                      />
                      {stoneType} <span className="ml-1 text-muted-foreground">({products.filter(p => p.jewelleryAttributes?.stoneType === stoneType).length})</span>
                    </label>
                  ))}
                </div>
              )}
              
              {/* Sportswear Attributes */}
              {materialOptions.length > 0 && (
                <div className="mb-6">
                  <div className="font-semibold text-sm mb-2">Material</div>
                  {materialOptions.map(material => (
                    <label key={material} className="flex items-center mb-1 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(material)}
                        onChange={() => setSelectedMaterials(selectedMaterials.includes(material)
                          ? selectedMaterials.filter(m => m !== material)
                          : [...selectedMaterials, material])}
                        className="mr-2"
                      />
                      {material} <span className="ml-1 text-muted-foreground">({products.filter(p => p.sportswearAttributes?.material === material).length})</span>
                    </label>
                  ))}
                </div>
              )}
              
              {fitTypeOptions.length > 0 && (
                <div className="mb-6">
                  <div className="font-semibold text-sm mb-2">Fit Type</div>
                  {fitTypeOptions.map(fitType => (
                    <label key={fitType} className="flex items-center mb-1 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedFitTypes.includes(fitType)}
                        onChange={() => setSelectedFitTypes(selectedFitTypes.includes(fitType)
                          ? selectedFitTypes.filter(f => f !== fitType)
                          : [...selectedFitTypes, fitType])}
                        className="mr-2"
                      />
                      {fitType} <span className="ml-1 text-muted-foreground">({products.filter(p => p.sportswearAttributes?.fitType === fitType).length})</span>
                    </label>
                  ))}
                </div>
              )}
              
              {activityTypeOptions.length > 0 && (
                <div className="mb-6">
                  <div className="font-semibold text-sm mb-2">Activity Type</div>
                  {activityTypeOptions.map(activityType => (
                    <label key={activityType} className="flex items-center mb-1 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedActivityTypes.includes(activityType)}
                        onChange={() => setSelectedActivityTypes(selectedActivityTypes.includes(activityType)
                          ? selectedActivityTypes.filter(a => a !== activityType)
                          : [...selectedActivityTypes, activityType])}
                        className="mr-2"
                      />
                      {activityType} <span className="ml-1 text-muted-foreground">({products.filter(p => p.sportswearAttributes?.activityType === activityType).length})</span>
                    </label>
                  ))}
                </div>
              )}
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
