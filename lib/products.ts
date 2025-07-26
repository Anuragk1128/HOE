import type { Product } from "@/contexts/cart-context"

export const products: Product[] = [
  {
    id: 1,
    name: "Eco Tote Bag",
    price: 799,
    image: "/images/products/eco-tote-bag.png",
    category: "sportswear",
    description: "A sustainable tote bag for everyday use. Durable, stylish, and eco-friendly.",
    details: "Size: 40x35cm. Material: Organic cotton. Perfect for shopping, gym, or daily activities.",
  },
  {
    id: 2,
    name: "Minimalist Necklace",
    price: 1299,
    image: "/images/products/minimalist-necklace.png",
    category: "jewelry",
    description: "A minimalist necklace for a touch of elegance. Ethically made.",
    details: "Material: Recycled silver. Length: 45cm. Hypoallergenic and tarnish-resistant.",
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    price: 899,
    image: "/images/products/organic-cotton-tshirt.png",
    category: "sportswear",
    description: "Comfortable organic cotton t-shirt perfect for workouts or casual wear.",
    details: "100% organic cotton. Available in multiple colors. Machine washable.",
  },
  {
    id: 4,
    name: "Recycled Gold Earrings",
    price: 1599,
    image: "/images/products/recycled-gold-earrings.png",
    category: "jewelry",
    description: "Beautiful earrings made from recycled gold. Sustainable luxury.",
    details: "Material: 14k recycled gold. Nickel-free. Comes with eco-friendly packaging.",
  },
  {
    id: 5,
    name: "Bamboo Yoga Mat",
    price: 1199,
    image: "/images/products/bamboo-yoga-mat.png",
    category: "sportswear",
    description: "Premium bamboo yoga mat for your practice. Non-slip and eco-friendly.",
    details: "Size: 183x61cm. Thickness: 6mm. Made from sustainable bamboo fiber.",
  },
  {
    id: 6,
    name: "Sustainable Watch",
    price: 2499,
    image: "/images/products/sustainable-watch.png",
    category: "jewelry",
    description: "Elegant watch made from sustainable materials. Timeless design.",
    details: "Case: Reclaimed wood. Movement: Swiss quartz. Water resistant up to 50m.",
  },
]

export const getProductById = (id: number): Product | undefined => {
  return products.find((product) => product.id === id)
}

export const getProductsByCategory = (category: string): Product[] => {
  if (category === "all") return products
  return products.filter((product) => product.category === category)
}

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description?.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery),
  )
}
