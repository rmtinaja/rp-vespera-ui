export interface VerifyBparNameDTO {
  firstname: string;
  middlename?: string; 
  lastname: string;
}

export interface VerifyIdDTO {
  gov_id: File;
  fname: string;
  mname?: string;
  lname: string;
  province: string;
  city: string;
  barangay: string;
}

export interface SendOtpDTO {
  phone: string;
  fname: string;
  mname?: string | null;
  lname: string;
  module: string;
  otp: string;
  message: string;
}

export interface OtpVerificationDTO {
  name1: string;
  phone: string;
  module: string;
  otp: string;
}

export interface SoaRequestDTO {
  bparId: string;
  ownerId: string;
  lot?: string;
  lotIds?: number[];
}
