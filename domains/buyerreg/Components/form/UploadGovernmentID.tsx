import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { ApiService } from "../../Services/ApiService";
import { VerifyIdDTO } from "../../DTO/BuyerRegDTO";

interface Step5Props {
  nextStep: () => void;
  backStep: () => void;
}

export default function Step5({ backStep, nextStep }: Step5Props) {
  const [form, setForm] = useState<{ govId: File | null }>({ govId: null });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState<any>({});
  const apiService = new ApiService();
  // Generate preview when file changes

  useEffect(() => {
    const data = {
      firstName: localStorage.getItem("firstName") || "",
      middleName: localStorage.getItem("middleName") || "",
      lastName: localStorage.getItem("lastName") || "",
      province: localStorage.getItem("province") || "",
      provinceName: localStorage.getItem("provinceName") || "",
      city: localStorage.getItem("city") || "",
      cityName: localStorage.getItem("cityName") || "",
      barangay: localStorage.getItem("barangay") || "",
      barangayName: localStorage.getItem("barangayName") || "",
      image_base64: localStorage.getItem("image_base64") || "",
      id_type: localStorage.getItem("id_type") || "",
    };
    setSessionData(data);
  }, []);
  useEffect(() => {
    if (form.govId) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(form.govId);
    } else {
      setPreview(null);
    }
  }, [form.govId]);

  // Handle file selection
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Only JPG or PNG files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }

    setForm({ govId: file });
    localStorage.setItem("govIdName", file.name);
  };

  // Handle verification
  const handleVerify = async () => {
    if (!form.govId) return;

    setLoading(true);
    try {
      const dto: VerifyIdDTO = {
        gov_id: form.govId,
        fname: sessionData.firstName,
        mname: sessionData.middleName || null,
        lname: sessionData.lastName,
        province: sessionData.provinceName,
        city: sessionData.cityName,
        barangay: sessionData.barangayName,
      };

      const result = await apiService.verifyId(dto);
      localStorage.setItem("image_base64", result.image_base64);
      localStorage.setItem("id_type", result.id_type);
      localStorage.setItem("type_of_id", result.type_of_id);
      console.log("Verification success:", result);
      alert("ID verified successfully!");
      nextStep();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="step5" className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">
        Upload Government ID
      </h2>

      <p className="text-xs text-gray-500 mb-2">
        Upload any valid government ID (front only is enough to start).
      </p>

      <div>
        {/* ID Upload */}
        <label className="block text-sm font-medium text-gray-700">
          ID Upload <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleChange}
          className="bg-white mt-1 w-full rounded-lg border-gray-300 px-3 py-2"
        />

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="ID Preview"
            className="w-full h-40 object-cover rounded-lg border mt-2"
          />
        )}

        {/* File name if no preview */}
        {form.govId && !preview && <p className="mt-2">{form.govId.name}</p>}

        {/* Instructions */}
        <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg space-y-1 mt-2">
          <p>✔ Accepted file types: JPG, PNG</p>
          <p>✔ Max file size: 5MB</p>
          <p>✔ Ensure the image is clear and readable</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={backStep}
            className="w-1/2 py-2 bg-gray-500 text-white rounded-lg"
          >
            Back
          </button>

          <Button
            icon="pi pi-check"
            loading={loading}
            onClick={handleVerify}
            className={`w-1/2 py-2 rounded-lg justify-center text-white transition-colors duration-200 ${
              form.govId
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-300 cursor-not-allowed"
            }`}
            disabled={!form.govId || loading}
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
}
