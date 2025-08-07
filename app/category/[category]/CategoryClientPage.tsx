"use client"
import { useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Product } from "@/contexts/cart-context"

interface CategoryClientPageProps {
  products: Product[]
  info: { title: string; description: string; image: string }
  category: string
}

export function CategoryClientPage({ products, info, category }: CategoryClientPageProps) {
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedGenders, setSelectedGenders] = useState<string[]>([])
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

  // Unique filter options
  const subcategoryOptions = Array.from(new Set(products.map(p => p.subcategory))).filter(Boolean)
  const brandOptions = Array.from(new Set(products.map(p => p.brand))).filter(Boolean)
  const genderOptions = category === "sportswear" ? Array.from(new Set(products.map(p => p.gender))).filter(Boolean) : []
  
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
  const metalTypeOptions = category === "jewellery" ? 
    Array.from(new Set(products.map(p => p.jewelleryAttributes?.metalType).filter((type): type is string => Boolean(type)))) : []
  const stoneTypeOptions = category === "jewellery" ? 
    Array.from(new Set(products.map(p => p.jewelleryAttributes?.stoneType).filter((type): type is string => Boolean(type)))) : []
  const materialOptions = category === "sportswear" ? 
    Array.from(new Set(products.map(p => p.sportswearAttributes?.material).filter((type): type is string => Boolean(type)))) : []
  const fitTypeOptions = category === "sportswear" ? 
    Array.from(new Set(products.map(p => p.sportswearAttributes?.fitType).filter((type): type is string => Boolean(type)))) : []
  const activityTypeOptions = category === "sportswear" ? 
    Array.from(new Set(products.map(p => p.sportswearAttributes?.activityType).filter((type): type is string => Boolean(type)))) : []

  // Filtering logic
  const filteredProducts = products.filter(product => {
    const matchesSubcategory = selectedSubcategories.length === 0 || selectedSubcategories.includes(product.subcategory)
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    const matchesGender = category !== "sportswear" || selectedGenders.length === 0 || selectedGenders.includes(product.gender)
    
    // Price filtering
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    
    // Attribute filtering for jewellery
    const matchesMetalType = category !== "jewellery" || selectedMetalTypes.length === 0 || 
      (product.jewelleryAttributes?.metalType && selectedMetalTypes.includes(product.jewelleryAttributes.metalType))
    const matchesStoneType = category !== "jewellery" || selectedStoneTypes.length === 0 || 
      (product.jewelleryAttributes?.stoneType && selectedStoneTypes.includes(product.jewelleryAttributes.stoneType))
    
    // Attribute filtering for sportswear
    const matchesMaterial = category !== "sportswear" || selectedMaterials.length === 0 || 
      (product.sportswearAttributes?.material && selectedMaterials.includes(product.sportswearAttributes.material))
    const matchesFitType = category !== "sportswear" || selectedFitTypes.length === 0 || 
      (product.sportswearAttributes?.fitType && selectedFitTypes.includes(product.sportswearAttributes.fitType))
    const matchesActivityType = category !== "sportswear" || selectedActivityTypes.length === 0 || 
      (product.sportswearAttributes?.activityType && selectedActivityTypes.includes(product.sportswearAttributes.activityType))
    
    return matchesSubcategory && matchesBrand && matchesGender && matchesPrice && 
           matchesMetalType && matchesStoneType && matchesMaterial && matchesFitType && matchesActivityType
  })

  return (
    <>
      <section className="py-16 px-2 sm:px-4">
        <div className="container mx-auto">
          <div className="flex flex-row gap-4 min-h-[60vh]">
            {/* Sidebar Filters */}
            <aside className="w-32 md:w-56 max-h-[80vh] overflow-y-auto flex-shrink-0 bg-white rounded-lg border p-2 md:p-4 shadow-sm text-xs md:text-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button className="text-sm text-primary font-semibold" onClick={() => {
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
              {/* Gender Filter for sportswear */}
              {category === "sportswear" && (
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
              )}
              
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
              {category === "jewellery" && (
                <>
                  {/* Metal Type Filter */}
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
                  
                  {/* Stone Type Filter */}
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
                </>
              )}
              
              {/* Sportswear Attributes */}
              {category === "sportswear" && (
                <>
                  {/* Material Filter */}
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
                  
                  {/* Fit Type Filter */}
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
                  
                  {/* Activity Type Filter */}
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
                </>
              )}
            </aside>
            {/* Product Grid */}
            <main className="flex-1 min-w-0">
              <div className="mb-4">
                <h2 className="font-playfair text-2xl font-bold">
                  {info.title} ({filteredProducts.length} items)
                </h2>
              </div>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto min-w-0">
                  {filteredProducts.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg font-medium mb-2">No products found</p>
                  <p className="text-muted-foreground">Check back soon for new arrivals!</p>
                </div>
              )}
            </main>
          </div>
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
    </>
  )
}