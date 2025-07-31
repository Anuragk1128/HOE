export interface WebsiteImage {
  _id: string;
  name: string;
  type: string;
  category?: string;
  imageUrl: string;
  altText: string;
  description?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://hoe.onrender.com";

// Fetch all active website images
export const fetchWebsiteImages = async (): Promise<WebsiteImage[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/website-images`);
    if (response.ok) {
      const data = await response.json();
      return data.images || [];
    }
    throw new Error("Failed to fetch website images");
  } catch (error) {
    console.error("Error fetching website images:", error);
    return [];
  }
};

// Fetch website images by type
export const fetchWebsiteImagesByType = async (type: string): Promise<WebsiteImage[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/website-images/by-type/${type}`);
    if (response.ok) {
      const data = await response.json();
      return data.images || [];
    }
    throw new Error("Failed to fetch website images by type");
  } catch (error) {
    console.error("Error fetching website images by type:", error);
    return [];
  }
};

// Fetch a single website image by ID
export const fetchWebsiteImageById = async (id: string): Promise<WebsiteImage | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/website-images/${id}`);
    if (response.ok) {
      const data = await response.json();
      return data.image || null;
    }
    throw new Error("Failed to fetch website image");
  } catch (error) {
    console.error("Error fetching website image:", error);
    return null;
  }
};

// Get hero image (first active hero image)
export const getHeroImage = async (): Promise<WebsiteImage | null> => {
  try {
    const heroImages = await fetchWebsiteImagesByType("hero");
    const activeHeroImage = heroImages.find(img => img.isActive);
    return activeHeroImage || null;
  } catch (error) {
    console.error("Error fetching hero image:", error);
    return null;
  }
};

// Get logo image (first active logo image)
export const getLogoImage = async (): Promise<WebsiteImage | null> => {
  try {
    const logoImages = await fetchWebsiteImagesByType("logo");
    const activeLogoImage = logoImages.find(img => img.isActive);
    return activeLogoImage || null;
  } catch (error) {
    console.error("Error fetching logo image:", error);
    return null;
  }
};

// Get category image for a specific category
export const getCategoryImage = async (category: string): Promise<WebsiteImage | null> => {
  try {
    const categoryImages = await fetchWebsiteImagesByType("category");
    const categoryImage = categoryImages.find(img => 
      img.isActive && img.category === category
    );
    return categoryImage || null;
  } catch (error) {
    console.error("Error fetching category image:", error);
    return null;
  }
};

// Get all images by type (for admin use)
export const getImagesByType = async (type: string): Promise<WebsiteImage[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/website-images/by-type/${type}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.images || [];
    }
    throw new Error("Failed to fetch images by type");
  } catch (error) {
    console.error("Error fetching images by type:", error);
    return [];
  }
}; 