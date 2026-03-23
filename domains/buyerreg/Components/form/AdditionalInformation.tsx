import { Button } from "primereact/button";
import { useState } from "react";

interface Step3Props {
  nextStep: () => void;
}

export default function Step3({ nextStep }: Step3Props) {
  // Initialize form from localStorage
  const [form, setForm] = useState({
    gender: localStorage.getItem("gender") || "",
    birthDate: localStorage.getItem("birthDate") || "",
    civilStatus: localStorage.getItem("civilStatus") || "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input and select changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    // Save to localStorage immediately
    localStorage.setItem(name, value);
  };

  // Validate before moving to next step
  const handleNext = () => {
    if (!form.gender || !form.birthDate || !form.civilStatus) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      nextStep();
    }, 500); // simulate async operation
  };

  return (
    <div className="step2-form space-y-6 p-4">
      <h2 className="text-lg font-semibold text-gray-700">
        Additional Information
      </h2>

      {/* Gender */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-dark">
          Gender <span className="text-red-600">*</span>
        </label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <span className="text-xs text-gray-700 mt-1">
          Please select your gender
        </span>
      </div>

      {/* Birth Date */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-dark">
          Birth Date <span className="text-red-600">*</span>
        </label>
        <input
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="text-xs text-gray-700 mt-1">
          Select your date of birth
        </span>
      </div>

      {/* Civil Status */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-dark">
          Civil Status <span className="text-red-600">*</span>
        </label>
        <select
          name="civilStatus"
          value={form.civilStatus}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Widowed">Widowed</option>
          <option value="Divorced">Divorced</option>
        </select>
        <span className="text-xs text-gray-700 mt-1">
          Your current marital status
        </span>
      </div>

      {/* Next Button */}
      <div className="mt-4">
        <Button
          className="w-full justify-center sm:w-1/2 text-white rounded-lg"
          icon="pi pi-check"
          loading={loading}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}