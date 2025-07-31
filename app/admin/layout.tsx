"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getApiUrl, getAdminHeaders } from "@/lib/api-config";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip authentication check for login page
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    const verifyAdmin = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const response = await fetch(getApiUrl("/admin/verify"), {
          headers: getAdminHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          setAdminUser(data.admin);
        } else {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Admin verification error:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      await fetch(getApiUrl("/admin/logout"), {
        method: "POST",
        headers: getAdminHeaders(),
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      router.push("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // For login page, just render children without admin layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!adminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {adminUser.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              <Link
                href="/admin/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Orders
              </Link>
              <Link
                href="/admin/users"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Users
              </Link>
              <Link
                href="/admin/images"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
              >
                Website Images
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
} 