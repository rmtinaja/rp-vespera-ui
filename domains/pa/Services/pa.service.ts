import axios from "axios";
import {
  AvailableLotsResponse,
  GetAvailableLotsRequest,
  LotTypeResponse,
  AmortTermResponse,
  CheckLotResponse,
  CheckLotParams,
  CheckAmortizationParams,
  CheckAmortizationResponse,
  SavePurchaseAgreementParams,
} from "../DTO/pa.dto";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// ✅ Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export const PurchaseAgreementService = {
  getAvailableLots: async (
    params?: GetAvailableLotsRequest,
  ): Promise<AvailableLotsResponse> => {
    const res = await api.get(`/pa/available-lot`, { params });
    return res.data;
  },

  getLotTypes: async (): Promise<LotTypeResponse> => {
    const res = await api.get(`/pa/lottype`);
    return res.data;
  },

  getAmortTerms: async (): Promise<AmortTermResponse> => {
    const res = await api.get(`/pa/amortterm`);
    return res.data;
  },

  checkAvailability: async (
    params: CheckLotParams,
  ): Promise<CheckLotResponse> => {
    const res = await api.get(`/pa/check-lot`, { params });
    return res.data;
  },

  checkAmortization: async (
    params: CheckAmortizationParams,
  ): Promise<CheckAmortizationResponse> => {
    const res = await api.get(`/pa/calculate-pricing`, { params });
    return res.data;
  },

  savePurchaseAgreement: async (
    params: SavePurchaseAgreementParams,
  ): Promise<any> => {
    const res = await api.post(`/pa/purchase-agreement`, params);
    return res.data;
  },
};