'use client'

import { useState } from "react"
import { AuthService } from "../Services/auth.service"
import { alert } from "@/sharedComponents/services/AlertService"

export default function OTPComponent({
    employeeId,
    onSuccess
}:{
    employeeId:number
    onSuccess:()=>void
}){

    const [otp,setOtp] = useState("")

    const verify = async () => {

        const res = await AuthService.verifyOTP({
            employee_id: employeeId,
            otp: Number(otp)
        })

        if(res.success){
            onSuccess()
        }else{
            alert.error("Invalid OTP")
        }
    }

    return(
        <div className="flex flex-col gap-3">

            <input
                placeholder="Enter OTP"
                className="input-field"
                onChange={(e)=>setOtp(e.target.value)}
            />

            <button
                className="bg-accent-rp text-white"
                onClick={verify}
            >
                Verify OTP
            </button>

        </div>
    )
}