"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, Filter, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface WebsiteImage {
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
}

const imageTypes = [
  { 
    value: 'hero', 
    label: 'Hero Section', 
    color: 'bg-blue-100 text-blue-800',
    dimensions: '1920x1080px (16:9 ratio)',
    description: 'Homepage hero banner image'
  },
  { 
    value: 'category', 
    label: 'Category Section', 
    color: 'bg-green-100 text-green-800',
    dimensions: '800x600px (4:3 ratio)',
    description: 'Category cards on homepage'
  },
  { 
    value: 'logo', 
    label: 'Logo', 
    color: 'bg-purple-100 text-purple-800',
    dimensions: '56x56px (1:1 ratio)',
    description: 'Website logo in navigation'
  },
  { 
    value: 'banner', 
    label: 'Category Hero Banner', 
    color: 'bg-yellow-100 text-yellow-800',
    dimensions: '1200x600px (2:1 ratio)',
    description: 'Category page hero banners (Jewellery/Sportswear)'
  },
  { 
    value: 'team', 
    label: 'Team', 
    color: 'bg-pink-100 text-pink-800',
    dimensions: '200x200px (1:1 ratio)',
    description: 'Team member profile images'
  },
  { 
    value: 'about', 
    label: 'About', 
    color: 'bg-indigo-100 text-indigo-800',
    dimensions: '800x400px (2:1 ratio)',
    description: 'About page story images'
  },
  { 
    value: 'sustainability', 
    label: 'Sustainability', 
    color: 'bg-emerald-100 text-emerald-800',
    dimensions: '800x600px (4:3 ratio)',
    description: 'Sustainability page images'
  },
  { 
    value: 'careers', 
    label: 'Careers', 
    color: 'bg-orange-100 text-orange-800',
    dimensions: '800x600px (4:3 ratio)',
    description: 'Careers page images'
  },
  { 
    value: 'contact', 
    label: 'Contact', 
    color: 'bg-red-100 text-red-800',
    dimensions: '800x600px (4:3 ratio)',
    description: 'Contact page images'
  },
  { 
    value: 'shipping', 
    label: 'Shipping', 
    color: 'bg-cyan-100 text-cyan-800',
    dimensions: '800x600px (4:3 ratio)',
    description: 'Shipping page images'
  },
  { 
    value: 'payment', 
    label: 'Payment', 
    color: 'bg-gray-100 text-gray-800',
    dimensions: '800x600px (4:3 ratio)',
    description: 'Payment page images'
  }
];

export default function AdminImagesPage() {
  const [images, setImages] = useState<WebsiteImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<WebsiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<WebsiteImage | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    let filtered = images;

    if (selectedType !== "all") {
      filtered = filtered.filter(image => image.type === selectedType);
    }

    if (selectedStatus !== "all") {
      const isActive = selectedStatus === "active";
      filtered = filtered.filter(image => image.isActive === isActive);
    }

    setFilteredImages(filtered);
  }, [images, selectedType, selectedStatus]);

  const fetchImages = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch("https://hoe.onrender.com/api/admin/website-images", {
        headers: {
          "Authorization": `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      } else {
        setError("Failed to fetch images");
      }
    } catch (error) {
      console.log("Error fetching images:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`https://hoe.onrender.com/api/admin/website-images/${imageId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setImages(images.filter(image => image._id !== imageId));
      } else {
        alert("Failed to delete image");
      }
    } catch (error) {
      console.log("Error deleting image:", error);
      alert("Error deleting image");
    }
  };

  const toggleImageStatus = async (imageId: string, currentStatus: boolean) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`https://hoe.onrender.com/api/admin/website-images/${imageId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setImages(images.map(image => 
          image._id === imageId 
            ? { ...image, isActive: !currentStatus }
            : image
        ));
      } else {
        alert("Failed to update image status");
      }
    } catch (error) {
      console.log("Error updating image:", error);
      alert("Error updating image");
    }
  };

  const getTypeColor = (type: string) => {
    const typeInfo = imageTypes.find(t => t.value === type);
    return typeInfo?.color || "bg-gray-100 text-gray-800";
  };

  const getTypeLabel = (type: string) => {
    const typeInfo = imageTypes.find(t => t.value === type);
    return typeInfo?.label || type;
  };

  const getTypeDimensions = (type: string) => {
    const typeInfo = imageTypes.find(t => t.value === type);
    return typeInfo?.dimensions || "N/A";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading images...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Images Management</h1>
          <p className="text-gray-600 mt-2">Manage all website images including hero, category, logo, and more</p>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Images Management</h1>
          <p className="text-gray-600 mt-2">Manage all website images including hero, category, logo, and more</p>
        </div>
        <Link
          href="/admin/images/add"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Image
        </Link>
      </div>

      {/* Image Requirements Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <ImageIcon className="h-5 w-5 mr-2" />
          Image Requirements Guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {imageTypes.map((type) => (
            <div key={type.value} className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${type.color}`}>
                  {type.label}
                </span>
                <span className="text-xs text-gray-500 font-mono">{type.dimensions}</span>
              </div>
              <p className="text-sm text-gray-600">{type.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Use the exact dimensions specified above to ensure images display correctly on the website. 
            Recommended file formats: JPG, PNG, WebP. Keep file sizes under 500KB for optimal performance.
          </p>
          <div className="mt-3 p-3 bg-green-100 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Responsive Images:</strong> All images are automatically optimized for different screen sizes. 
              The system serves appropriately sized images for mobile, tablet, and desktop devices.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {imageTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          {selectedType === "all" && selectedStatus === "all"
            ? `Showing all ${images.length} images`
            : `Showing ${filteredImages.length} of ${images.length} images`
          }
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Images ({filteredImages.length})
          </h2>
        </div>
        
        {filteredImages.length === 0 ? (
          <div className="p-6 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {selectedType === "all" && selectedStatus === "all"
                ? "No images found"
                : "No images match the current filters"
              }
            </p>
            <Link
              href="/admin/images/add"
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Image
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Required Dimensions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredImages.map((image) => (
                  <tr key={image._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 flex-shrink-0">
                        {/* Admin Image Preview - Required: 64x64px (1:1 ratio) */}
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={image.imageUrl}
                          alt={image.altText}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{image.name}</div>
                        <div className="text-sm text-gray-500">{image.altText}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(image.type)}`}>
                        {getTypeLabel(image.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs text-gray-500 font-mono">
                        {getTypeDimensions(image.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {image.category || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleImageStatus(image._id, image.isActive)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          image.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {image.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        image.isFeatured
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {image.isFeatured ? "Featured" : "Regular"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedImage(image)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/admin/images/edit/${image._id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteImage(image._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Image Details Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Image Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedImage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Alt Text</label>
                  <p className="text-sm text-gray-900">{selectedImage.altText}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedImage.type)}`}>
                    {getTypeLabel(selectedImage.type)}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <p className="text-sm text-gray-900">{selectedImage.category || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedImage.description || "No description"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900">{selectedImage.isActive ? "Active" : "Inactive"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Featured</label>
                  <p className="text-sm text-gray-900">{selectedImage.isFeatured ? "Yes" : "No"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Order</label>
                  <p className="text-sm text-gray-900">{selectedImage.order}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Created</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedImage.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Image URL</label>
                  <p className="text-sm text-gray-900 break-all">{selectedImage.imageUrl}</p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 