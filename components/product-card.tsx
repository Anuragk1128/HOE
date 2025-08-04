"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/contexts/cart-context"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Get all images for the product (assuming product has multiple images)
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : ["/placeholder.svg"];

  const handleAddToCart = () => {
    if (!user) {
      router.push("/register");
      return;
    }
    addItem(product);
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Link href={`/product/${product.id}`}>
            {/* Product Image with Swipe Navigation */}
            {/* 
              IMAGE REQUIREMENTS:
              - Size: 600x600px (1:1 square ratio)
              - Format: JPG, PNG, WebP
              - Quality: High resolution (at least 600px width)
              - Background: White or transparent
              - Product should be centered and well-lit
              - For jewellery: Show product clearly with good lighting
              - For sportswear: Show product on white background
            */}
            <div className="relative w-full h-full">
              <Image
                src={productImages[currentImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                quality={75}
              />
              
              {/* Image Navigation Arrows - Only show if multiple images */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      prevImage();
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      nextImage();
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  
                  {/* Image Dots Indicator */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {productImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentImageIndex(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? 'bg-white' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </Link>

          {/* Category Badge */}
          <Badge variant="secondary" className="absolute left-2 top-2 capitalize">
            {product.category}
          </Badge>

          {/* Action Buttons */}
          <div
            className={`absolute right-2 top-2 flex flex-col gap-2 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <div
            className={`absolute bottom-2 left-2 right-2 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button onClick={handleAddToCart} className="w-full" size="sm">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>

        <div className="p-4">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-sm mb-1 hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
          </Link>
          
          {/* Brand name - show with fallback for existing sportswear products */}
          {(product.brand && product.brand.trim()) || (product.category === 'sportswear' && (!product.brand?.trim() || product.brand === 'Jersermise')) ? (
            <p className="text-xs text-muted-foreground mb-2 capitalize">
              {product.brand && product.brand.trim() && product.brand !== 'Jersermise' ? product.brand : 'Jerseymise'}
            </p>
          ) : null}
          
          {/* Only show price */}
          <p className="font-bold text-primary text-lg">{formatPrice(product.price)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
