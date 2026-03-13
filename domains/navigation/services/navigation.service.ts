import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const NavigationService = {

    getNavigation: async () => {

        const token = localStorage.getItem("token")

        const res = await axios.get(`${BASE_URL}/v1/navigation`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })

        return res.data
    }

}