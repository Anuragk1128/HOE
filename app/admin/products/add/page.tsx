"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

interface ProductFormData {
  name: string;
  price: number;
  description: string;
  image: File[];  // Changed from string[] to File[]
  category: string;
  stock: number;
  size: string[];
  color: string[];
  rating: number;
  reviews: any[];
  isFeatured: boolean;
  isActive: boolean;
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    description: "",
    image: [],  // Now stores File objects
    category: "",
    stock: 0,
    size: [],
    color: [],
    rating: 0,
    reviews: [],
    isFeatured: false,
    isActive: true,
  });

  const [newImage, setNewImage] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]); // For preview only

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (newSize.trim()) {
      setFormData(prev => ({
        ...prev,
        size: [...prev.size, newSize.trim()]
      }));
      setNewSize("");
    }
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      size: prev.size.filter((_, i) => i !== index)
    }));
  };

  const addColor = () => {
    if (newColor.trim()) {
      setFormData(prev => ({
        ...prev,
        color: [...prev.color, newColor.trim()]
      }));
      setNewColor("");
    }
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      color: prev.color.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    if (newImage.trim()) {
      // For URL images, we'll need to fetch them as files
      fetch(newImage.trim())
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], `image-${Date.now()}.jpg`, { type: blob.type });
          setFormData(prev => ({
            ...prev,
            image: [...prev.image, file]
          }));
          setImagePreviewUrls(prev => [...prev, newImage.trim()]);
          setNewImage("");
        })
        .catch(error => {
          console.error('Error fetching image:', error);
          setMessage('Failed to fetch image from URL');
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Check for missing required fields
    const missingFields = [];
    
    if (!formData.name.trim()) missingFields.push("Product Name");
    if (!formData.price || formData.price <= 0) missingFields.push("Price");
    if (!formData.description.trim()) missingFields.push("Description");
    if (formData.image.length === 0) missingFields.push("Product Images");
    if (!formData.category) missingFields.push("Category");
    if (!formData.stock || formData.stock <= 0) missingFields.push("Stock Quantity");
    if (formData.size.length === 0) missingFields.push("Available Sizes");
    if (formData.color.length === 0) missingFields.push("Available Colors");

    if (missingFields.length > 0) {
      setMessage(`Please fill in the following required fields: ${missingFields.join(", ")}`);
      setLoading(false);
      return;
    }

    try {
      const adminToken = localStorage.getItem("adminToken");
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", formData.stock.toString());
      formDataToSend.append("rating", formData.rating.toString());
      formDataToSend.append("isActive", formData.isActive.toString());
      formDataToSend.append("isFeatured", formData.isFeatured.toString());

      for (let i = 0; i < formData.image.length; i++) {
        formDataToSend.append("images", formData.image[i]);
      }

      for (let i = 0; i < formData.size.length; i++) {
        formDataToSend.append("sizes", formData.size[i]);
      }

      for (let i = 0; i < formData.color.length; i++) {
        formDataToSend.append("colors", formData.color[i]);
      }

      const response = await fetch("http://localhost:5000/api/admin/products", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${adminToken}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Product created successfully!");
        setTimeout(() => {
          router.push("/admin/products");
        }, 1500);
      } else {
        setMessage(data.message || "Failed to create product");
      }
    } catch (error) {
      console.log("Error creating product:", error);
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/products"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-600 mt-2">Create a new product for your store</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-100 text-green-700 border border-green-400' 
            : 'bg-red-100 text-red-700 border border-red-400'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  !formData.name.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
                required
              />
              {!formData.name.trim() && (
                <p className="mt-1 text-sm text-red-600">Product name is required</p>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Category *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: "jewellery" }))}
                  className={`relative overflow-hidden rounded-lg p-6 text-left transition-all duration-300 border-2 ${
                    formData.category === "jewellery"
                      ? "border-purple-500 bg-purple-50 shadow-lg transform scale-105"
                      : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md hover:transform hover:scale-105"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">Jewellery</h3>
                      <p className="text-sm text-gray-600">
                        Elegant jewelry pieces for every occasion
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                      </svg>
                    </div>
                  </div>
                  {formData.category === "jewellery" && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Selected
                      </span>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: "sportswear" }))}
                  className={`relative overflow-hidden rounded-lg p-6 text-left transition-all duration-300 border-2 ${
                    formData.category === "sportswear"
                      ? "border-green-500 bg-green-50 shadow-lg transform scale-105"
                      : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md hover:transform hover:scale-105"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">Sportswear</h3>
                      <p className="text-sm text-gray-600">
                        Comfortable and stylish athletic wear
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  {formData.category === "sportswear" && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Selected
                      </span>
                    </div>
                  )}
                </button>
              </div>
              {!formData.category && (
                <p className="mt-2 text-sm text-red-600">Please select a category</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  !formData.price || formData.price <= 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
              {(!formData.price || formData.price <= 0) && (
                <p className="mt-1 text-sm text-red-600">Price must be greater than 0</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  !formData.stock || formData.stock <= 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                required
              />
              {(!formData.stock || formData.stock <= 0) && (
                <p className="mt-1 text-sm text-red-600">Stock quantity must be greater than 0</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  !formData.rating || formData.rating <= 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                max="5"
                step="0.1"
                required
              />
              {(!formData.rating || formData.rating <= 0) && (
                <p className="mt-1 text-sm text-red-600">Rating must be greater than 0</p>
              )}
            </div>
            
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                !formData.description.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter product description"
              required
            />
            {!formData.description.trim() && (
              <p className="mt-1 text-sm text-red-600">Description is required</p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images *
            </label>
            <div className={`space-y-4 ${formData.image.length === 0 ? 'border-2 border-red-300 rounded-lg p-4 bg-red-50' : ''}`}>
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setFormData(prev => ({
                      ...prev,
                      image: [...prev.image, ...files]
                    }));
                    // Create preview URLs for the new files
                    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
                    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-lg font-medium text-gray-900 mb-2">Upload Images</p>
                    <p className="text-sm text-gray-500">Click to select images from your device</p>
                    <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, GIF, WebP</p>
                  </div>
                </label>
              </div>

              {/* Image Preview */}
              {imagePreviewUrls.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({imagePreviewUrls.length})</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviewUrls.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* URL Input (Alternative) */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Or Add Image URL</p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter image URL"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            {formData.image.length === 0 && (
              <p className="mt-1 text-sm text-red-600">At least one product image is required</p>
            )}
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Sizes *
            </label>
            <div className={`flex space-x-2 mb-4 ${formData.size.length === 0 ? 'border-2 border-red-300 rounded-lg p-4 bg-red-50' : ''}`}>
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., S, M, L, XL"
              />
              <button
                type="button"
                onClick={addSize}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {formData.size.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.size.map((size, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {formData.size.length === 0 && (
              <p className="mt-1 text-sm text-red-600">At least one size is required</p>
            )}
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Colors *
            </label>
            <div className={`flex space-x-2 mb-4 ${formData.color.length === 0 ? 'border-2 border-red-300 rounded-lg p-4 bg-red-50' : ''}`}>
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Red, Blue, Green"
              />
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {formData.color.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.color.map((color, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    {color}
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {formData.color.length === 0 && (
              <p className="mt-1 text-sm text-red-600">At least one color is required</p>
            )}
          </div>

          {/* Status Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Active Product
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Featured Product
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/products"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 