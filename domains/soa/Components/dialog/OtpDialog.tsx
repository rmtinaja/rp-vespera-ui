"use client";

import { toastSuccess } from "@/sharedComponents/services/ToastContext";
import { useEffect, useState } from "react";
import CustomerSOA from "../form/CustomerSoa";
import { useRouter } from "next/navigation";
import { AlertCircle, Clock } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  data: any;
  apiService: any;
}

export default function OtpDialog({ open, onClose, data, apiService }: Props) {
  const [otpSending, setOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [timer, setTimer] = useState(300);
  const [timerActive, setTimerActive] = useState(false);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState(null);
  const router = useRouter();

  // TIMER
  useEffect(() => {
    let interval: any;

    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) setTimerActive(false);

    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSendOtp = async () => {
    setOtpSending(true);
    setError("");

    try {
      await apiService.sendOtp({
        fname: data.firstname,
        mname: data.middlename,
        lname: data.lastname,
        phone: data.phone,
        module: "SOA",
      });

      setOtpSent(true);
      setTimer(300);
      setTimerActive(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpVerifying(true);
    setError("");

    try {
      // 1️⃣ Verify OTP first
      await apiService.verifyOtp({
        otp,
        name1: `${data.firstname} ${data.middlename} ${data.lastname}`,
        phone: data.phone,
        bpar: data.bpar_i_person_id,
        owner: data.mp_i_owner_id,
        module: "SOA",
      });

      toastSuccess("OTP Verified!");

      const encodedData = sessionStorage.getItem("customerDetails");
      if (encodedData) {
        const customerDetails = JSON.parse(atob(encodedData));

        // 2️⃣ Generate SOA report with encrypted IDs
        const reportResult = await apiService.soaCustomerReport({
          bparId: customerDetails.data.bpar_i_person_id,
          ownerId: customerDetails.data.mp_i_owner_id,
          lot: data.lot,
          lotIds: data.lot_ids,
        });
        sessionStorage.setItem("reportData", JSON.stringify(reportResult));
        setReportData(reportResult?.data);

        if (reportResult?.data) {
          router.push("/soa/customersoa");
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      await handleSendOtp();
      setOtp("");
    } catch {}
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-[90%] text-center space-y-4">
        {/* HEADER */}
        <h2 className="text-2xl font-bold text-green-700">
          Is this your information?
        </h2>

        <p>
          Name: <strong>{data.name1}</strong>
        </p>

        <p>
          Contact: <strong>{data.phone || "N/A"}</strong>
        </p>

        {/* SEND OTP */}
        {!otpSent && (
          <div className="bg-green-50 border p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-green-700">
              Send One-Time Password (OTP)
            </h3>

            {error && (
              <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={handleSendOtp}
                disabled={otpSending}
                className="bg-green-600 text-white px-6 py-2 rounded-lg"
              >
                {otpSending ? "Sending..." : "Send OTP"}
              </button>

              <button
                onClick={() => {
                  onClose();
                  sessionStorage.removeItem("customerDetails");
                }}
                className="bg-gray-200 px-6 py-2 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* OTP INPUT */}
        {otpSent && (
          <div className="space-y-3">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-lg text-center"
              placeholder="Enter OTP"
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <p className="text-green-600 font-semibold flex items-center gap-2 justify-center">
              {timer > 0 ? (
                <>
                  <Clock size={16} />
                  {formatTime(timer)}
                </>
              ) : (
                <>
                  <AlertCircle size={16} className="text-red-500" />
                  OTP expired. Please resend.
                </>
              )}
            </p>
            <button
              onClick={handleVerifyOtp}
              disabled={otpVerifying || timer === 0}
              className="w-full bg-blue-500 text-white p-3 rounded-lg"
            >
              {otpVerifying ? "Verifying..." : "Verify OTP"}
            </button>

            {timer === 0 && (
              <button
                onClick={handleResend}
                className="mt-2 px-4 py-2 bg-gray-200 rounded-lg"
              >
                Resend OTP
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
