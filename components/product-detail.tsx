"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import type { Product } from "@/contexts/cart-context"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border bg-muted relative">
            {/* Product Detail Image - Required: 800x800px (1:1 ratio) - Responsive */}
            <Image 
              src={product.image || "/placeholder.svg"} 
              alt={product.name} 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover" 
              priority
              quality={85}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2 capitalize">
              {product.category}
            </Badge>
            <h1 className="font-playfair text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary">{formatPrice(product.price)}</p>
          </div>

          {/* Category-specific specifications */}
          {product.category === 'jewellery' && product.jewelleryAttributes && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Jewellery Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.jewelleryAttributes.metalType && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Metal Type:</span>
                    <p className="text-sm">
                      {product.jewelleryAttributes.metalType}
                      {product.jewelleryAttributes.purity && ` (${product.jewelleryAttributes.purity})`}
                    </p>
                  </div>
                )}
                {product.jewelleryAttributes.stoneType && product.jewelleryAttributes.stoneType !== 'None' && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Stone Type:</span>
                    <p className="text-sm">
                      {product.jewelleryAttributes.stoneType}
                      {product.jewelleryAttributes.stoneQuality && ` (${product.jewelleryAttributes.stoneQuality})`}
                    </p>
                  </div>
                )}
                {product.jewelleryAttributes.weight && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Weight:</span>
                    <p className="text-sm">{product.jewelleryAttributes.weight}g</p>
                  </div>
                )}
                {product.jewelleryAttributes.designStyle && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Design Style:</span>
                    <p className="text-sm">{product.jewelleryAttributes.designStyle}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {product.category === 'sportswear' && product.sportswearAttributes && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sportswear Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.sportswearAttributes.material && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Material:</span>
                    <p className="text-sm">{product.sportswearAttributes.material}</p>
                  </div>
                )}
                {product.sportswearAttributes.fitType && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Fit Type:</span>
                    <p className="text-sm">{product.sportswearAttributes.fitType}</p>
                  </div>
                )}
                {product.sportswearAttributes.activityType && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Activity Type:</span>
                    <p className="text-sm">{product.sportswearAttributes.activityType}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <p className="text-muted-foreground mb-4">{product.description}</p>
          </div>

          <Separator />

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button onClick={handleAddToCart} className="w-full" size="lg">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
