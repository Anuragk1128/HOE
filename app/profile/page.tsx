"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getApiUrl, getAuthHeaders } from "@/lib/api-config"
import { useToast } from "@/hooks/use-toast"

interface Order {
  _id: string
  orderNumber: string
  items: Array<{
    product?: {
      name: string
      price: number
      image?: string
    }
    name?: string
    price?: number
    quantity: number
  }>
  totalAmount: number
  status: string
  createdAt: string
}

interface UserProfile {
  _id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  country?: string
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchOrders()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(getApiUrl("/api/user/profile"), {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
          city: data.user.city || "",
          country: data.user.country || "",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch profile data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch(getApiUrl("/api/user/orders"), {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const response = await fetch(getApiUrl("/api/user/profile"), {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setEditing(false)
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to current profile data
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        country: profile.country || "",
      })
    }
    setEditing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Please log in to view your profile.
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading profile...</span>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Profile Information</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditing(!editing)}
                        disabled={saving}
                      >
                        {editing ? "Cancel" : "Edit"}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={logout}
                        disabled={saving}
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <Separator />
                      <h3 className="font-medium">Address</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Street Address</label>
                          <Input
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="mt-1"
                            placeholder="Enter your street address"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">City</label>
                            <Input
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="mt-1"
                              placeholder="Enter your city"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Country</label>
                            <Input
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              className="mt-1"
                              placeholder="Enter your country"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button 
                          type="submit" 
                          className="flex-1"
                          disabled={saving}
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleCancel}
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="text-lg">{profile?.name || "Not provided"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="text-lg">{profile?.email}</p>
                      </div>
                      {profile?.phone && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Phone</label>
                          <p className="text-lg">{profile.phone}</p>
                        </div>
                      )}
                      {(profile?.address || profile?.city || profile?.country) && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Address</label>
                          <p className="text-lg">
                            {[profile?.address, profile?.city, profile?.country]
                              .filter(Boolean)
                              .join(", ") || "Not provided"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order History */}
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Order #{order.orderNumber || order._id}</span>
                            <Badge variant="secondary">{order.status || "Pending"}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {order.createdAt ? formatDate(order.createdAt) : "Date not available"}
                          </p>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span>
                                  {item.product?.name || item.name || "Unknown Product"} x {item.quantity || 1}
                                </span>
                                <span>
                                  {formatPrice((item.product?.price || item.price || 0) * (item.quantity || 1))}
                                </span>
                              </div>
                            ))}
                          </div>
                          <Separator className="my-2" />
                          <div className="flex items-center justify-between font-medium">
                            <span>Total</span>
                            <span>{formatPrice(order.totalAmount || 0)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No orders yet. Start shopping to see your order history!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
} 