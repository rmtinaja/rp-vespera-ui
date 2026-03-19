import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { ApiService } from "../../Services/ApiService";
import { OtpVerificationDTO, SendOtpDTO } from "../../DTO/BuyerRegDTO";
interface Step2Props {
  nextStep: () => void;
  backStep: () => void;
}

export default function Step2({ nextStep, backStep }: Step2Props) {
  const apiService = new ApiService();

  // -------------------- State --------------------
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get stored values from Step1
  const mobile = sessionStorage.getItem("mobile") || "";
  const firstName = sessionStorage.getItem("firstName") || "";
  const middleName = sessionStorage.getItem("middleName") || "";
  const lastName = sessionStorage.getItem("lastName") || "";

  // -------------------- Handle Change --------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  // -------------------- Verify OTP --------------------
  const verifyOTP = async () => {
    setError("");

    try {
      const dto: OtpVerificationDTO = {
        name1: firstName,
        phone: mobile,
        module: "PA",
        otp,
      };

      await apiService.verifyOtp(dto);

      // Optional: check with session OTP (fallback if needed)
      const storedOtp = sessionStorage.getItem("otp");
      if (storedOtp && otp !== storedOtp) {
        throw new Error("Invalid OTP");
      }
      nextStep();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // -------------------- Resend OTP --------------------
  const sendOTP = async () => {
    setError("");

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

      // sessionStorage.setItem("otp", newOtp);

      setOtpTimer(300);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // -------------------- Timer --------------------
  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

  // -------------------- UI --------------------
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">
        OTP Verification
      </h2>

      <input
        type="text"
        name="otp"
        value={otp}
        onChange={handleChange}
        placeholder="Enter OTP"
        className="bg-white w-full rounded-lg px-3 py-2"
      />

      {error && (
        <span className="text-red-500 text-sm">{error}</span>
      )}

      <div className="flex flex-row gap-2">
        <Button
          type="button"
          className="bgAccent text-white w-1/2 justify-center !text-[12px]"
          onClick={sendOTP}
          disabled={otpTimer > 0}
        >
          {otpTimer > 0
            ? `${Math.floor(otpTimer / 60)}:${String(
                otpTimer % 60
              ).padStart(2, "0")}`
            : "Resend OTP"}
        </Button>

        <Button
          loading={loading}
          className="btn-primary text-white w-1/2 justify-center !text-[12px]"
          onClick={async () => {
            setLoading(true);
            try {
              await verifyOTP();
            } finally {
              setLoading(false);
            }
          }}
        >
          Verify OTP
        </Button>
      </div>
    </div>
  );
}