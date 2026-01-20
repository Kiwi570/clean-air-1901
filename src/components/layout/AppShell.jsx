import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { DevSwitcher } from './DevSwitcher'
import { NotificationsPanel } from './NotificationsPanel'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'
import { ROLES } from '@/lib/constants'

function AppShell({ role }) {
  const { user, isAuthenticated, loading } = useAuth()
  const { getUnreadCount } = useNotifications()
  const [showNotifications, setShowNotifications] = useState(false)

  const currentRole = role === ROLES.HOST ? 'host' : 'cleaner'
  const unreadNotifications = getUnreadCount(currentRole)

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-surface-500 font-medium">Chargement...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const isHost = role === ROLES.HOST

  return (
    <div className={cn(
      'min-h-screen',
      isHost ? 'bg-gradient-to-br from-accent-50/30 to-white' : 'bg-gradient-to-br from-brand-50/30 to-white'
    )}>
      <div className="flex">
        {/* Sidebar (desktop) */}
        <Sidebar role={role} />

        {/* Main Content */}
        <main className="flex-1 min-h-screen pb-20 lg:pb-0">
          {/* Top Header (Mobile) */}
          <header className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-surface-200">
            <div className="flex items-center justify-between px-4 py-3">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  isHost 
                    ? 'bg-gradient-to-br from-accent-500 to-accent-600' 
                    : 'bg-gradient-to-br from-brand-500 to-brand-600'
                )}>
                  <span className="text-white font-bold text-sm font-display">C</span>
                </div>
                <span className="font-display font-bold text-lg text-surface-900">
                  Clean<span className={isHost ? 'text-accent-500' : 'text-brand-500'}>Air</span>
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={cn(
                      'relative p-2 rounded-lg transition-colors',
                      showNotifications 
                        ? 'bg-surface-100 text-surface-700' 
                        : 'text-surface-500 hover:text-surface-700 hover:bg-surface-100'
                    )}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </button>
                  <NotificationsPanel 
                    isOpen={showNotifications} 
                    onClose={() => setShowNotifications(false)}
                    role={currentRole}
                  />
                </div>
                <Avatar 
                  src={user?.avatar}
                  name={user?.firstName || user?.email} 
                  size="sm"
                />
              </div>
            </div>
          </header>

          {/* Desktop Header */}
          <header className="hidden lg:flex items-center justify-between px-8 py-6 border-b border-surface-200 bg-white/50">
            <div>
              <h1 className="text-2xl font-bold text-surface-900 font-display">
                {user?.firstName 
                  ? `${getGreeting()}, ${user.firstName} 👋`
                  : `${getGreeting()} 👋`
                }
              </h1>
              <p className="text-surface-500 mt-1">
                {isHost 
                  ? 'Gérez vos biens et vos ménages' 
                  : 'Trouvez vos prochaines missions'
                }
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2.5 text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-xl transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={cn(
                    'relative p-2.5 rounded-xl transition-colors',
                    showNotifications 
                      ? 'bg-surface-100 text-surface-700' 
                      : 'text-surface-500 hover:text-surface-700 hover:bg-surface-100'
                  )}
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>
                <NotificationsPanel 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(false)}
                  role={currentRole}
                />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav role={role} />

      {/* Dev Switcher pour tester les rôles */}
      <DevSwitcher />
    </div>
  )
}

// Helper function for greeting
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

export { AppShell }
export default AppShell
