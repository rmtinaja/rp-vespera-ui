export interface EmployeeRegistrationLookupRequest {
    firstname: string
    lastname: string
}

export interface EmployeeRegistrationLookupResponse {
    s_bpartner_employee_id: number
    phone: string
}

export interface SendOTPResponse {
    message: string
}

export interface VerifyOTPRequest {
    employee_id: number
    otp: number
}

export interface PasswordConfirmationRequest {
    employee_id: number
    password: string
    confirmPassword: string
}