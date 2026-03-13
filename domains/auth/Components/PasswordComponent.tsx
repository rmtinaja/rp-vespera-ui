'use client'

import { useState } from "react"
import { AuthService } from "../Services/auth.service"
import { alert } from "@/sharedComponents/services/AlertService"

export default function PasswordComponent({employeeId}:{employeeId:number}){

    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")

    const createPassword = async () => {

        if(password !== confirmPassword){
            alert.error("Passwords do not match")
            return
        }

        await AuthService.createPassword({
            employee_id: employeeId,
            password,
            confirmPassword
        })

        alert.success("Account created successfully",{
            redirect:"/auth/login"
        })
    }

    return(
        <div className="flex flex-col gap-3">

            <input
                type="password"
                placeholder="Password"
                className="input-field"
                onChange={(e)=>setPassword(e.target.value)}
            />

            <input
                type="password"
                placeholder="Confirm Password"
                className="input-field"
                onChange={(e)=>setConfirmPassword(e.target.value)}
            />

            <button
                className="bg-accent-rp text-white"
                onClick={createPassword}
            >
                Create Password
            </button>

        </div>
    )
}