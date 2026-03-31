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
} from "../DTO/pa.dto";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const PurchaseAgreementService = {
  getAvailableLots: async (
    params?: GetAvailableLotsRequest,
  ): Promise<AvailableLotsResponse> => {
    const res = await axios.get(`${BASE_URL}/pa/available-lot`, { params });

    return res.data;
  },
  getLotTypes: async (): Promise<LotTypeResponse> => {
    const res = await axios.get(`${BASE_URL}/pa/lottype`);
    return res.data;
  },
  getAmortTerms: async (): Promise<AmortTermResponse> => {
    const res = await axios.get(`${BASE_URL}/pa/amortterm`);
    return res.data;
  },
  checkAvailability: async (
    params: CheckLotParams,
  ): Promise<CheckLotResponse> => {
    const res = await axios.get(`${BASE_URL}/pa/check-lot`, { params });
    return res.data;
  },
  checkAmortization: async (
    params: CheckAmortizationParams,
  ): Promise<CheckAmortizationResponse> => {
    const res = await axios.get(`${BASE_URL}/pa/calculate-pricing`, { params });
    return res.data;
  },
};
