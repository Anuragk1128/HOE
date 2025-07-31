"use client";
import { useEffect, useState } from "react";
import { Users, ShoppingCart, Package, TrendingUp, Activity, BarChart3 } from "lucide-react";
import { getApiUrl, getAdminHeaders } from "@/lib/api-config";

interface DashboardData {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
}

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(getApiUrl("/admin/dashboard"), {
          headers: getAdminHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-lg">Failed to load dashboard data</div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: dashboardData.totalUsers,
      icon: Users,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Orders",
      value: dashboardData.totalOrders,
      icon: ShoppingCart,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Products",
      value: dashboardData.totalProducts,
      icon: Package,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Activity className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200">
            <Package className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-700">Manage Products</span>
          </button>
          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors duration-200">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-700">View Orders</span>
          </button>
          <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200">
            <Users className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-gray-700">Manage Users</span>
          </button>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No recent activity to display</p>
        </div>
      </div>
    </div>
  );
} 