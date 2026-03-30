export interface TransactionDTO {
  official_receipt_no: string;
  avc_receipt_no: string;
  id: number;
  doc_id: string;
  date_encoded: string;
  date_deposited: string;
  payment_type: string;
  organization: string;
  phone_number: string;
  mp_i_owner_id: number;
  mp_i_lot_id: string;
  lot_sales_payment: string;
  total_payment: string;
  description: string | null;
  attachment: string;
  lot_number: string;
  notes: string;
  is_merged: number;
  name?: string;
  reference_number?: number;
}