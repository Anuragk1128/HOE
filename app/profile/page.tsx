"use client";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Edit, Save, X, Check } from "lucide-react";

interface UserDetails {
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  phone: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  cartData: any;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [details, setDetails] = useState<UserDetails>({ 
    name: "", 
    email: "", 
    address: "", 
    city: "", 
    country: "", 
    phone: "" 
  });
  const [originalDetails, setOriginalDetails] = useState<UserDetails>({ 
    name: "", 
    email: "", 
    address: "", 
    city: "", 
    country: "", 
    phone: "" 
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ 
    show: false, 
    message: '', 
    type: 'success' 
  });

  useEffect(() => {
    if (!user && !isLoggingOut) {
      router.replace("/login");
      return;
    }
    
    if (isLoggingOut) {
      return;
    }
    
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
          const userDetails = {
            name: data.user.name || "",
            email: data.user.email || "",
            address: data.user.address || "",
            city: data.user.city || "",
            country: data.user.country || "",
            phone: data.user.phone || ""
          };
          setDetails(userDetails);
          setOriginalDetails(userDetails);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/user/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.log("Error fetching orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [user, router, isLoggingOut]);

  // Check for changes
  useEffect(() => {
    const changed = JSON.stringify(details) !== JSON.stringify(originalDetails);
    setHasChanges(changed);
  }, [details, originalDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDetails(originalDetails); // Reset to original values
    setHasChanges(false);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    
    try {
      const token = localStorage.getItem("token");
      console.log("Sending profile update:", details);
      console.log("Token:", token);
      
      const response = await fetch(`http://localhost:5000/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(details)
      });
      
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);
        setUserData(data.user);
        setOriginalDetails(details);
        setHasChanges(false);
        showToast("Changes saved successfully!", "success");
      } else {
        const errorData = await response.json();
        console.log("Error response:", errorData);
        showToast("Error saving changes", "error");
      }
    } catch (error) {
      console.log("Error saving changes:", error);
      showToast("Error saving changes", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(details)
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setOriginalDetails(details);
        setIsEditing(false);
        setHasChanges(false);
        showToast("Profile updated successfully!", "success");
      } else {
        showToast("Error updating profile", "error");
      }
    } catch (error) {
      console.log("Error saving profile:", error);
      showToast("Error updating profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  if (!user) return null;
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading profile...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Toast Notification */}
          {toast.show && (
            <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {toast.message}
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Profile Information</h2>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveChanges}
                      disabled={!hasChanges || saving}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    name="name" 
                    value={details.name} 
                    onChange={handleChange} 
                    disabled={!isEditing}
                    className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isEditing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={details.email} 
                    readOnly 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input 
                    name="phone" 
                    value={details.phone} 
                    onChange={handleChange} 
                    disabled={!isEditing}
                    className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isEditing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea 
                    name="address" 
                    value={details.address} 
                    onChange={handleChange} 
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isEditing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                    }`}
                    placeholder="Enter your address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input 
                      name="city" 
                      value={details.city} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isEditing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                      }`}
                      placeholder="Enter your city"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input 
                      name="country" 
                      value={details.country} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isEditing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                      }`}
                      placeholder="Enter your country"
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <button 
                    onClick={handleUpdate}
                    disabled={saving || !hasChanges}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Update Profile
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Order History</h2>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📦</div>
                  <p className="text-gray-500 text-lg">No orders yet</p>
                  <p className="text-gray-400 text-sm">Start shopping to see your order history here</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {orders.map((order, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800">Order #{idx + 1}</span>
                        <span className="text-sm text-gray-500">₹{order.total}</span>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="text-sm text-gray-600 flex justify-between">
                            <span>{item.name} (x{item.quantity})</span>
                            <span>₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div className="text-center mt-8">
            <button
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              onClick={() => {
                setIsLoggingOut(true);
                logout();
                router.push("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 