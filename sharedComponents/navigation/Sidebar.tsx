'use client'

import Link from "next/link"
import { useNavigation } from "./NavigationProvider"

export default function Sidebar(){

    const {modules} = useNavigation()

    return(

        <div className="sidebar">

            {modules.map((module:any)=>(

                <div key={module.id}>

                    <h3 className="font-semibold">
                        {module.module_name}
                    </h3>

                    {module.submodules.map((sub:any)=>(

                        <Link
                            key={sub.id}
                            href={sub.route}
                            className="block pl-3 py-1"
                        >
                            {sub.submodule_name}
                        </Link>

                    ))}

                </div>

            ))}

        </div>

    )

}