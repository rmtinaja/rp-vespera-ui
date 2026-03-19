'use client'
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { LockIcon, User2Icon } from "lucide-react"
import { AuthService } from "@/domains/auth/Services/auth.service"

export default function LoginUserComponent(){

    const router = useRouter()

    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [loading,setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        try{
            setLoading(true)

            const res = await AuthService.login({
                username,
                password
            })

            if(res.success){

                // Save token to cookie
                document.cookie = `token=${res.token}; path=/`

                router.push("/page/select-module")

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
        <>
            <div className="login">
                <div className="logincontainer">

                    <header className="font-semibold">Login</header>

                    <form
                        className="mt-3 flex flex-col gap-4"
                        onSubmit={handleLogin}
                    >

                        <div>
                            <label htmlFor="username">
                                Username
                            </label>

                            <div className='input-text-container'>
                                <User2Icon/>

                                <input
                                    type="text"
                                    id="username"
                                    className='input-field'
                                    value={username}
                                    onChange={(e)=>setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password">
                                Password
                            </label>

                            <div className='input-text-container'>
                                <LockIcon/>

                                <input
                                    type="password"
                                    id="password"
                                    className='input-field'
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className='flex flex-col w-full items-center gap-3'>

                            <button
                                className='bg-accent-rp text-white w-full'
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>

                            <Link href="/auth/register">
                                Create New Account
                            </Link>

                        </div>

                    </form>

                </div>
            </div>
        </>
    )
}