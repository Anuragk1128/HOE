"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Info, CheckCircle } from "lucide-react";
import Link from "next/link";

interface ImageType {
  value: string;
  label: string;
  description: string;
  requirements: string[];
  usage: string[];
  recommendedCount: number;
}

const imageTypes: ImageType[] = [
  { 
    value: 'hero', 
    label: 'Hero Section', 
    description: 'Main banner images for homepage and landing pages',
    requirements: ['High resolution (1920x1080 minimum)', 'Landscape orientation', 'Compressed for web'],
    usage: ['Homepage hero banner', 'Landing page headers'],
    recommendedCount: 1
  },
  { 
    value: 'category', 
    label: 'Category Section', 
    description: 'Images for product category displays',
    requirements: ['Square or 16:9 aspect ratio', 'Product-focused composition', 'Clear category representation'],
    usage: ['Category page headers', 'Shop page category cards'],
    recommendedCount: 2
  },
  { 
    value: 'logo', 
    label: 'Logo', 
    description: 'Company logo and branding elements',
    requirements: ['Transparent background (PNG)', 'High resolution', 'Simple and recognizable'],
    usage: ['Website header', 'Footer', 'Email signatures'],
    recommendedCount: 1
  },
  { 
    value: 'banner', 
    label: 'Banner', 
    description: 'Promotional and marketing banners',
    requirements: ['Wide aspect ratio (3:1 or 4:1)', 'Text overlay space', 'High contrast'],
    usage: ['Promotional campaigns', 'Special offers', 'Newsletter headers'],
    recommendedCount: 3
  },
  { 
    value: 'team', 
    label: 'Team', 
    description: 'Employee and team member photos',
    requirements: ['Square aspect ratio (1:1)', 'Professional headshots', 'Consistent style'],
    usage: ['About page team section', 'Leadership profiles'],
    recommendedCount: 5
  },
  { 
    value: 'about', 
    label: 'About', 
    description: 'Images for about page content',
    requirements: ['Storytelling composition', 'Company culture representation', 'High quality'],
    usage: ['About page story section', 'Company values section'],
    recommendedCount: 2
  },
  { 
    value: 'sustainability', 
    label: 'Sustainability', 
    description: 'Images related to environmental initiatives',
    requirements: ['Nature/environmental focus', 'Green/sustainable theme', 'Authentic representation'],
    usage: ['Sustainability page', 'Environmental initiatives'],
    recommendedCount: 4
  },
  { 
    value: 'careers', 
    label: 'Careers', 
    description: 'Workplace and career-related images',
    requirements: ['Professional workplace scenes', 'Diverse team representation', 'Positive work environment'],
    usage: ['Careers page', 'Job listings'],
    recommendedCount: 3
  },
  { 
    value: 'contact', 
    label: 'Contact', 
    description: 'Contact page and customer service images',
    requirements: ['Friendly and approachable', 'Customer service focus', 'Professional yet warm'],
    usage: ['Contact page', 'Customer service section'],
    recommendedCount: 1
  },
  { 
    value: 'shipping', 
    label: 'Shipping', 
    description: 'Logistics and delivery-related images',
    requirements: ['Shipping/delivery theme', 'Professional logistics', 'Clear and informative'],
    usage: ['Shipping policy page', 'Delivery information'],
    recommendedCount: 2
  },
  { 
    value: 'payment', 
    label: 'Payment', 
    description: 'Payment and security-related images',
    requirements: ['Security and trust focus', 'Payment method representation', 'Professional appearance'],
    usage: ['Payment page', 'Security information'],
    recommendedCount: 2
  }
];

export default function AddImagePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    altText: "",
    description: "",
    isActive: true,
    isFeatured: false,
    order: 0
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedImageType = imageTypes.find(type => type.value === formData.type);

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
    
    if (!selectedFile) {
      setError("Please select an image file");
      return;
    }

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
      
      formDataToSend.append("image", selectedFile);

      const response = await fetch("http://localhost:5000/api/admin/website-images", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${adminToken}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        router.push("/admin/images");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create image");
      }
    } catch (error) {
      console.log("Error creating image:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Add New Website Image</h1>
        <p className="text-gray-600 mt-2">Upload and configure a new website image</p>
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

        {/* Image Type Guidance */}
        {selectedImageType && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  {selectedImageType.label} - Image Requirements
                </h3>
                <p className="text-blue-800 mb-4">{selectedImageType.description}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Requirements
                    </h4>
                    <ul className="space-y-1">
                      {selectedImageType.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-blue-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Where it will be used
                    </h4>
                    <ul className="space-y-1">
                      {selectedImageType.usage.map((usage, index) => (
                        <li key={index} className="text-sm text-blue-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {usage}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-100 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Recommended:</strong> {selectedImageType.recommendedCount} image{selectedImageType.recommendedCount !== 1 ? 's' : ''} for this type
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Image</h2>
          
          <div className="space-y-4">
            {!selectedFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500 font-medium">
                    Click to upload
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
            {loading ? "Creating..." : "Create Image"}
          </button>
        </div>
      </form>
    </div>
  );
} 