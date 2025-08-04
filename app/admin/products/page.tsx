"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, Filter } from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string[];
  category: string;
  stock: number;
  size: string[];
  color: string[];
  rating: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

const categories = [
  "jewellery",
  "sportswear"
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  }, [products, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch("https://hoe.onrender.com/api/admin/products", {
        headers: {
          "Authorization": `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        setError("Failed to fetch products");
      }
    } catch (error) {
      console.log("Error fetching products:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`https://hoe.onrender.com/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setProducts(products.filter(product => product._id !== productId));
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.log("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`https://hoe.onrender.com/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setProducts(products.map(product => 
          product._id === productId 
            ? { ...product, isActive: !currentStatus }
            : product
        ));
      } else {
        alert("Failed to update product status");
      }
    } catch (error) {
      console.log("Error updating product:", error);
      alert("Error updating product");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      jewellery: "bg-purple-100 text-purple-800",
      sportswear: "bg-green-100 text-green-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-2">Manage all products in your store</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-2">Manage all products in your store</p>
        </div>
        <Link
          href="/admin/products/add"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedCategory(selectedCategory === "jewellery" ? "all" : "jewellery")}
            className={`relative overflow-hidden rounded-lg p-6 text-left transition-all duration-300 border-2 ${
              selectedCategory === "jewellery"
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
            {selectedCategory === "jewellery" && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Selected
                </span>
              </div>
            )}
          </button>

          <button
            onClick={() => setSelectedCategory(selectedCategory === "sportswear" ? "all" : "sportswear")}
            className={`relative overflow-hidden rounded-lg p-6 text-left transition-all duration-300 border-2 ${
              selectedCategory === "sportswear"
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
            {selectedCategory === "sportswear" && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Selected
                </span>
              </div>
            )}
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          {selectedCategory === "all" 
            ? `Showing all ${products.length} products` 
            : `Showing ${filteredProducts.length} of ${products.length} products in ${formatCategory(selectedCategory)} category`
          }
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Products ({filteredProducts.length})
          </h2>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">
              {selectedCategory === "all" 
                ? "No products found" 
                : `No products found in ${formatCategory(selectedCategory)} category`
              }
            </p>
            <Link
              href="/admin/products/add"
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={product.image[0] || "/placeholder.svg"}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.description.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                        {formatCategory(product.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleProductStatus(product._id, product.isActive)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/admin/products/edit/${product._id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
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

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedProduct.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedProduct.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedProduct.category)}`}>
                    {formatCategory(selectedProduct.category)}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Price</label>
                  <p className="text-sm text-gray-900">₹{selectedProduct.price.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Stock</label>
                  <p className="text-sm text-gray-900">{selectedProduct.stock}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Rating</label>
                  <p className="text-sm text-gray-900">{selectedProduct.rating}/5</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Sizes</label>
                  <p className="text-sm text-gray-900">{selectedProduct.size.join(", ")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Colors</label>
                  <p className="text-sm text-gray-900">{selectedProduct.color.join(", ")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900">{selectedProduct.isActive ? "Active" : "Inactive"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Featured</label>
                  <p className="text-sm text-gray-900">{selectedProduct.isFeatured ? "Yes" : "No"}</p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => setSelectedProduct(null)}
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