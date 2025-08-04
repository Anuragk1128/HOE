"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Upload, X } from "lucide-react";
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
}

interface ImageType {
  value: string;
  label: string;
}

const imageTypes: ImageType[] = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'category', label: 'Category Section' },
  { value: 'logo', label: 'Logo' },
  { value: 'banner', label: 'Banner' },
  { value: 'team', label: 'Team' },
  { value: 'about', label: 'About' },
  { value: 'sustainability', label: 'Sustainability' },
  { value: 'careers', label: 'Careers' },
  { value: 'contact', label: 'Contact' },
  { value: 'shipping', label: 'Shipping' },
  { value: 'payment', label: 'Payment' }
];

const categories = [
  "jewellery",
  "sportswear"
];

export default function EditImagePage() {
  const router = useRouter();
  const params = useParams();
  const imageId = params.id as string;

  const [image, setImage] = useState<WebsiteImage | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    category: "",
    altText: "",
    description: "",
    isActive: true,
    isFeatured: false,
    order: 0
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchImage();
  }, [imageId]);

  const fetchImage = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`https://hoe.onrender.com/api/admin/website-images/${imageId}`, {
        headers: {
          "Authorization": `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImage(data.image);
        setFormData({
          name: data.image.name,
          type: data.image.type,
          category: data.image.category || "",
          altText: data.image.altText,
          description: data.image.description || "",
          isActive: data.image.isActive,
          isFeatured: data.image.isFeatured,
          order: data.image.order
        });
      } else {
        setError("Failed to fetch image");
      }
    } catch (error) {
      console.log("Error fetching image:", error);
      setError("Network error. Please try again.");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setError("");

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.altText) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const adminToken = localStorage.getItem("adminToken");
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("altText", formData.altText);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("isActive", formData.isActive.toString());
      formDataToSend.append("isFeatured", formData.isFeatured.toString());
      formDataToSend.append("order", formData.order.toString());
      
      if (formData.category) {
        formDataToSend.append("category", formData.category);
      }
      
      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      const response = await fetch(`https://hoe.onrender.com/api/admin/website-images/${imageId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${adminToken}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        router.push("/admin/images");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update image");
      }
    } catch (error) {
      console.log("Error updating image:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading image...</div>
      </div>
    );
  }

  if (error && !image) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/images"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Images
          </Link>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/images"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Images
          </Link>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Image not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/images"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Images
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Website Image</h1>
        <p className="text-gray-600 mt-2">Update image details and upload new image if needed</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Image Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter image name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select image type</option>
                {imageTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category (Optional)
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="altText"
                value={formData.altText}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter alt text for accessibility"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter image description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>

            <div className="flex space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Featured</label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Image</h2>
          
          <div className="mb-6">
            <img
              src={image.imageUrl}
              alt={image.altText}
              className="max-w-full h-auto max-h-64 rounded"
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Image (Optional)</h3>
          
          <div className="space-y-4">
            {!selectedFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500 font-medium">
                    Click to upload new image
                  </span>
                  <span className="text-gray-500"> or drag and drop</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">{selectedFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                {previewUrl && (
                  <div className="border rounded-lg p-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full h-auto max-h-64 mx-auto rounded"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/images"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Updating..." : "Update Image"}
          </button>
        </div>
      </form>
    </div>
  );
} 