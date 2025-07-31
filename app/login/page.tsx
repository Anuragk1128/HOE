"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setMessage("Invalid email or password. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <img
        src="/images/hero-bg.png"
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/50 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white/90 rounded-lg shadow-lg p-8 w-80 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          {message && (
            <div className={`mb-4 p-2 rounded text-sm ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border p-2 rounded"
              required
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border p-2 rounded"
              required
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="bg-black text-white p-2 rounded disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-4">
            New user? <Link href="/register" className="text-blue-600 underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 