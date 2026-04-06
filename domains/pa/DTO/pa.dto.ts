export interface Lot {
  lottype_name: string;
  lot_available: string;
}

export interface LotsData {
  lots: Lot[];
}

export interface AvailableLotsResponse {
  success: boolean;
  data: LotsData;
}

export interface GetAvailableLotsRequest {
  lottype?: string;
  area_no?: string;
  block_no?: string;
  lot_no?: string;
}

export interface LotType {
  mp_i_lottype_id: number;
  type: string;
}

export interface LotTypeData {
  lottype: LotType[];
}

export interface LotTypeResponse {
  success: boolean;
  data: LotTypeData;
}

export interface AmortTerm {
  mp_i_amort_term: number;
  description: string;
  num_months: number;
}

export interface AmortTermData {
  amortterm: AmortTerm[];
}

export interface AmortTermResponse {
  success: boolean;
  data: AmortTermData;
}

export interface checkLot {
  lot_id: string;
  area_no: string;
  block_no: string;
  lot_no: string;
  mp_i_lottype_id: number;
  lottype_name: string;
}

export interface CheckLotResponse {
  success: boolean;
  data?: {
    lot: checkLot;
  };
  message?: string;
}

export interface CheckLotParams {
  lot_identifier: string;
  lottype: string;
}

export interface CheckAmortizationResponse {
  success: boolean;
  data: {
    lot: {
      lotId: number;
      lottype: string;
      pcfAccount: number;
    };
    spotcash: {
      amtSales: number;
      amtPcf: number;
      amtVat: number;
      amtSpotcash: number;
    };
    amort: {
      contractPrice: number;
      amtAmortSales: number;
      amtAmortPcf: number;
      amtAmortVat: number;
      amtAmortPrice: number;
    };
    contract: {
      numMonths: number;
      amtContract: number;
      totalContractPrice: number;
    };
  };
}

export interface CheckAmortizationParams {
  lot_id: number;
  amort_term_id?: number;
  payment_scheme_id: number;
}