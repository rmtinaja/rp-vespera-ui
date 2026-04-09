"use client";

import { useEffect, useState } from "react";
import OtpDialog from "../dialog/OtpDialog";
import { ApiService } from "../../Services/ApiService";
import { VerifyBparNameDTO } from "../../DTO/VerifyBparNameDTO";
import { toastError } from "@/sharedComponents/services/ToastContext";

export default function SoaForm() {
  const apiService = new ApiService();

  const [form, setForm] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);

  // ✅ LOAD FROM SESSION STORAGE
  useEffect(() => {
    const savedForm = sessionStorage.getItem("soaForm");
    if (savedForm) {
      setForm(JSON.parse(savedForm));
    }
  }, []);

  // 🔹 Handle input + SAVE
  const handleChange = (e: any) => {
    const updatedForm = {
      ...form,
      [e.target.name]: e.target.value,
    };

    setForm(updatedForm);
    setErrors({ ...errors, [e.target.name]: "" });

    // ✅ SAVE TO SESSION STORAGE
    sessionStorage.setItem("soaForm", JSON.stringify(updatedForm));
  };

  // 🔹 Validation using toast
  const validate = () => {
    if (!form.firstname.trim()) {
      toastError("First name is required");
      return false;
    }

    if (!form.lastname.trim()) {
      toastError("Last name is required");
      return false;
    }

    return true;
  };

  // 🔹 Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    setResult(null);

    try {
      const dto: VerifyBparNameDTO = {
        firstname: form.firstname,
        middlename: form.middlename || undefined,
        lastname: form.lastname,
      };

      const data = await apiService.verifyBparName(dto);

      if (data.result.type === "multiple") {
        setResult(data.result);
      }

      if (data.result.type === "single") {
        setResult(data.result);
        setShowOtpModal(true);

        sessionStorage.removeItem("soaForm");
        const encoded = btoa(JSON.stringify(data.result));
        sessionStorage.setItem("customerDetails", encoded);
      }

      if (data.result.type === "none") {
        toastError("No matching records found.");
      }
    } catch (err: any) {
      toastError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F3ED] px-4">
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img src="/assets/images/logo-hero.png" className="w-[55%]" />
        </div>

        {/* CARD */}
        <div className="bg-gradient-to-br from-[#B18343] to-[#D9A066] rounded-2xl shadow-xl p-8 space-y-6">
          {/* HEADER */}
          <div className="text-center">
            <h2 className="text-white text-2xl font-bold">
              Customer Verification
            </h2>
            <p className="text-white/80 text-sm mt-1">
              Enter your name to check your account
            </p>
          </div>

          {/* MULTIPLE RESULTS */}
          {result?.type === "multiple" && (
            <div className="bg-white/90 border border-green-200 rounded-lg p-4 text-gray-800">
              <h3 className="text-green-700 font-semibold text-center mb-2">
                Multiple Matches Found
              </h3>

              <ul className="list-disc list-inside text-sm">
                {result.data.map((name: string, idx: number) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>

              <p className="text-xs text-gray-500 mt-2 text-center">
                Please refine your search.
              </p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* FIRST NAME */}
            <div>
              <label className="text-sm font-semibold text-gray-800">
                First Name <span className="text-red-800">*</span>
              </label>
              <input
                type="text"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                className={`w-full mt-1 rounded-lg px-3 py-2 border focus:ring-2 focus:ring-green-400 outline-none
                  ${errors.firstname ? "border-red-500" : "border-gray-300"}`}
              />
            </div>

            {/* MIDDLE NAME */}
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Middle Initial <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                name="middlename"
                maxLength={1}
                value={form.middlename}
                onChange={handleChange}
                className="w-full mt-1 rounded-lg px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>

            {/* LAST NAME */}
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Last Name <span className="text-red-800">*</span>
              </label>
              <input
                type="text"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                className={`w-full mt-1 rounded-lg px-3 py-2 border focus:ring-2 focus:ring-green-400 outline-none
                  ${errors.lastname ? "border-red-500" : "border-gray-300"}`}
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A352D] text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 hover:scale-[1.02] transition disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify Customer Name"}

              {loading && (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              )}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Your information is secure and confidential
        </p>

        {/* OTP MODAL */}
        <OtpDialog
          open={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          data={result?.data}
          apiService={apiService}
        />
      </div>
    </div>
  );
}
