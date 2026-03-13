'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCheck, CheckCircle2 } from "lucide-react"

export default function Dashboard(){
    const router = useRouter()
    const selectModule = () => {
        router.push("/role-template");
    }
    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(!token){
            router.push("/auth/login")
        }
    },[])
    return(
        <div className="page login">
            <div className="flex-row-center">
                <img src="/rpico.png" alt="" className="w-46" />
                <img src="/vesico.png" alt=""  className="w-70"/>
            </div>
            <div className="logincontainer">
                <header className="font-semibold font-nunito">Select Project</header>
                <table className="projecttable">
                    <thead className="header">
                        <tr>
                            <td>Project Code</td>
                            <td>Project dedscription</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody className="hover:bg-[#00303a] duration-300 motion-reduce:duration-0 hover:text-white">
                        <tr onClick={selectModule}>
                            <td>PR01</td>
                            <td>Module Creation and Assignment</td>
                            <td><CheckCircle2/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}