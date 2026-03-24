import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { ApiService } from "../../Services/ApiService";
import { OtpVerificationDTO, SendOtpDTO } from "../../DTO/BuyerRegDTO";

interface Step2Props {
  nextStep: () => void;
  backStep: () => void;
  otpTimer: number; 
  setOtpTimer: (timer: number) => void; 
}

export default function Step2({ nextStep, backStep, otpTimer, setOtpTimer }: Step2Props) {
  const apiService = new ApiService();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const mobile = localStorage.getItem("mobile") || "";
  const firstName = localStorage.getItem("firstName") || "";
  const middleName = localStorage.getItem("middleName") || "";
  const lastName = localStorage.getItem("lastName") || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setOtp(value);
      if (error) setError("");
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const dto: OtpVerificationDTO = {
        name1: firstName,
        phone: mobile,
        module: "PA",
        otp,
      };

      await apiService.verifyOtp(dto);
      nextStep();
    } catch (err: any) {
      console.error("OTP verification failed:", err);
      setError(err.message || "Invalid OTP. Please try again.");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (otpTimer > 0) return;
    
    setError("");
    setResending(true);

    try {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

      const dto: SendOtpDTO = {
        phone: mobile,
        fname: firstName,
        mname: middleName || null,
        lname: lastName,
        module: "PA",
        otp: newOtp,
        message: `Your OTP is ${newOtp}. It will expire in 5 minutes.`,
      };

      await apiService.sendOtp(dto);
      
      sessionStorage.setItem("otp", newOtp);
      
      setOtpTimer(300);
      setOtp(""); 
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (otpTimer <= 0) return;
    
    const interval = setInterval(() => {
      setOtpTimer(otpTimer - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [otpTimer, setOtpTimer]);

  useEffect(() => {
    if (otpTimer === 0) {
      setError("OTP has expired. Please request a new one.");
    }
  }, [otpTimer]);

  return (
    <div className="space-y-4  max-w-md mx-auto">
      <div className="flex items-center">
        <button
          onClick={backStep}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold text-gray-800">OTP Verification</h2>
        <div className="w-8"></div>
      </div>

      <p className="text-gray-600 text-sm text-center">
        Please enter the 6-digit OTP sent to{" "}
        <strong className="text-blue-600">{(mobile)}</strong>
      </p>

      <div className="flex justify-center">
        <input
          type="text"
          name="otp"
          value={otp}
          onChange={handleChange}
          placeholder="••••••••"
          maxLength={6}
          autoFocus
          className="bg-white w-64 rounded-lg px-4 py-3 border text-center text-2xl tracking-widest font-mono focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
          aria-label="OTP input"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <span className="text-red-600 text-sm">{error}</span>
        </div>
      )}

      <div className="flex flex-row gap-3 mt-2">
        <Button
          type="button"
          className={`w-full justify-center !text-sm py-2 ${
            otpTimer > 0 || resending
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          onClick={resendOTP}
          disabled={otpTimer > 0 || resending}
        >
          {resending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              Sending...
            </span>
          ) : otpTimer > 0 ? (
            `Resend in ${formatTime(otpTimer)}`
          ) : (
            "Resend OTP"
          )}
        </Button>

        <Button
          loading={loading}
          className="bg-green-600 hover:bg-green-700 text-white w-full justify-center !text-sm py-2"
          onClick={verifyOTP}
          disabled={loading || otp.length !== 6 || otpTimer === 0}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-gray-500 text-xs">
          Didn't receive the code? Check your mobile connection.
        </p>
      </div>
    </div>
  );
}