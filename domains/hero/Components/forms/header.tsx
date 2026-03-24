import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    setIsLoggedIn(!!token);
  }, []);
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <Image
            src="/favicon.ico"
            alt="Renaissance logo"
            width={40}
            height={40}
          />
          <div className="leading-tight">
            <h1 className="text-lg font-semibold">Renaissance</h1>
            <p className="text-xs font-medium">Park & Chapels</p>
          </div>
        </div>

        {/* Desktop Navigation (UNCHANGED) */}
        <nav aria-label="Main Navigation" className="hidden md:block">
          <ul className="flex items-center gap-6">
            <li>
              <a href="#" className="hover:text-[#34554f] transition">
                Home
              </a>
            </li>

            {/* PRODUCTS DROPDOWN */}
            <li className="relative group">
              <button className="hover:text-[#34554f] transition flex items-center gap-1 !p-0 !font-normal">
                Products
              </button>

              <div className="absolute left-0 top-full mt-3 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <ul className="py-2 text-sm">
                  <li>
                    <Link
                      href="/lawn-lots"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Lawn Lots
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Estates
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Community Vault
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Cremation
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            {/* SERVICES DROPDOWN */}
            <li className="relative group">
              <button className="hover:text-[#34554f] transition flex items-center gap-1 !p-0 !font-normal">
                Services
              </button>

              <div className="absolute left-0 top-full mt-3 w-56 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <ul className="py-2 text-sm">
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Standard Lawn
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Standart Estates
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Community Vault
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Bone / Urn Mausoleum
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Bone / Urn Interment
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Disinterment
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            <li>
              <a href="#footer" className="hover:text-[#34554f] transition">
                Visit Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#34554f] transition">
                Check SOA
              </a>
            </li>

            <li className="ml-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const confirmLogout = confirm("Do you want to log out?");
                      if (!confirmLogout) return;

                      document.cookie = "token=; Max-Age=0; path=/";
                      setIsLoggedIn(false);
                    }}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link href="/auth/login">
                    <button className="px-4 py-2 bg-[#34554f] text-white rounded">
                      Login
                    </button>
                  </Link>
                  <Link href="/auth/register">
                    <button
                      onClick={() => {
                        // 🔥 clear all stored data
                        localStorage.clear();
                        sessionStorage.clear();

                        // (optional) clear auth token too
                        document.cookie = "token=; Max-Age=0; path=/";

                        // // redirect
                        // window.location.href = "/auth/register";
                      }}
                      className="px-4 py-2 bg-[#34554f] text-white rounded"
                    >
                      Register
                    </button>
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden gap-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="flex flex-col justify-between w-6 h-5">
            <span className="w-6 h-0.5 bg-gray-800"></span>
            <span className="w-6 h-0.5 bg-gray-800"></span>
            <span className="w-6 h-0.5 bg-gray-800"></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          <ul className="flex flex-col p-4 space-y-3">
            <li>
              <a href="#">Home</a>
            </li>

            <li>
              <button
                className="w-full flex justify-start !p-0 !font-normal"
                onClick={() => setProductsOpen(!productsOpen)}
              >
                Products
              </button>

              {productsOpen && (
                <ul className="pl-4 mt-2 space-y-2 text-sm text-gray-600">
                  <li>
                    <a href="#">Lawn Lots</a>
                  </li>
                  <li>
                    <a href="#">Estates</a>
                  </li>
                  <li>
                    <a href="#">Community Vault</a>
                  </li>
                  <li>
                    <a href="#">Cremation</a>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <button
                className="w-full flex justify-start !p-0 !font-normal"
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                Services
              </button>

              {servicesOpen && (
                <ul className="pl-4 mt-2 space-y-2 text-sm text-gray-600">
                  <li>
                    <a href="#">Standard Lawn</a>
                  </li>
                  <li>
                    <a href="#">Standart Estates</a>
                  </li>
                  <li>
                    <a href="#">Community Vault</a>
                  </li>
                  <li>
                    <a href="#">Bone / Urn Mausoleum</a>
                  </li>
                  <li>
                    <a href="#">Bone / Urn Interment</a>
                  </li>
                  <li>
                    <a href="#">Disinterment</a>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>

            <li className="pt-4 border-t">
              <button className="w-full mb-2 px-4 py-2 bg-[#34554f] text-white rounded">
                Sign Up
              </button>
              <button className="w-full px-4 py-2 bg-[#34554f] text-white rounded">
                Register
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
