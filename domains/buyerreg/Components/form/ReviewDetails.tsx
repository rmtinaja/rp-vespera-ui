"use client";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { SaveRegisterDTO } from "../../DTO/BuyerRegDTO";
import { ApiService } from "../../Services/ApiService";
import { useRouter } from "next/navigation";
import { AuthService } from "@/domains/auth/Services/auth.service";

interface Step7Props {
  backStep: () => void;
}

export default function Step7({ backStep }: Step7Props) {
  const [ip, setIp] = useState("");
  const [sessionData, setSessionData] = useState<any>({});
  const [loading, setLoading] = useState(false);     
  const [loggingIn, setLoggingIn] = useState(false); 

  const apiService = new ApiService();
  const router = useRouter();

  useEffect(() => {
    const savedData: any = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) savedData[key] = localStorage.getItem(key);
    }
    setSessionData(savedData);

    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        setIp(data.ip);
      })
      .catch(() => {
        setIp("0.0.0.0");
      });
  }, []);

  const onSubmit = async () => {
    if (!ip) {
      alert("Fetching IP, please wait...");
      return;
    }

    setLoading(true);

    try {
      const dto: SaveRegisterDTO = {
        first_name: sessionData.firstName,
        middle_name: sessionData.middleName,
        last_name: sessionData.lastName,
        mobile: sessionData.mobile,
        image: sessionData.image_base64,
        id_type: sessionData.id_type,
        province: sessionData.provinceName,
        city: sessionData.cityName,
        barangay: sessionData.barangayName,
        gender: sessionData.gender,
        birth_date: sessionData.birthDate,
        civil_status: sessionData.civilStatus,
        type_of_payor: sessionData.typeOfPayor,
        email: sessionData.email,
        password: sessionData.password,
        ip_address: ip, 
        id_name: sessionData.type_of_id, 
      };

      await apiService.registerUser(dto);

      setLoading(false);
      setLoggingIn(true);

      const loginRes = await AuthService.userlogin({
        email: sessionData.email,
        password: sessionData.password,
        ip: sessionData.ip_address
      });

      if (loginRes.success) {
        document.cookie = `token=${loginRes.token}; path=/`;

        localStorage.clear();
        setSessionData({});

        router.push("/");
        router.refresh();
      } else {
        router.push("/auth/login");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
      setLoggingIn(false);
    }
  };

  return (
    <div className="space-y-4 uppercase">
      <h2 className="text-lg font-semibold">Review Your Details</h2>

      <div className="bg-gray-50 border rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Full Name :</span>
          <span className="font-bold">
            {`${sessionData.firstName || ""} ${sessionData.middleName || ""} ${sessionData.lastName || ""}`}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Email :</span>
          <span className="font-bold">{sessionData.email || ""}</span>
        </div>

        <div className="flex justify-between">
          <span>Phone :</span>
          <span className="font-bold">{sessionData.mobile || ""}</span>
        </div>

        <div className="flex justify-between">
          <span>Gender :</span>
          <span className="font-bold">{sessionData.gender || ""}</span>
        </div>

        <div className="flex justify-between">
          <span>Civil Status :</span>
          <span className="font-bold">{sessionData.civilStatus || ""}</span>
        </div>

        <div className="flex justify-between">
          <span>Address :</span>
          <span className="font-bold">
            {`${sessionData.barangayName || ""}, ${sessionData.cityName || ""}, ${sessionData.provinceName || ""}`}
          </span>
        </div>

        <div className="flex justify-between">
          <span>ID Type :</span>
          <span className="font-bold">{sessionData.id_type || ""}</span>
        </div>

        <div className="mt-2">
          {sessionData.image_base64 ? (
            <img
              src={`data:image/jpeg;base64,${sessionData.image_base64}`}
              alt="Uploaded Government ID"
              className="w-48 h-auto rounded-lg border border-gray-300"
            />
          ) : (
            <span className="text-gray-400">No ID uploaded</span>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="button"
          onClick={backStep}
          disabled={loading || loggingIn}
          className="w-1/2 py-2 bg-gray-400 text-white rounded-lg"
        >
          Back
        </button>

        <Button
          type="button"
          icon="pi pi-check"
          loading={loading || loggingIn}
          onClick={onSubmit}
          className="w-1/2 py-2 bg-green-600 text-white rounded-lg"
        >
          {loading
            ? "Submitting..."
            : loggingIn
            ? "Logging in..."
            : "Submit"}
        </Button>
      </div>
    </div>
  );
}