import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

