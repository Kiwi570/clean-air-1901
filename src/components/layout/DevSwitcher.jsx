import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Sparkles, RefreshCw, X, MessageCircle, Bell } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useMessages } from '@/hooks/useMessages'
import { useMissions } from '@/hooks/useMissions'
import { useNotifications } from '@/hooks/useNotifications'
import { ROLES } from '@/lib/constants'
import { cn } from '@/lib/utils'

function DevSwitcher() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, switchRole } = useAuth()
  const { getUnreadCount: getUnreadMessages, resetMessages } = useMessages()
  const { resetMissions } = useMissions()
  const { getUnreadCount: getUnreadNotifications, resetNotifications } = useNotifications()

  const currentRole = location.pathname.startsWith('/host') ? ROLES.HOST : ROLES.CLEANER
  const isHost = currentRole === ROLES.HOST

  const unreadMessagesHost = getUnreadMessages('host')
  const unreadMessagesCleaner = getUnreadMessages('cleaner')
  const unreadNotifsHost = getUnreadNotifications('host')
  const unreadNotifsCleaner = getUnreadNotifications('cleaner')
  
  const totalHost = unreadMessagesHost + unreadNotifsHost
  const totalCleaner = unreadMessagesCleaner + unreadNotifsCleaner
  const otherUnread = isHost ? totalCleaner : totalHost

  const handleSwitch = (targetRole) => {
    if (targetRole === currentRole) return
    
    setIsAnimating(true)
    
    // Animation de transition
    setTimeout(() => {
      switchRole(targetRole)
      if (targetRole === ROLES.HOST) {
        navigate('/host')
      } else {
        navigate('/cleaner')
      }
      setIsAnimating(false)
      setIsExpanded(false)
    }, 300)
  }

  const handleResetAll = () => {
    resetMessages()
    resetMissions()
    resetNotifications()
    setIsExpanded(false)
  }

  return (
    <>
      {/* Overlay pour fermer */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Dev Switcher */}
      <div className={cn(
        'fixed z-50 transition-all duration-300',
        'bottom-20 lg:bottom-6 right-4 lg:right-6'
      )}>
        {/* Panel étendu */}
        {isExpanded && (
          <div className="absolute bottom-full right-0 mb-3 animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-2xl border border-surface-200 p-4 min-w-[280px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-accent-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">DEV</span>
                  </div>
                  <span className="font-semibold text-surface-900">Mode Test</span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-surface-400" />
                </button>
              </div>

              {/* Role Buttons */}
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => handleSwitch(ROLES.HOST)}
                  className={cn(
                    'w-full flex items-center justify-between p-3 rounded-xl transition-all',
                    currentRole === ROLES.HOST
                      ? 'bg-accent-50 border-2 border-accent-300'
                      : 'bg-surface-50 border-2 border-transparent hover:border-surface-200'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      currentRole === ROLES.HOST
                        ? 'bg-accent-500 text-white'
                        : 'bg-surface-200 text-surface-600'
                    )}>
                      <Home className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className={cn(
                        'font-semibold',
                        currentRole === ROLES.HOST ? 'text-accent-700' : 'text-surface-700'
                      )}>
                        Espace Hôte
                      </p>
                      <p className="text-xs text-surface-500">Marie Dupont</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {totalHost > 0 && (
                      <span className="px-2 py-0.5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Bell className="w-3 h-3" />
                        {totalHost}
                      </span>
                    )}
                    {currentRole === ROLES.HOST && (
                      <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => handleSwitch(ROLES.CLEANER)}
                  className={cn(
                    'w-full flex items-center justify-between p-3 rounded-xl transition-all',
                    currentRole === ROLES.CLEANER
                      ? 'bg-brand-50 border-2 border-brand-300'
                      : 'bg-surface-50 border-2 border-transparent hover:border-surface-200'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      currentRole === ROLES.CLEANER
                        ? 'bg-brand-500 text-white'
                        : 'bg-surface-200 text-surface-600'
                    )}>
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className={cn(
                        'font-semibold',
                        currentRole === ROLES.CLEANER ? 'text-brand-700' : 'text-surface-700'
                      )}>
                        Espace Cleaner
                      </p>
                      <p className="text-xs text-surface-500">Thomas L.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {totalCleaner > 0 && (
                      <span className="px-2 py-0.5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Bell className="w-3 h-3" />
                        {totalCleaner}
                      </span>
                    )}
                    {currentRole === ROLES.CLEANER && (
                      <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </button>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleResetAll}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-surface-500 hover:text-surface-700 hover:bg-surface-50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Réinitialiser la démo
              </button>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'relative flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105',
            isHost
              ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white'
              : 'bg-gradient-to-r from-brand-500 to-brand-600 text-white',
            isAnimating && 'animate-pulse scale-95'
          )}
        >
          {/* Current Role Icon */}
          <div className="flex items-center gap-2">
            {isHost ? (
              <Home className="w-5 h-5" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            <span className="font-semibold text-sm hidden sm:inline">
              {isHost ? 'Hôte' : 'Cleaner'}
            </span>
          </div>

          {/* Separator */}
          <div className="w-px h-5 bg-white/30" />

          {/* Other Role with Badge */}
          <div className="relative flex items-center">
            {isHost ? (
              <Sparkles className="w-5 h-5 opacity-60" />
            ) : (
              <Home className="w-5 h-5 opacity-60" />
            )}
            {otherUnread > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                {otherUnread}
              </span>
            )}
          </div>
        </button>

        {/* Tooltip */}
        {!isExpanded && (
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-surface-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
              Cliquez pour changer de rôle
            </div>
          </div>
        )}
      </div>

      {/* Transition Overlay */}
      {isAnimating && (
        <div className="fixed inset-0 z-[60] bg-white/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center animate-spin-slow',
              isHost 
                ? 'bg-gradient-to-br from-brand-500 to-brand-600' 
                : 'bg-gradient-to-br from-accent-500 to-accent-600'
            )}>
              {isHost ? (
                <Sparkles className="w-8 h-8 text-white" />
              ) : (
                <Home className="w-8 h-8 text-white" />
              )}
            </div>
            <p className="font-medium text-surface-600">
              Changement de rôle...
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export { DevSwitcher }
export default DevSwitcher
