"use client";

import { useEffect, useState } from "react";
import Section1 from "../forms/section1";
import Section2 from "../forms/section2";
import Section3 from "../forms/section3";
import Section4 from "../forms/section4";
import Section5 from "../forms/section5";
import OneTimeOTP from "./onetimeotp";
import { ApiService } from "@/domains/buyerreg/Services/ApiService";

export default function Component() {
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ip, setIp] = useState("");
  const [otpStatus, setOtpStatus] = useState<string | null>(null);
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const apiService = new ApiService();
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

  const sendOTP = async (): Promise<void> => {
    try {
      const userDataStr = localStorage.getItem("user");
      if (!userDataStr) {
        throw new Error("User data not found");
      }

      const userData = JSON.parse(userDataStr);

      if (!userData.mobile || !userData.first_name || !userData.last_name) {
        throw new Error(
          "Please fill required fields (mobile, first name, last name)",
        );
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const sendOtp = {
        phone: userData.mobile,
        fname: userData.first_name,
        lname: userData.last_name,
        module: "PA",
        otp,
        message: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      };

      await apiService.sendOtp(sendOtp);
    } catch (err: any) {
      console.error("Failed to send OTP:", err.message);
      throw err;
    }
  };
  const handleVerify = async (otp: string) => {
    try {
      const userDataStr = localStorage.getItem("user");
      if (!userDataStr) throw new Error("User not found");

      const user = JSON.parse(userDataStr);

      const ipMatchStr = localStorage.getItem("ip_match");
      const ipMatch = ipMatchStr ? JSON.parse(ipMatchStr) : {};

      const dto = {
        name1: `${user.first_name} ${user.last_name}`,
        module: "PA",
        phone: user.mobile,
        otp,
        ip_match: ipMatch.status || "send_otp_create_record",
        otpId: ipMatch.otp_id || null,
        userId: user.wba_i_customer_registration_id || null,
        ipAddress: ip || null,
      };

      await apiService.verifyOneTimeOtp(dto);

      // ✅ update local state AFTER success
      ipMatch.status = "verified";
      localStorage.setItem("ip_match", JSON.stringify(ipMatch));

      setIsOTPOpen(false);
      setOtpStatus("verified");
    } catch (err: any) {
      console.error("OTP verification failed:", err.message);
      alert(err.message); // or pass to modal error
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    setIsLoggedIn(false);
    setIsOTPOpen(false);
    setOtpStatus(null);
    localStorage.removeItem("ip_match");
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);

    // Retrieve user data from localStorage
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      try {
        const parsedUserData = JSON.parse(userDataStr);
        setUserData(parsedUserData);
        setMobileNumber(parsedUserData.mobile || "");
      } catch (e) {
        console.error("Failed to parse userData:", e);
      }
    }

    // Retrieve ip_match object from localStorage
    const ipMatchStr = localStorage.getItem("ip_match");
    let ipMatch: { status?: string; otp_id?: number } | null = null;

    if (ipMatchStr) {
      try {
        ipMatch = JSON.parse(ipMatchStr);
      } catch (e) {
        ipMatch = null;
      }
    }

    if (loggedIn && ipMatch) {
      setOtpStatus(ipMatch.status || null);

      if (
        ipMatch.status === "send_otp" ||
        ipMatch.status === "send_otp_create_record"
      ) {
        setIsOTPOpen(true);
      } else {
        setIsOTPOpen(false);
      }
    }
  }, []);

  return (
    <>
      {isLoggedIn && (
        <OneTimeOTP
          isLoggin={isLoggedIn}
          isOpen={isOTPOpen}
          onClose={() => setIsOTPOpen(false)}
          onVerify={handleVerify}
          sendOTP={sendOTP}
          handleLogout={handleLogout}
          mobileNumber={mobileNumber}
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
