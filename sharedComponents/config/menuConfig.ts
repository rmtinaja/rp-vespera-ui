import {
  LayoutDashboard,
  Clock,
  Receipt,
  CheckCircle,
  XCircle,
  Users,
  Settings,
  LucideIcon
} from "lucide-react"

export type MenuItem = {
  name: string
  href: string
  icon: LucideIcon
}

export type MenuConfig = {
  [key: string]: MenuItem[]
}

export const menuConfig: MenuConfig = {
  treasury: [
    { name: "Dashboard", href: "/page/treasury", icon: LayoutDashboard },
    { name: "In Progress", href: "/page/treasury/confirmation", icon: Clock },
    { name: "Transaction", href: "/page/treasury/transaction", icon: Receipt },
    { name: "Complete", href: "/page/treasury/complete", icon: CheckCircle },
    { name: "Cancelled", href: "/page/treasury/cancelled", icon: XCircle },
  ],
  admin: [
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ],
  default: [
    { name: "Sample Link", href: "/sample/ok", icon: LayoutDashboard }, // optional fallback icon
    { name: "Sample Link1", href: "/sample/ok1", icon: LayoutDashboard },
    { name: "Sample Link2", href: "/sample/ok2", icon: LayoutDashboard },
  ]
}