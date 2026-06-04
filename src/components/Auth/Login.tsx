"use client";

import type React from "react";

import { Eye, EyeOff } from "lucide-react";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useLoginMutation } from "@/redux/api/authApi";
import Cookies from "js-cookie";
import Link from "next/link";
import { toast } from "sonner";
import AuthLayout from "./AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [loginFn] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const respone = await loginFn({ email, password }).unwrap();
      console.log("login response", respone);
      if (respone.success) {
        toast.success("Login successful");
        router.push("/admin/dashboard");
        Cookies.set("token", respone?.data?.accessToken);
      }
    } catch {
      toast.error("login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Login" subtitle="Let's login into your account first">
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="relative w-full">
          {/* Label overlapping on top border */}
          <label className="absolute -top-[10px] left-4 bg-white px-1 text-sm font-medium text-default">
            Email Address
          </label>

          {/* Input field */}
          <input
            type="email"
            placeholder="example@gmail.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600 placeholder-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="relative w-full">
          {/* Floating label */}
          <label
            htmlFor="password"
            className="absolute -top-[10px] left-4 bg-white px-1 text-sm font-medium text-gray-700"
          >
            Password
          </label>

          {/* Input field with toggle button */}
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-full bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* Eye toggle button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-[#0E1826]  font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-[#0E1826]  text-white  rounded-full hover:bg-none font-semibold"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}
