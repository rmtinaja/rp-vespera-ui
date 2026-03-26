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