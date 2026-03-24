"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface OneTimeOTPProps {
  isOpen: boolean;
  isLoggin: boolean;
  handleLogout: () => void;
  onClose: () => void;
  onVerify: (otp: string) => void;
  sendOTP: () => Promise<void>;
  mobileNumber?: string;
  onError?: (error: string) => void;
}

export default function OneTimeOTP({
  isOpen,
  onVerify,
  sendOTP,
  isLoggin,
  handleLogout,
  mobileNumber,
  onError,
}: OneTimeOTPProps) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(0);
  const [sending, setSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  // Initialize OTP modal state on open
  useEffect(() => {
    if (isOpen) {
      const ipMatchStr = localStorage.getItem("ip_match");
      let ipMatch: { status?: string } = {};
      if (ipMatchStr) {
        try {
          ipMatch = JSON.parse(ipMatchStr);
        } catch {}
      }

      setOtpSent(
        ipMatch.status === "send_otp" || ipMatch.status === "verified",
      );
      setOtp(Array(6).fill(""));
      setTimer(0);
      setError("");
    }
  }, [isOpen]);

  const triggerSendOtp = async () => {
    setSending(true);
    setError("");
    try {
      await sendOTP();
      setTimer(300);
      setOtpSent(true);
    } catch (err: any) {
      console.error("Failed to send OTP:", err);
      const errorMessage =
        err.message || "Failed to send OTP. Please try again.";
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setSending(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  if (!isOpen) return null;

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleBackspace = (e: any, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyClick = () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    onVerify(code);
  };

  const formatMobileNumber = (number?: string) => {
    if (!number) return "your mobile number";
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length >= 6) {
      const firstThree = cleaned.slice(0, 3);
      const lastThree = cleaned.slice(-3);
      const masked = "*".repeat(cleaned.length - 6);
      return `${firstThree}${masked}${lastThree}`;
    }
    return number;
  };

  const handleResend = () => {
    triggerSendOtp();
    setOtp(Array(6).fill(""));
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060503]/30">
      <div className="bg-white w-full max-w-md rounded-md p-8 relative">
        <div className="flex justify-center mb-6">
          <Image
            src="/assets/images/logo-hero.png"
            alt="OTP"
            width={240}
            height={80}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {!otpSent ? (
          <>
            <h2 className="font-playfair text-2xs text-center text-[#060503] flex flex-col">
              New device detected.
              <span>
                Please verify OTP on this {formatMobileNumber(mobileNumber)}.
              </span>
            </h2>

            <div className="mt-8">
              <button
                onClick={triggerSendOtp}
                disabled={sending}
                className="w-full h-11 bg-[#b28648] hover:bg-[#9a7038]
                           text-white text-sm font-medium transition-colors duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "Sending..." : "Send OTP"}
              </button>
            </div>

            {isLoggin && (
              <div className="mt-3">
                <button
                  onClick={() => {
                    // Ask for confirmation before logging out
                    const confirmLogout = confirm("Do you want to log out?");
                    if (!confirmLogout) return;

                    // Clear authentication cookie
                    document.cookie = "token=; Max-Age=0; path=/";

                    // Clear all localStorage data
                    localStorage.clear();

                    // Update local state
                    setIsLoggedIn(false);

                    // Refresh the page / redirect to home
                    window.location.href = "/";
                  }}
                  className="w-full h-11 border border-[#060503] text-[#060503]
                             text-sm font-medium hover:bg-[#060503] hover:text-white
                             transition-colors duration-200"
                >
                  Log out
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="font-playfair text-2xs text-center text-[#060503] flex flex-col">
              New device detected.
              <span className="font-semibold">
                Please verify OTP sent to this mobile number:{" "}
                {formatMobileNumber(mobileNumber)}
              </span>
            </h2>

            <div className="flex justify-between gap-2 mb-2 mt-4">
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
                             focus:outline-none focus:border-[#b28648] transition-colors duration-150"
                />
              ))}
            </div>

            <div className="text-center mb-8 text-sm text-gray-600">
              {timer > 0 ? (
                <span>
                  Resend OTP in {Math.floor(timer / 60)}:
                  {String(timer % 60).padStart(2, "0")}
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={sending}
                  className="text-[#b28648] underline"
                >
                  {sending ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleVerifyClick}
                className="w-full h-11 bg-[#b28648] hover:bg-[#9a7038]
                           text-white text-sm font-medium transition-colors duration-200"
              >
                Verify
              </button>
              {isLoggin && (
                <button
                  onClick={() => {
                    // Ask for confirmation before logging out
                    const confirmLogout = confirm("Do you want to log out?");
                    if (!confirmLogout) return;

                    // Clear authentication cookie
                    document.cookie = "token=; Max-Age=0; path=/";

                    // Clear all localStorage data
                    localStorage.clear();

                    // Update local state
                    setIsLoggedIn(false);

                    // Refresh the page / redirect to home
                    window.location.href = "/";
                  }}
                  className="w-full h-11 border border-[#060503] text-[#060503]
               text-sm font-medium hover:bg-[#060503] hover:text-white
               transition-colors duration-200"
                >
                  Log out
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
