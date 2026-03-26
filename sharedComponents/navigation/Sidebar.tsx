'use client'

import Link from "next/link"
import { useNavigation } from "./NavigationProvider"
import { usePathname } from "next/navigation"
import { menuConfig } from "@/sharedComponents/config/menuConfig"

export default function Sidebar() {
  const { modules, loading } = useNavigation()
  const pathname = usePathname()

  const segments = pathname.split("/")
  const currentPage = segments[2] // treasury
  const currentSubPage = segments[3] // confirmation (optional)

  if (loading) {
    return <div className="p-4">Loading navigation...</div>
  }

  const menu = menuConfig[currentPage] || menuConfig.default

  return (
    <div className="sidebar p-4 w-64 bg-accent-rp text-white rounded-md">
      {menu.map((item) => {
        const Icon = item.icon

        // ✅ active check
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 pl-3 py-2 text-sm rounded-md duration-200
              ${isActive ? "bg-[#B18343]" : "hover:bg-[#B18343]/70"}
            `}
          >
            {Icon && (
              <Icon
                size={18}
                className={isActive ? "text-white" : "text-white/80"}
              />
            )}
            <span>{item.name}</span>
          </Link>
        )
      })}
    </div>
  )
}