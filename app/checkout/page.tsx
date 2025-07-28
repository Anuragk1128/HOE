"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

const countries = ["India", "United States", "Belgium", "Germany", "France"];

export default function CheckoutPage() {
  const { state, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  
  const [form, setForm] = useState({
    email: "",
    country: countries[0],
    firstName: "",
    lastName: "",
    street: "",
    apartment: "",
    postal: "",
    city: "",
    paymentMode: "Credit Card",
    news: true,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const processPayment = async () => {
    setIsProcessing(true);
    setPaymentStatus("Processing payment...");
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate payment success (in real app, this would be payment gateway response)
    const paymentSuccess = Math.random() > 0.3; // 70% success rate for demo
    
    if (paymentSuccess) {
      setPaymentStatus("Payment successful! Saving order...");
      
      try {
        const token = localStorage.getItem("token");
        const order = {
          items: state.items,
          total: totalPrice,
          date: new Date().toISOString(),
          status: "confirmed",
          shippingAddress: {
            firstName: form.firstName,
            lastName: form.lastName,
            street: form.street,
            apartment: form.apartment,
            city: form.city,
            postal: form.postal,
            country: form.country,
            email: form.email
          },
          paymentMode: form.paymentMode
        };
        
        // Save order to backend only after successful payment
        const response = await fetch('http://localhost:5000/api/user/orders', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(order)
        });
        
        if (response.ok) {
          setPaymentStatus("Order placed successfully!");
          clearCart(); // Clear cart after successful order
          setTimeout(() => {
            router.push('/profile'); // Redirect to profile to see order history
          }, 2000);
        } else {
          setPaymentStatus("Error saving order. Please try again.");
        }
      } catch (error) {
        setPaymentStatus("Network error. Please try again.");
      }
    } else {
      setPaymentStatus("Payment failed. Please try again.");
    }
    
    setIsProcessing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please login to continue");
      router.push('/login');
      return;
    }
    
    if (state.items.length === 0) {
      alert("Your cart is empty");
      return;
    }
    
    await processPayment();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b py-4 px-8 bg-white flex items-center justify-between">
        <span className="text-2xl font-bold tracking-tight">
          hoe.<sup className="text-xs">®</sup>
        </span>
      </header>
      <main className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full py-8 px-2 md:px-8 gap-8">
        {/* Left: Form */}
        <section className="flex-1 max-w-xl mx-auto">
          {/* Express checkout */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-2 justify-center mb-2">
              <img
                src="/images/bancontact.svg"
                alt="Bancontact"
                className="h-8"
              />
              <img src="/images/visa.svg" alt="Visa" className="h-8" />
              <img
                src="/images/mastercard.svg"
                alt="Mastercard"
                className="h-8"
              />
              <img src="/images/maestro.svg" alt="Maestro" className="h-8" />
              <img src="/images/ideal.svg" alt="iDEAL" className="h-8" />
            </div>
            <div className="flex gap-4">
              <Button className="flex-1 bg-yellow-400 text-black font-bold text-lg py-2">
                PayPal
              </Button>
              <Button className="flex-1 bg-black text-white font-bold text-lg py-2">
                G Pay
              </Button>
            </div>
            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-gray-400 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
          </div>
          {/* Contact */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-semibold mb-1 block">Contact</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name="news"
                  checked={form.news}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm">Email me with news and offers</span>
              </div>
            </div>
            {/* Delivery */}
            <div>
              <label className="font-semibold mb-1 block">Delivery</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mb-2"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-1/2 border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-1/2 border rounded px-3 py-2"
                />
              </div>
              <input
                type="text"
                name="street"
                placeholder="Street"
                value={form.street}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 mb-2"
              />
              <input
                type="text"
                name="apartment"
                placeholder="Apartment, suite, etc. (optional)"
                value={form.apartment}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mb-2"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  name="postal"
                  placeholder="Postal code"
                  value={form.postal}
                  onChange={handleChange}
                  required
                  className="w-1/2 border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-1/2 border rounded px-3 py-2"
                />
              </div>
            </div>
            {/* Payment Mode */}
            <div>
              <label className="font-semibold mb-1 block">Payment Mode</label>
              <select
                name="paymentMode"
                value={form.paymentMode}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
            </div>
            <Button type="submit" className="w-full mt-2" size="lg" disabled={isProcessing}>
              {isProcessing ? "Processing Payment..." : "Pay Now"}
            </Button>
            {paymentStatus && (
              <div className={`mt-4 p-3 rounded text-center ${
                paymentStatus.includes("successful") || paymentStatus.includes("successfully") 
                  ? "bg-green-100 text-green-700" 
                  : paymentStatus.includes("failed") || paymentStatus.includes("Error")
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {paymentStatus}
              </div>
            )}
          </form>
        </section>
        {/* Right: Order Summary */}
        <aside className="w-full md:w-[400px] bg-white rounded-lg shadow-md p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-lg mb-2">Order Summary</h2>
          <div className="divide-y">
            {state.items.length === 0 ? (
              <div className="py-4 text-center text-gray-400">
                No items in cart
              </div>
            ) : (
              state.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 gap-2"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-12 w-12 rounded object-cover border"
                    />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        x{item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
          {/* Add-ons (upsell) */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2 text-sm">Gaat goed samen met</h3>
            {/* Example add-ons, you can replace with real data */}
            <div className="flex items-center justify-between mb-2">
              <span>Tanning Cream</span>
              <span>₹220</span>
              <Button size="sm">Add</Button>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Anti-Aging Serum</span>
              <span>₹490</span>
              <Button size="sm">Add</Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Combination Skin Cream</span>
              <span>₹350</span>
              <Button size="sm">Add</Button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
