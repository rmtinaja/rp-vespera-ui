import {
  SendOtpDTO,
  OtpVerificationDTO,
  VerifyIdDTO,
  OneTimeOtpVerificationDTO,
  SavePasswordDTO,
  SaveRegisterDTO,
  CheckEmailDTO,
  CheckMobileDTO,
} from "../DTO/BuyerRegDTO";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiService {
  private otpsend: string;
  private otpVerify: string;
  private oneTimeOtpVerify: string;
  private verifyUrl: string;
  private savePasswordUrl: string;
  private registerUrl: string;
  private checkEmailUrl: string;
  private checkMobileUrl: string;

  constructor() {
    if (!API_URL)
      throw new Error("API URL is not defined in environment variables");

    this.otpsend = `${API_URL}/sendOtp`;
    this.otpVerify = `${API_URL}/verifyOtp`;
    this.verifyUrl = `${API_URL}/verifyID`;
    this.oneTimeOtpVerify = `${API_URL}/verifyOneTimeOtp`;
    this.savePasswordUrl = `${API_URL}/save-password`;
    this.registerUrl = `${API_URL}/register`;
    this.checkEmailUrl = `${API_URL}/check-email`;
    this.checkMobileUrl = `${API_URL}/check-mobile`;
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
  async verifyOneTimeOtp(dto: OneTimeOtpVerificationDTO): Promise<void> {
    if (!dto.otp) throw new Error("OTP is required");
    if (!dto.phone || !dto.name1)
      throw new Error("Customer details are incomplete");

    const response = await fetch(this.oneTimeOtpVerify, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "OTP verification failed");
  }

  // -------------------- ID Verification --------------------
  async verifyId(dto: VerifyIdDTO): Promise<any> {
    if (!dto.gov_id) throw new Error("Government ID is required");

    const formData = new FormData();
    Object.entries(dto).forEach(([key, value]) => formData.append(key, value));

    const response = await fetch(this.verifyUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok || !data.success)
      throw new Error(data.message || "Verification failed");

    return data.data;
  }

  // -------------------- Save Password --------------------
  async savePassword(dto: SavePasswordDTO): Promise<any> {
    const response = await fetch(this.savePasswordUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.errors?.password?.[0] || "Password save failed");
    }

    return data;
  }

  // -------------------- Register --------------------
  async registerUser(dto: SaveRegisterDTO): Promise<any> {
    const response = await fetch(this.registerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json", // ✅ THIS FIXES 302
      },
      body: JSON.stringify(dto),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Registration failed");

    return data;
  }
  // -------------------- Check Email --------------------
  async checkEmail(dto: CheckEmailDTO): Promise<any> {
    const res = await fetch(
      `${this.checkEmailUrl}?email=${encodeURIComponent(dto.email)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    return await res.json();
  }

  // -------------------- Check Mobile --------------------
  async checkMobileUnique(dto: CheckMobileDTO): Promise<any> {
    const response = await fetch(
      `${this.checkMobileUrl}?mobile=${encodeURIComponent(dto.mobile)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    return await response.json();
  }
}
