'use client'

import { createContext, useContext, useEffect, useState } from "react"
import { NavigationService } from "@/domains/navigation/services/navigation.service"
import { Module } from "@/sharedComponents/navigation/types/navigation.types"

interface NavigationContextType {
  modules: Module[]
  loading: boolean
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export function NavigationProvider({ children }: { children: React.ReactNode }) {

  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const loadNavigation = async () => {

      try {
        const res = await NavigationService.getNavigation()

        setModules(res.modules)

      } catch (error) {

        console.error("Navigation error", error)

      } finally {

        setLoading(false)

      }

    }

    loadNavigation()

  }, [])

  return (
    <NavigationContext.Provider value={{ modules, loading }}>
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigation = () => {

  const context = useContext(NavigationContext)

  if (!context) {
    throw new Error("useNavigation must be used inside NavigationProvider")
  }

  return context
}