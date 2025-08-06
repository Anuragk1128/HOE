"use client"
import { useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
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

  // Unique filter options
  const subcategoryOptions = Array.from(new Set(products.map(p => p.subcategory))).filter(Boolean)
  const brandOptions = Array.from(new Set(products.map(p => p.brand))).filter(Boolean)
  const genderOptions = category === "sportswear" ? Array.from(new Set(products.map(p => p.gender))).filter(Boolean) : []

  // Filtering logic
  const filteredProducts = products.filter(product => {
    const matchesSubcategory = selectedSubcategories.length === 0 || selectedSubcategories.includes(product.subcategory)
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    const matchesGender = category !== "sportswear" || selectedGenders.length === 0 || selectedGenders.includes(product.gender)
    return matchesSubcategory && matchesBrand && matchesGender
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