import type { Product } from "@/contexts/cart-context"

export const products: Product[] = [
  {
    id: 1,
    name: "oversied tshirt",
    price: 799,
    image: "/images/oversi.jpeg",
    category: "sportswear",
    description: "A oversied tshirt for everyday use. Durable, stylish, and eco-friendly.",
    details: "Size: 40x35cm. Material: Organic cotton. Perfect for shopping, gym, or daily activities.",
  },
  {
    id: 2,
    name: "Minimalist Necklace",
    price: 1299,
    image: "/images/necklce.jpeg",
    category: "jewelry",
    description: "A minimalist necklace for a touch of elegance. Ethically made.",
    details: "Material: Recycled silver. Length: 45cm. Hypoallergenic and tarnish-resistant.",
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    price: 899,
    image: "/images/tshirt2.jpeg",
    category: "sportswear",
    description: "Comfortable organic cotton t-shirt perfect for workouts or casual wear.",
    details: "100% organic cotton. Available in multiple colors. Machine washable.",
  },
  {
    id: 4,
    name: "Recycled Gold Earrings",
    price: 1599,
    image: "/images/erring.png",
    category: "jewelry",
    description: "Beautiful earrings made from recycled gold. Sustainable luxury.",
    details: "Material: 14k recycled gold. Nickel-free. Comes with eco-friendly packaging.",
  },
  {
    id: 5,
    name: "nose ring"
    ,
    price: 1199,
    image: "/images/nosering.jpeg",
    category: "jewelry",
    description: "Premium bamboo yoga mat for your practice. Non-slip and eco-friendly.",
    details: "Size: 183x61cm. Thickness: 6mm. Made from sustainable bamboo fiber.",
  },
  {
    id: 6,
    name: "dual tshirt pants combo",
    price: 2499,
    image: "/images/greypnt.jpeg",
    category: "sportswear",
    description: "Elegant combo of pants and tshirt.",
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
