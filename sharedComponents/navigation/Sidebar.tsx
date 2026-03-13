'use client'

import Link from "next/link"
import { useNavigation } from "./NavigationProvider"

export default function Sidebar() {

  const { modules, loading } = useNavigation()

  if (loading) {
    return <div className="p-4">Loading navigation...</div>
  }

  return (

    <div className="sidebar p-4 w-64 bg-gray-100">

      {modules.map((module) => (

        <div key={module.id} className="mb-4">

          <h3 className="font-semibold text-gray-700">
            {module.module_name}
          </h3>

          <div className="mt-2">

            {module.submodules.map((sub) => (

              <Link
                key={sub.id}
                href={sub.route}
                className="block pl-3 py-1 text-sm hover:text-blue-600"
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