import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { ApiService } from "../../Services/ApiService";
import { SendOtpDTO, CheckMobileDTO } from "../../DTO/BuyerRegDTO";

interface Step1Props {
  nextStep: () => void;
  setOtpTimer: (timer: number) => void; // Add this prop
}
export default function Step1({ nextStep, setOtpTimer }: Step1Props) {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
  });
  const [hydrated, setHydrated] = useState(false);

  const [loading, setLoading] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [checkingMobile, setCheckingMobile] = useState(false);
  const [otpTimer, setLocalOtpTimer] = useState(0);

  const apiService = new ApiService();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);
    localStorage.setItem(name, value);

    // Only check mobile uniqueness on mobile input
    if (name === "mobile") checkMobile(value);
  };

  const checkMobile = async (mobile: string) => {
    setMobileError("");
    if (mobile.length < 11) return; // skip if too short

    setCheckingMobile(true);
    try {
      const dto: CheckMobileDTO = { mobile };
      const result = await apiService.checkMobileUnique(dto);
      if (!result.isUnique) {
        setMobileError("This mobile number is already registered.");
      } else {
        setMobileError("");
      }
    } catch (err: any) {
      setMobileError("Error checking mobile number.");
    } finally {
      setCheckingMobile(false);
    }
  };

  const sendOTP = async () => {
    if (mobileError) return; // prevent sending OTP if mobile invalid
    setLoading(true);

    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const dto: SendOtpDTO = {
        phone: form.mobile,
        fname: form.firstName,
        mname: form.middleName || null,
        lname: form.lastName,
        module: "PA",
        otp,
        message: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      };
      await apiService.sendOtp(dto);

      setOtpTimer(300); // Set timer in parent
      setLocalOtpTimer(300); // Set local timer for display
      nextStep();
    } catch (err: any) {
      setMobileError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const firstName = localStorage.getItem("firstName") || "";
    const middleName = localStorage.getItem("middleName") || "";
    const lastName = localStorage.getItem("lastName") || "";
    const mobile = localStorage.getItem("mobile") || "";

    setForm({
      firstName: firstName.toUpperCase(),
      middleName: middleName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      mobile,
    });

    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Basic Information</h2>

      <div className="flex flex-col">
        <label htmlFor="firstName" className="text-sm font-medium text-dark">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="bg-white w-full rounded-lg px-3 py-2 uppercase"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="middleName" className="text-sm font-medium text-dark">
          Middle Name <span className="text-gray-700">(Optional)</span>
        </label>
        <input
          type="text"
          id="middleName"
          name="middleName"
          value={form.middleName}
          onChange={handleChange}
          placeholder="Middle Name"
          className="bg-white w-full rounded-lg px-3 py-2 uppercase"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="lastName" className="text-sm font-medium text-dark">
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="bg-white w-full rounded-lg px-3 py-2 uppercase"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="mobile" className="text-sm font-medium text-dark">
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="mobile"
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          placeholder="Mobile (11 digits)"
          maxLength={11}
          minLength={11}
          pattern="\d{11}"
          title="Please enter exactly 11 digits"
          className={`bg-white mt-1 w-full rounded-lg border px-3 py-2 focus:ring-green-500 focus:border-green-500 ${mobileError ? "border-red-500" : "border-gray-300"
            }`}
        />
        {checkingMobile && <small className="text-gray-500">Checking...</small>}
        {mobileError && <small className="text-red-500">{mobileError}</small>}
      </div>

      <Button
        type="button"
        onClick={sendOTP}
        disabled={
          otpTimer > 0 ||
          loading ||
          !form.mobile ||
          !form.firstName ||
          !form.lastName ||
          !!mobileError
        }
      >
        {otpTimer > 0
          ? `Resend in ${Math.floor(otpTimer / 60)}:${String(otpTimer % 60).padStart(2, "0")}`
          : loading
            ? "Sending..."
            : "Send OTP"}
      </Button>
    </div>
  );
}
