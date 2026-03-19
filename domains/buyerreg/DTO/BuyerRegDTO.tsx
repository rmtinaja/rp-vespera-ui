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
export interface SavePasswordDTO {
  user_id: string; 
  password: string;
  confirm_password?: string; 
  ip_address?: string; 
}
export interface SaveRegisterDTO {
  first_name: string;
  middle_name?: string; // optional
  last_name: string;
  mobile: string;
  image?: string; // base64 or URL
  id_type?: string;
  province?: string;
  city?: string;
  barangay?: string;
  gender?: string;
  birth_date?: string;
  civil_status?: string;
  type_of_payor?: string;
  email?: string;
  password?: string;
  ip_address?: string;
}

export interface OtpVerificationDTO {
  name1: string;
  phone: string;
  module: string;
  otp: string;
}

export interface CheckMobileDTO {
  mobile: string;
}
export interface CheckEmailDTO {
  email: string;
}
export interface LocationDTO {
  code: string;
  name: string;
}
