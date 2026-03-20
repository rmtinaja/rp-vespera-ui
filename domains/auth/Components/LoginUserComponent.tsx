'use client';
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockIcon, User2Icon } from "lucide-react";
import { AuthService } from "@/domains/auth/Services/auth.service";

export default function LoginUserComponent() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await AuthService.login({ username, password });
      if (res.success) {
        document.cookie = `token=${res.token}; path=/`;
        router.push("/page/select-module");
      } else {
        alert(res.message);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4">
      {/* Two-column container */}
      <div className="flex flex-col lg:flex-row w-full max-w-5xl">
        
        {/* Left: Login Form */}
        <div className="flex-1 max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="border-b border-[#eaeae8] px-8 py-8 text-center">
            <img
              src="/assets/images/logo-hero.png"
              alt="Company Logo"
              className="w-32 h-auto mx-auto mb-8"
            />
            <h1 className="font-playfair text-3xl font-medium text-gray-800">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to your account
            </p>
          </div>

          {/* Form Body */}
          <form
            onSubmit={handleLogin}
            className="px-8 py-8 flex flex-col gap-5"
          >
            {/* Username */}
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-sm text-gray-600 font-inter">
                Username
              </label>
              <div className="flex items-center border border-[#d0d0d0] rounded-md bg-[#f9f9f9] px-3 h-11 focus-within:border-[#b28648] focus-within:bg-white transition-colors">
                <User2Icon className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none ml-2 text-sm font-inter"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm text-gray-600 font-inter">
                Password
              </label>
              <div className="flex items-center border border-[#d0d0d0] rounded-md bg-[#f9f9f9] px-3 h-11 focus-within:border-[#b28648] focus-within:bg-white transition-colors">
                <LockIcon className="w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none ml-2 text-sm font-inter"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end -mt-2">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-[#b28648] hover:text-[#9a7038] font-inter transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-md bg-[#b28648] hover:bg-[#9a7038] text-white font-medium text-sm font-inter transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-[#eaeae8]" />
              <span className="text-xs text-gray-400 uppercase tracking-widest font-inter">
                or
              </span>
              <div className="flex-1 h-px bg-[#eaeae8]" />
            </div>

            {/* Register Link */}
            <div className="text-center text-sm text-gray-500 font-inter">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-[#b28648] hover:text-[#9a7038] font-medium transition-colors"
              >
                Create one
              </Link>
            </div>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-6 font-inter">
            Your information is kept private and secure.
          </p>
        </div>

        {/* Right: Image or Info Panel */}
        <div className="flex-1 !lg:flex items-center justify-center bg-[#eaeae8] rounded-2xl overflow-hidden">
          <img
            src="/assets/images/ballonssss.png" 
            alt="Welcome Image"
            className="w-1/2 cover h-auto object-contain "
          />
        </div>
      </div>
    </div>
  );
}