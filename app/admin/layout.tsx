"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Truck, 
  Plus, 
  LogOut,
  BarChart3,
  Settings,
  Image
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [adminUser, setAdminUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't check authentication for login page
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    const checkAdminAuth = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");
        
        if (!adminToken) {
          router.push("/admin/login");
          return;
        }

        // Verify token with backend
        const response = await fetch("http://localhost:5000/api/admin/verify", {
          headers: {
            "Authorization": `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAdminUser(data.admin.email);
        } else {
          // Token is invalid, clear and redirect
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          router.push("/admin/login");
        }
      } catch (error) {
        // Network error or other issue, redirect to login
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      
      // Call logout endpoint if available
      await fetch("http://localhost:5000/api/admin/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      // Clear local storage
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      router.push("/admin/login");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading admin panel...</div>
      </div>
    );
  }

  // Don't render layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If we're not on login page but no admin user, show loading or redirect
  if (!adminUser && pathname !== "/admin/login") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Verifying admin access...</div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Add Product", href: "/admin/products/add", icon: Plus },
    { name: "Website Images", href: "/admin/images", icon: Image },
    { name: "Shipping", href: "/admin/shipping", icon: Truck },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome, {adminUser}</p>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
} 