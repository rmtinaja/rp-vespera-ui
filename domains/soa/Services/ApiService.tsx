import {
  SendOtpDTO,
  OtpVerificationDTO,
  SoaRequestDTO,
} from "../DTO/VerifyBparNameDTO";
import { VerifyBparNameDTO } from "../DTO/VerifyBparNameDTO";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiService {
  private otpsend: string;
  private otpVerify: string;
  private verifyBparNameUrl: string;
  private soaCustomerReportUrl: string;

  constructor() {
    if (!API_URL)
      throw new Error("API URL is not defined in environment variables");

    this.otpsend = `${API_URL}/sendOtp`;
    this.otpVerify = `${API_URL}/verifyOtp`;
    this.verifyBparNameUrl = `${API_URL}/soa/verifyBparName`;
    this.soaCustomerReportUrl = `${API_URL}/soa/soaCustomerReport`;
  }

  // -------------------- OTP --------------------
  static generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(dto: SendOtpDTO): Promise<void> {
    if (!dto.phone || !dto.fname || !dto.lname)
      throw new Error("Please fill required fields");

    const otp = ApiService.generateOtp();
    dto.otp = otp;
    dto.message = `Your OTP is ${otp}. It will expire in 5 minutes.`;

    const response = await fetch(this.otpsend, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to send OTP");
  }

  async verifyOtp(dto: OtpVerificationDTO): Promise<void> {
    if (!dto.otp) throw new Error("OTP is required");
    if (!dto.phone || !dto.name1)
      throw new Error("Customer details are incomplete");

    const response = await fetch(this.otpVerify, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "OTP verification failed");
  }

  async verifyBparName(dto: VerifyBparNameDTO): Promise<any> {
    const response = await fetch(this.verifyBparNameUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async soaCustomerReport(dto: SoaRequestDTO): Promise<any> {
    const response = await fetch(this.soaCustomerReportUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }
}
