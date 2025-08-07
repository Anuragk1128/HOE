"use client";
import React, { useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface PinCodeResponse {
  success: boolean;
  serviceable: boolean;
  pincode: string;
  city?: string;
  state?: string;
  deliveryDays?: number;
  message: string;
}

const API_URL = "https://hoe.onrender.com/api/pincode/check";

export const PinCodeChecker: React.FC = () => {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PinCodeResponse | null>(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 w-full max-w-xs">
      <div className="flex items-center gap-2 w-full">
        <input
          type="text"
          value={pincode}
          maxLength={6}
          pattern="[0-9]{6}"
          onChange={e => {
            setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
            setResult(null);
            setError("");
          }}
          placeholder="Enter pincode"
          className="border rounded px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleCheck}
          disabled={loading || pincode.length !== 6}
          className="bg-primary text-white px-3 py-1 rounded disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Check"}
        </button>
      </div>
      {error && (
        <div className="text-red-600 text-sm flex items-center gap-1">
          <XCircle className="h-4 w-4" /> {error}
        </div>
      )}
      {result && (
        <div className={`text-sm flex items-center gap-1 ${result.serviceable ? "text-green-700" : "text-red-600"}`}>
          {result.serviceable ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {result.message}
          {result.serviceable && result.city && result.state && (
            <span className="ml-1 text-xs text-muted-foreground">({result.city}, {result.state}, {result.deliveryDays} days)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default PinCodeChecker;
