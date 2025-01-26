import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, Truck, Users, FileText, BarChart, Settings, Bell, LogOut } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { signOut } from 'next-auth/react'

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Package, label: 'Stock Management', href: '/stock' },
  { icon: Truck, label: 'Deliveries', href: '/deliveries' },
  { icon: Users, label: 'User Management', href: '/users' },
  { icon: FileText, label: 'Reports', href: '/reports' },
  { icon: BarChart, label: 'Analytics', href: '/analytics' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="w-64 bg-[#1C2434] h-full text-gray-300">
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
        <div className="flex items-center">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-eoRYViBYc9hMaESVZpS1IwT42KGCxZ.png"
            alt="GAS BY GAS"
            className="h-8 w-auto mr-2"
          />
        </div>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 ${
              pathname === item.href ? 'bg-gray-800 text-white' : ''
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {t(item.label)}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-64 mb-6">
        <Link
          href="/notifications"
          className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800"
        >
          <Bell className="h-5 w-5 mr-3" />
          {t('Notifications')}
        </Link>
        <Link
          href="/settings"
          className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800"
        >
          <Settings className="h-5 w-5 mr-3" />
          {t('Settings')}
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 w-full"
        >
          <LogOut className="h-5 w-5 mr-3" />
          {t('Logout')}
        </button>
      </div>
    </div>
  )
}

