import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { ApiService } from "../../Services/ApiService";
import { SendOtpDTO } from "../../DTO/BuyerRegDTO";

export default function Step1({ nextStep }: { nextStep: () => void }) {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
  });

  const [otpTimer, setOtpTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mobileError, setMobileError] = useState("");

  const apiService = new ApiService();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    // Save inputs to session immediately
    sessionStorage.setItem(name, value);
  };

  const sendOTP = async () => {
    setLoading(true);
    setMobileError("");

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

      // Save OTP to session
      // sessionStorage.setItem("otp", otp);

      // Start 5-min timer
      setOtpTimer(300);

      // Move to next step
      nextStep();
    } catch (err: any) {
      setMobileError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);
  useEffect(() => {
    const firstName = sessionStorage.getItem("firstName") || "";
    const middleName = sessionStorage.getItem("middleName") || "";
    const lastName = sessionStorage.getItem("lastName") || "";
    const mobile = sessionStorage.getItem("mobile") || "";

    setForm({
      firstName: firstName.toUpperCase(),
      middleName: middleName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      mobile,
    });
  }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Basic Information</h2>

      {/* First Name */}
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

      {/* Middle Name */}
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

      {/* Last Name */}
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

      {/* Mobile Number */}
      <div className="flex flex-col">
        <label htmlFor="mobile" className="text-sm font-medium text-dark">
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="mobile"
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          placeholder="Mobile"
          minLength={11}
          maxLength={11}
          className={`bg-white mt-1 w-full rounded-lg border px-3 py-2 focus:ring-green-500 focus:border-green-500
    ${mobileError ? "border-red-500" : "border-gray-300"}`}
        />
      </div>

      {/* Send OTP */}
      <Button
        type="button"
        onClick={sendOTP}
        disabled={
          otpTimer > 0 ||
          loading ||
          !form.mobile ||
          !form.firstName ||
          !form.lastName
        }
      >
        {otpTimer > 0
          ? `Resend in ${Math.floor(otpTimer / 60)}:${String(
            otpTimer % 60,
          ).padStart(2, "0")}`
          : loading
            ? "Checking..."
            : "Send OTP"}
      </Button>
    </div>
  );
}
