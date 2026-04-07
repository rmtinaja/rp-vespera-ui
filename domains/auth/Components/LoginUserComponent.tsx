"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockIcon, User2Icon } from "lucide-react";
import { AuthService } from "@/domains/auth/Services/auth.service";
import {
  toastError,
  toastSuccess,
} from "@/sharedComponents/services/ToastContext";
import Loading from "@/domains/pa/Components/dialogs/Loading";

export default function LoginUserComponent() {
  const router = useRouter();

  const [ip, setIp] = useState("");
  useEffect(() => {
    const savedData: any = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) savedData[key] = localStorage.getItem(key);
    }

    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        setIp(data.ip);
      })
      .catch(() => {
        setIp("0.0.0.0");
      });
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await AuthService.userlogin({ email, password, ip });

      if (res.success) {
        document.cookie = `token=${res.token}; path=/`;

        router.push("/");
        router.refresh(); // 🔥 ensures header detects login

        toastSuccess("Login successfully");
      } else {
        alert(res.message);
      }
    } catch (error: any) {
      toastError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f7f7f7] flex items-center justify-center">
      {loading && <Loading text="Saving purchase agreement.Please Wait!..." />}
      <div className="w-full max-w-[1200px] h-[90vh] flex rounded-[4px] overflow-hidden">
        <div className="w-full lg:w-[420px] bg-white border border-[#eaeae8] flex flex-col justify-center px-10">
          <div className="mb-10">
            <img
              src="/assets/images/logo-hero.png"
              alt="Logo"
              className="w-28 mb-8"
            />

            <h1 className="font-playfair text-[32px] leading-[1.3] text-[#060503]">
              Welcome Back
            </h1>

            <p className="mt-2 text-[16px] text-[#6b6b6b]">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#6b6b6b]">Email</label>
              <div className="flex items-center border border-[#d6d3d1] rounded-[4px] px-3 h-11 focus-within:border-[#b28648]">
                <User2Icon className="w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-transparent outline-none ml-2 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#6b6b6b]">Password</label>
              <div className="flex items-center border border-[#d6d3d1] rounded-[4px] px-3 h-11 focus-within:border-[#b28648]">
                <LockIcon className="w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="flex-1 bg-transparent outline-none ml-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-[#b28648]"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-[4px] bg-[#b28648] text-white text-sm hover:bg-[#9a7038]"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="h-px bg-[#d6d3d1] my-3" />

            <p className="text-sm text-[#6b6b6b]">
              Don’t have an account?{" "}
              <Link href="/auth/register" className="text-[#b28648]">
                Create one
              </Link>
            </p>
          </form>
        </div>

        <div className="hidden lg:flex flex-1 relative">
          {/* Image */}
          <img
            src="/assets/images/chapel.jpg"
            alt="Chapel"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-[#0c2a22]/50" />
          <div className="absolute inset-0 flex flex-col justify-center px-16">
            <h2 className="font-playfair text-[32px] leading-[1.3] text-white max-w-md">
              Built for peace. Maintained for generations.
            </h2>

            <p className="mt-4 text-[16px] text-white/80 max-w-sm">
              A place designed for stillness, order, and lasting care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
