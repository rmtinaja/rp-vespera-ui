"use client";

import { useEffect, useState } from "react";
import Section1 from "../forms/section1";
import Section2 from "../forms/section2";
import Section3 from "../forms/section3";
import Section4 from "../forms/section4";
import Section5 from "../forms/section5";
import OneTimeOTP from "./onetimeotp";

export default function Component() {
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleVerify = (otp: string) => {
    console.log("Entered OTP:", otp);
    setIsOTPOpen(false);
  };
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    setIsLoggedIn(!!token);
  }, []);
  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    setIsLoggedIn(false);
    setIsOTPOpen(false); 
  };
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    const ipMatch = localStorage.getItem("ip_match");

    const loggedIn = !!token;

    setIsLoggedIn(loggedIn);

    if (loggedIn && ipMatch === "false") {
      if (ipMatch === "false") {
        alert("New device detected. Please verify OTP.");
      }
      setIsOTPOpen(true);
    } else {
      setIsOTPOpen(false);
    }
  }, []);

  //   const handleVerify = (otp: string) => {
  //   console.log("Entered OTP:", otp);

  //   localStorage.setItem("ip_match", "true"); // mark as verified
  //   setIsOTPOpen(false);
  // };
  return (
    <>
      {isLoggedIn && (
        <OneTimeOTP
          isLoggin={isLoggedIn}
          isOpen={isOTPOpen}
          onClose={() => setIsOTPOpen(false)}
          onVerify={handleVerify}
          handleLogout={handleLogout}
        />
      )}
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
    </>
  );
}
