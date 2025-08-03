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

          <div>
            <p className="text-muted-foreground mb-4">{product.description}</p>
            {product.details && <p className="text-sm text-muted-foreground">{product.details}</p>}
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
