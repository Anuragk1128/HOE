"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setMessage("Please fill in all fields");
      return;
    }
    
    setMessage("");
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        setMessage("Login successful!");
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      setMessage("Please fill in all fields");
      return;
    }
    
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }
    
    setMessage("");
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        setMessage("Registration successful!");
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      setMessage("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isLogin ? handleLogin : handleSignup;

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
          <h1 className="text-2xl font-bold mb-4">Admin {isLogin ? 'Login' : 'Signup'}</h1>
          {message && (
            <div className={`mb-4 p-2 rounded text-sm ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {!isLogin && (
              <input
                type="text"
                placeholder="Admin Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="border p-2 rounded"
                required={!isLogin}
                disabled={loading}
              />
            )}
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border p-2 rounded"
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border p-2 rounded"
              required
              disabled={loading}
            />
            <button 
              type="submit" 
              className="bg-black text-white p-2 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (isLogin ? "Logging in..." : "Registering...") : (isLogin ? "Login" : "Signup")}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
                setEmail("");
                setPassword("");
                setName("");
              }}
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              {isLogin ? "Need an admin account? Signup" : "Already have an account? Login"}
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Admin access only
          </p>
        </div>
      </div>
    </div>
  );
} 