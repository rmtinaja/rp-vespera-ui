'use client'

import { useState } from "react"
import { AuthService } from "../Services/auth.service"

export default function LookupComponent({onSuccess}:{onSuccess:(id:number)=>void}){

    const [firstname,setFirstname] = useState("")
    const [lastname,setLastname] = useState("")

    const lookup = async () => {
        const res = await AuthService.lookupEmployee({
            firstname,
            lastname
        })
        await AuthService.sendOTP(res.employee_id)
        onSuccess(res.employee_id)
    }
    return(
        <div className="flex flex-col gap-3">
            <input placeholder="First Name" className="input-field" onChange={(e)=>setFirstname(e.target.value)}/>
            <input placeholder="Last Name" className="input-field" onChange={(e)=>setLastname(e.target.value)}/>
            <button className="bg-accent-rp text-white" onClick={lookup}>
                Verify Employee
            </button>
        </div>
    )
}