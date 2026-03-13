'use client'

import { useState } from "react"
import { AuthService } from "../Services/auth.service"
import { useRouter } from "next/navigation"

export default function LoginComponent(){

    const router = useRouter()

    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [loading,setLoading] = useState(false)

    const handleLogin = async () => {

        try{

            setLoading(true)

            const res = await AuthService.login({
                username,
                password
            })

            if(res.success){

                router.push("/dashboard")

            }else{

                alert(res.message)

            }

        }catch(error:any){

            alert(error.response?.data?.message || "Login failed")

        }finally{

            setLoading(false)

        }

    }

    return(
        <div className="login">

            <div className="logincontainer">

                <header className="font-semibold">Login</header>

                <div className="mt-3 flex flex-col gap-4">

                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            className="input-field"
                            onChange={(e)=>setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            className="input-field"
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        className="bg-accent-rp text-white"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </div>

            </div>

        </div>
    )
}