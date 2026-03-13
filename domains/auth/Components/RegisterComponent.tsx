'use client'

import { useState } from "react"
import ModalComponent from "@/sharedComponents/ModalComponent"
import LookupComponent from "./LookupComponent"
import OTPComponent from "./OTPComponent"
import PasswordComponent from "./PasswordComponent"

export default function RegisterComponent(){

    const [open,setOpen] = useState(false)
    const [step,setStep] = useState(1)
    const [employeeId,setEmployeeId] = useState<number>()

    return(
        <>
            <button
                className="bg-accent-rp text-white"
                onClick={()=>setOpen(true)}
            >
                Register
            </button>

            <ModalComponent
                isOpen={open}
                onClose={()=>setOpen(false)}
                title="Employee Registration"
            >

                {step === 1 && (
                    <LookupComponent
                        onSuccess={(id:number)=>{
                            setEmployeeId(id)
                            setStep(2)
                        }}
                    />
                )}

                {step === 2 && (
                    <OTPComponent
                        employeeId={employeeId!}
                        onSuccess={()=>setStep(3)}
                    />
                )}

                {step === 3 && (
                    <PasswordComponent
                        employeeId={employeeId!}
                    />
                )}

            </ModalComponent>
        </>
    )
}