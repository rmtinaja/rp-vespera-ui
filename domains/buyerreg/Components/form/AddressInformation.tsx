import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { LocationService, LocationDTO } from "@/sharedComponents/services/LocationService";

interface Step4Props {
  nextStep: () => void;
  backStep: () => void;
}

export default function Step4({ nextStep, backStep }: Step4Props) {
  const [form, setForm] = useState({
    province: localStorage.getItem("province") || "",
    provinceName: localStorage.getItem("provinceName") || "",
    city: localStorage.getItem("city") || "",
    cityName: localStorage.getItem("cityName") || "",
    barangay: localStorage.getItem("barangay") || "",
    barangayName: localStorage.getItem("barangayName") || "",
  });

  const [provinces, setProvinces] = useState<LocationDTO[]>([]);
  const [cities, setCities] = useState<LocationDTO[]>([]);
  const [barangays, setBarangays] = useState<LocationDTO[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const data = await LocationService.getProvinces();
        setProvinces(data);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (!form.province) {
      setCities([]);
      setBarangays([]);
      return;
    }

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const data = await LocationService.getCities(form.province);
        setCities(data);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [form.province]);

  useEffect(() => {
    if (!form.city) {
      setBarangays([]);
      return;
    }

    const fetchBarangays = async () => {
      setLoadingBarangays(true);
      try {
        const data = await LocationService.getBarangays(form.city);
        setBarangays(data);
      } finally {
        setLoadingBarangays(false);
      }
    };
    fetchBarangays();
  }, [form.city]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedForm = { ...form };

    if (name === "province") {
      const selectedProvince = provinces.find((p) => p.code === value);
      updatedForm.province = value;
      updatedForm.provinceName = selectedProvince?.name || "";
      updatedForm.city = "";
      updatedForm.cityName = "";
      updatedForm.barangay = "";
      updatedForm.barangayName = "";
      localStorage.setItem("province", updatedForm.province);
      localStorage.setItem("provinceName", updatedForm.provinceName);
      localStorage.removeItem("city");
      localStorage.removeItem("cityName");
      localStorage.removeItem("barangay");
      localStorage.removeItem("barangayName");
    } else if (name === "city") {
      const selectedCity = cities.find((c) => c.code === value);
      updatedForm.city = value;
      updatedForm.cityName = selectedCity?.name || "";
      updatedForm.barangay = "";
      updatedForm.barangayName = "";
      localStorage.setItem("city", updatedForm.city);
      localStorage.setItem("cityName", updatedForm.cityName);
      localStorage.removeItem("barangay");
      localStorage.removeItem("barangayName");
    } else if (name === "barangay") {
      const selectedBarangay = barangays.find((b) => b.code === value);
      updatedForm.barangay = value;
      updatedForm.barangayName = selectedBarangay?.name || "";
      localStorage.setItem("barangay", updatedForm.barangay);
      localStorage.setItem("barangayName", updatedForm.barangayName);
    }

    setForm(updatedForm);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-700">
        Address Information
      </h3>

      {/* Province */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Province <span className="text-red-700">*</span>
        </label>
        <select
          name="province"
          value={form.province}
          onChange={handleChange}
          className="bg-white w-full rounded-lg px-3 py-2"
          disabled={loadingProvinces}
        >
          <option value="">
            {loadingProvinces ? "Loading provinces..." : "Select Province"}
          </option>
          {provinces.map((prov) => (
            <option key={prov.code} value={prov.code}>
              {prov.name}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          City <span className="text-red-700">*</span>
        </label>
        <select
          name="city"
          value={form.city}
          onChange={handleChange}
          disabled={!form.province || loadingCities}
          className="bg-white w-full rounded-lg px-3 py-2"
        >
          <option value="">
            {loadingCities ? "Loading cities..." : "Select City"}
          </option>
          {cities.map((city) => (
            <option key={city.code} value={city.code}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Barangay */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Barangay <span className="text-red-700">*</span>
        </label>
        <select
          name="barangay"
          value={form.barangay}
          onChange={handleChange}
          disabled={!form.city || loadingBarangays}
          className="bg-white w-full rounded-lg px-3 py-2"
        >
          <option value="">
            {loadingBarangays ? "Loading barangays..." : "Select Barangay"}
          </option>
          {barangays.map((brgy) => (
            <option key={brgy.code} value={brgy.code}>
              {brgy.name}
            </option>
          ))}
        </select>
      </div>

      <div className="gap-2 flex">
        <Button
          className="w-1/2 bg-accent justify-center !border-none text-white rounded-lg"
          onClick={backStep}
        >
          Back
        </Button>

        <Button
          className="w-1/2 btn-primary justify-center text-white rounded-lg"
          onClick={nextStep}
        >
          Next
        </Button>
      </div>
    </div>
  );
}