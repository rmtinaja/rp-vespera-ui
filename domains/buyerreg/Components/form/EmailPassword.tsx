import { useState, useEffect } from "react";
import { ApiService } from "../../Services/ApiService";
import { CheckEmailDTO } from "../../DTO/BuyerRegDTO";
import { Button } from "primereact/button";
import { Eye, EyeOff } from "lucide-react";

interface Step6Props {
  nextStep: () => void;
  backStep: () => void;
}

export default function Step6({ nextStep, backStep }: Step6Props) {
  const [form, setForm] = useState({
    email: localStorage.getItem("email") || "",
    passwordConfirmation: localStorage.getItem("passwordConfirmation") || "",
    password: localStorage.getItem("password") || "",
  });

  const [emailError, setEmailError] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const api = new ApiService();
  const [loading, setLoading] = useState(false);
  let emailTimeout: NodeJS.Timeout;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    // Save inputs to session immediately
    localStorage.setItem(name, value);
  };
  // Debounced email uniqueness check
  useEffect(() => {
    if (!form.email) {
      setEmailError("");
      return;
    }

    clearTimeout(emailTimeout);
    emailTimeout = setTimeout(async () => {
      setCheckingEmail(true);
      try {
        const result = await api.checkEmail({
          email: form.email,
        } as CheckEmailDTO);
        if (!result.isUnique) {
          setEmailError(result.message || "Email is already registered.");
        } else {
          setEmailError("");
        }
      } catch {
        setEmailError("Could not verify email at this time.");
      }
      setCheckingEmail(false);
    }, 500);

    return () => clearTimeout(emailTimeout);
  }, [form.email]);

  // Password validation
  useEffect(() => {
    if (form.password && form.password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
    } else if (form.password !== form.passwordConfirmation) {
      setPasswordError("Passwords do not match.");
    } else {
      setPasswordError("");
    }
  }, [form.password, form.passwordConfirmation]);

  // Disable Next if errors exist
  const isNextDisabled =
    loading ||
    !!emailError ||
    !!passwordError ||
    form.password === "" ||
    form.passwordConfirmation === "";

  return (
    <div id="step2" className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Email & Password</h2>

      {/* Email */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-dark">
          Email Address <span className="text-gray-700">(Optional)</span>
        </label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          value={form.email}
          placeholder="example@email.com"
          className={`bg-white mt-1 w-full rounded-lg border px-3 py-2 focus:ring-green-500 focus:border-green-500
            ${emailError ? "border-red-500" : "border-gray-300"}`}
        />
        {checkingEmail && (
          <span className="text-xs text-gray-500 mt-1">Checking email...</span>
        )}
        {emailError && (
          <span className="text-xs text-red-500 mt-1">{emailError}</span>
        )}
      </div>

      <div className="gap-4 flex flex-col">
        {/* Password */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-dark">
            Password <span className="text-red-700">*</span>
          </label>
          <div className="flex mt-1 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              value={form.password}
              placeholder="Enter password"
              className={`flex-1 bg-white rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:ring-green-500 focus:border-green-500
                ${passwordError ? "border-red-500" : "border-gray-300"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-700 mt-1">At least 8 characters.</p>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-dark">
            Confirm Password <span className="text-red-700">*</span>
          </label>
          <div className="flex mt-1 relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="passwordConfirmation"
              onChange={handleChange}
              value={form.passwordConfirmation}
              placeholder="Re-enter password"
              className={`flex-1 bg-white rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:ring-green-500 focus:border-green-500
                ${passwordError ? "border-red-500" : "border-gray-300"}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordError && (
            <span className="text-xs text-red-500 mt-1">{passwordError}</span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <button
          className="bg-accent text-white w-1/2 py-2 rounded-lg"
          onClick={async () => {
            setLoading(true);
            try {
              await backStep();
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          Back
        </button>
        <Button
          icon="pi pi-check"
          loading={loading}
          className="btn-primary justify-center w-1/2 py-2 rounded-lg text-white bg-accent"
          onClick={nextStep}
          disabled={isNextDisabled}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
