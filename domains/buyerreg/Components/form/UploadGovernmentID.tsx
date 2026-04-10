import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { ApiService } from "../../Services/ApiService";
import { VerifyIdDTO } from "../../DTO/BuyerRegDTO";
import { Camera, Upload, X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import {
  toastError,
  toastSuccess,
  toastWarn,
} from "@/sharedComponents/services/ToastContext";

interface Step5Props {
  nextStep: () => void;
  backStep: () => void;
}

export default function Step5({ backStep, nextStep }: Step5Props) {
  const [form, setForm] = useState<{ govId: File | null }>({ govId: null });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState<any>({});
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState<{
    w: number;
    h: number;
  } | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const apiService = new ApiService();

  // Load session data from localStorage
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

  // Handle file selection (camera or upload)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      toastWarn("Only image files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toastWarn("File size must be less than 5MB.");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setForm({ govId: file });

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    localStorage.setItem("govIdName", file.name);

    // Reset state for zoom/rotation
    setZoom(1);
    setRotation(0);
    setLoaded(false);

    e.target.value = "";
  };

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
      toastSuccess("ID verified successfully!");
      nextStep();
    } catch (err: any) {
      console.error(err);
      toastError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URL
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const handleLoad = () => {
    if (imgRef.current) {
      setNaturalSize({
        w: imgRef.current.naturalWidth,
        h: imgRef.current.naturalHeight,
      });
    }
    setLoaded(true);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setForm({ govId: null });
    setZoom(1);
    setRotation(0);
    setLoaded(false);
    setNaturalSize(null);
  };

  const isRotated90or270 = rotation === 90 || rotation === 270;

  return (
    <div id="step5" className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">
        Upload Government ID
      </h2>

      <p className="text-xs text-gray-500 mb-2">
        Upload any valid government ID (front only is enough to start) or
        capture a new one.
      </p>

      <div className="space-y-4">
        {/* Preview */}
        {preview && (
          <div className="w-full rounded-xl border border-gray-200 bg-gray-50 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-white">
              <span className="text-xs font-medium text-gray-600 truncate max-w-[60%]">
                {form.govId?.name || "ID Preview"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-40"
                >
                  <ZoomOut className="w-4 h-4 text-gray-600" />
                </button>
                <span className="text-xs text-gray-400 w-10 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-40"
                >
                  <ZoomIn className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  className="p-1.5 rounded-full hover:bg-gray-100"
                >
                  <RotateCw className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-1.5 rounded-full hover:bg-red-50"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            {/* Image viewport */}
            <div
              className="relative w-full overflow-auto bg-gray-100"
              style={{ minHeight: "200px", maxHeight: "300px" }}
            >
              {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-green-500 animate-spin" />
                </div>
              )}
              <div
                className="flex items-center justify-center"
                style={{
                  minHeight: "200px",
                  padding: "12px",
                  minWidth:
                    isRotated90or270 && naturalSize
                      ? `${naturalSize.h * zoom}px`
                      : undefined,
                }}
              >
                <img
                  ref={imgRef}
                  src={preview}
                  alt="Government ID"
                  onLoad={handleLoad}
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    maxHeight: "276px",
                    objectFit: "contain",
                    transform: `rotate(${rotation}deg) scale(${zoom})`,
                    transformOrigin: "center center",
                    transition: "transform 0.2s ease",
                    opacity: loaded ? 1 : 0,
                    margin: isRotated90or270 ? "auto" : undefined,
                  }}
                />
              </div>
            </div>

            {loaded && naturalSize && (
              <div className="px-3 py-1.5 border-t border-gray-200 bg-white">
                <p className="text-xs text-gray-400">
                  {naturalSize.w} × {naturalSize.h}px
                </p>
              </div>
            )}
          </div>
        )}

        {/* Upload & Camera */}
        <div className="flex flex-row justify-start gap-6">
          <div>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
            <label
              htmlFor="file-input"
              className="flex flex-col items-center justify-center w-16 h-16 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200"
            >
              <Upload className="w-6 h-6 text-gray-700" />
              <span className="text-xs text-gray-600 mt-1">Upload</span>
            </label>
          </div>
          <div>
            <input
              id="camera-input"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleChange}
              className="hidden"
            />
            <label
              htmlFor="camera-input"
              className="flex flex-col items-center justify-center w-16 h-16 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200"
            >
              <Camera className="w-6 h-6 text-gray-700" />
              <span className="text-xs text-gray-600 mt-1">Camera</span>
            </label>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg space-y-1">
          <p>✔ Accepted file types: JPG, PNG</p>
          <p>✔ Max file size: 5MB</p>
          <p>✔ Ensure the image is clear and readable</p>
        </div>

        {/* Navigation Buttons */}
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
            className={`w-1/2 py-2 rounded-lg justify-center text-white transition-colors duration-200 ${form.govId ? "bg-green-600 hover:bg-green-700" : "bg-green-300 cursor-not-allowed"}`}
            disabled={!form.govId || loading}
          >
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
}
