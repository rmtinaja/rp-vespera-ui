"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface OneTimeOTPProps {
  isOpen: boolean;
  isLoggin: boolean;
  handleLogout: () => void; 
  onClose: () => void;
  onVerify: (otp: string) => void;
}

export default function OneTimeOTP({
  isOpen,
  onVerify,
  isLoggin,
  handleLogout,
}: OneTimeOTPProps) {
  const [otp, setOtp] = useState(Array(6).fill(""));

  const inputsRef = useRef<HTMLInputElement[]>([]);

  if (!isOpen) return null;

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e: any, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length === 6) {
      onVerify(code);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060503]/30">
      {/* Modal */}
      <div className="bg-white w-full max-w-md rounded-md p-8 relative">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/assets/images/logo-hero.png"
            alt="OTP"
            width={240}
            height={80}
          />
        </div>

        {/* Title */}
        <h2 className="font-playfair text-2xl text-center text-[#060503]">
          Enter Code
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 text-center mt-2 mb-8 font-inter">
          A 6-digit code was sent to your number
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-between gap-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => {
                if (el) inputsRef.current[index] = el;
              }}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              className="w-12 h-12 text-center border border-[#d6d3d1] text-lg
                         focus:outline-none focus:border-[#b28648]
                         transition-colors duration-150 font-inter"
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {/* Primary */}
          <button
            onClick={handleVerify}
            className="w-full h-11 bg-[#b28648] hover:bg-[#9a7038]
                       text-white text-sm font-medium font-inter
                       transition-colors duration-200"
          >
            Verify
          </button>

          {/* Secondary */}
          {isLoggin && (
            <button
              onClick={handleLogout}
              className="w-full h-11 border border-[#060503] text-[#060503]
                         text-sm font-medium font-inter
                         hover:bg-[#060503] hover:text-white
                         transition-colors duration-200"
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
