import type { Product } from "@/contexts/cart-context"

// Interface for backend product structure
interface BackendProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string[];
  category: string;
  subcategory: string;
  brand: string;
  gender: string;
  stock: number;
  size: string[];
  color: string[];
  rating: number;
  isFeatured: boolean;
  isActive: boolean;
  jewelleryAttributes?: {
    metalType?: string;
    purity?: string;
    stoneType?: string;
    stoneQuality?: string;
    weight?: number;
    designStyle?: string;
  };
  sportswearAttributes?: {
    material?: string;
    fitType?: string;
    activityType?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Convert backend product to frontend product format
const convertBackendProduct = (backendProduct: BackendProduct): Product => {
  return {
    id: backendProduct._id, // Use the MongoDB ObjectId string as ID
    name: backendProduct.name,
    price: backendProduct.price,
    image: backendProduct.image[0] || "/placeholder.svg", // Use first image as main image
    images: backendProduct.image, // Include all images
    category: backendProduct.category,
    subcategory: backendProduct.subcategory,
    brand: backendProduct.brand,
    gender: backendProduct.gender,
    description: backendProduct.description,
    details: `${backendProduct.description}. Available in sizes: ${backendProduct.size.join(', ')}. Colors: ${backendProduct.color.join(', ')}.`,
    jewelleryAttributes: backendProduct.jewelleryAttributes,
    sportswearAttributes: backendProduct.sportswearAttributes,
  };
};

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hoe.onrender.com';

// Fetch all products from backend
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.products.map(convertBackendProduct);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Fetch products by category
export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products?category=${category}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.products.map(convertBackendProduct);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products?search=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to search products");
    }

    const data = await response.json();
    return data.products.map(convertBackendProduct);
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return convertBackendProduct(data.product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

// Get products with sorting and filtering
export const getProductsWithFilters = async (params: {
  category?: string;
  search?: string;
  sort?: string;
}): Promise<Product[]> => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.category && params.category !== 'all') {
      searchParams.append('category', params.category);
    }
    
    if (params.search) {
      searchParams.append('search', params.search);
    }
    
    if (params.sort) {
      searchParams.append('sort', params.sort);
    }

    const response = await fetch(`${API_BASE_URL}/api/products?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.products.map(convertBackendProduct);
  } catch (error) {
    console.error("Error fetching products with filters:", error);
    return [];
  }
}; 