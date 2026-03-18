'use client'

import Link from "next/link"
import { useNavigation } from "./NavigationProvider"

export default function Sidebar() {

  const { modules, loading } = useNavigation()

  if (loading) {
    return <div className="p-4">Loading navigation...</div>
  }

  return (

    <div className="sidebar p-4 w-64 bg-accent-rp text-white rounded-md">

      {modules.map((module) => (

        <div key={module.id} className="mb-4">

          <h3 className="font-semibold">
            {module.module_name}
          </h3>

          <div className="mt-2">

            {module.submodules.map((sub) => (

              <Link
                key={sub.id}
                href={sub.route}
                className="block pl-3 py-2 text-sm hover:bg-[#B18343] duration-200 rounded-md"
              >
                {sub.submodule_name}
              </Link>

            ))}

          </div>

        </div>

      ))}

    </div>

  )
}