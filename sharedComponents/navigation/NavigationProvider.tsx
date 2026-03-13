'use client'

import { createContext, useContext, useEffect, useState } from "react"
import { NavigationService } from "@/domains/navigation/services/navigation.service"

const NavigationContext = createContext<any>(null)

export function NavigationProvider({children}:{children:React.ReactNode}){

    const [modules,setModules] = useState([])

    useEffect(()=>{

        const loadNavigation = async ()=>{

            const res = await NavigationService.getNavigation()

            setModules(res.modules)

        }

        loadNavigation()

    },[])

    return(
        <NavigationContext.Provider value={{modules}}>
            {children}
        </NavigationContext.Provider>
    )

}

export const useNavigation = ()=>useContext(NavigationContext)