import { NavigationProvider } from "@/sharedComponents/navigation/NavigationProvider"
import Sidebar from "@/sharedComponents/navigation/Sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {

  return (

    <NavigationProvider>

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-6">
          {children}
        </main>

      </div>

    </NavigationProvider>

  )
}