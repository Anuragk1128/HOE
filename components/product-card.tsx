"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Heart } from "lucide-react"
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
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();

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

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Link href={`/product/${product.id}`}>
            {/* Product Image - Required: 600x600px (1:1 ratio) - Responsive */}
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              quality={75}
            />
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
            <h3 className="font-medium text-sm mb-1 hover:text-primary transition-colors">{product.name}</h3>
          </Link>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
          <p className="font-semibold text-primary">{formatPrice(product.price)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
