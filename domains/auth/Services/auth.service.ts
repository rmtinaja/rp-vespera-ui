import axios from "axios"
import {
    EmployeeRegistrationLookupRequest,
    VerifyOTPRequest,
    PasswordConfirmationRequest
} from "../DTO/auth.dto"


const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const AuthService = {

    lookupEmployee: async (payload: EmployeeRegistrationLookupRequest) => {
        const res = await axios.post(`${BASE_URL}/employee/lookup`, payload)
        return res.data
    },

    sendOTP: async (employeeId: number) => {
        const res = await axios.post(`${BASE_URL}/employee/send-otp`, {
            employee_id: employeeId
        })
        return res.data
    },

    verifyOTP: async (payload: VerifyOTPRequest) => {
        const res = await axios.post(`${BASE_URL}/employee/verify-otp`, payload)
        return res.data
    },

    createPassword: async (payload: PasswordConfirmationRequest) => {
        const res = await axios.post(`${BASE_URL}/employee/create-password`, payload)
        return res.data
    },

    login: async (payload: { username: string; password: string }) => {
        const res = await axios.post(`${BASE_URL}/v1/login`, payload)
        const token = res.data.token
        if(token){
            localStorage.setItem("token", token)
        }
        return res.data
    },

    user: async () => {

        const token = localStorage.getItem("token")

        const res = await axios.get(`${BASE_URL}/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data
    },

    logout: async () => {

        const token = localStorage.getItem("token")

        await axios.post(`${BASE_URL}/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        localStorage.removeItem("token")
    }

}