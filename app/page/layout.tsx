import Sidebar from "@/sharedComponents/navigation/Sidebar"
import { NavigationProvider } from "@/sharedComponents/navigation/NavigationProvider"

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NavigationProvider>
      <div className="flex min-h-screen p-2">
        <Sidebar />
        <main className="flex-1 p-6 h-full">
          {children}
        </main>
      </div>
    </NavigationProvider>
  )
}