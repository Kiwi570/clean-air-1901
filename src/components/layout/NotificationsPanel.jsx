import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Bell, X, CheckCircle, Clock, Star, MessageCircle, 
  Sparkles, Calendar, AlertCircle, Check
} from 'lucide-react'
import { useNotifications, NOTIFICATION_TYPES } from '@/hooks/useNotifications'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

function NotificationsPanel({ isOpen, onClose, role }) {
  const navigate = useNavigate()
  const { 
    getNotifications, 
    getUnreadCount, 
    markAsRead, 
    markAllAsRead,
    removeNotification 
  } = useNotifications()

  const notifications = getNotifications(role)
  const unreadCount = getUnreadCount(role)

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
      onClose()
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.MISSION_CREATED:
        return <Sparkles className="w-5 h-5 text-brand-500" />
      case NOTIFICATION_TYPES.MISSION_APPLIED:
        return <Clock className="w-5 h-5 text-amber-500" />
      case NOTIFICATION_TYPES.MISSION_CONFIRMED:
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case NOTIFICATION_TYPES.MISSION_REJECTED:
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case NOTIFICATION_TYPES.MISSION_STARTED:
        return <Sparkles className="w-5 h-5 text-blue-500" />
      case NOTIFICATION_TYPES.MISSION_COMPLETED:
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case NOTIFICATION_TYPES.MISSION_RATED:
        return <Star className="w-5 h-5 text-amber-500" />
      case NOTIFICATION_TYPES.NEW_MESSAGE:
        return <MessageCircle className="w-5 h-5 text-brand-500" />
      default:
        return <Bell className="w-5 h-5 text-surface-500" />
    }
  }

  const formatTime = (timestamp) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "À l'instant"
    if (minutes < 60) return `Il y a ${minutes} min`
    if (hours < 24) return `Il y a ${hours}h`
    if (days === 1) return 'Hier'
    if (days < 7) return `Il y a ${days} jours`
    return new Date(timestamp).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-surface-200 z-50 overflow-hidden animate-fade-in-down">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-surface-600" />
            <h3 className="font-semibold text-surface-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-brand-100 text-brand-700 text-xs font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead(role)}
                className="text-xs text-brand-600 hover:text-brand-700 font-medium"
              >
                Tout marquer lu
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-surface-400" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-surface-400" />
              </div>
              <p className="text-surface-500">Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    'p-4 cursor-pointer transition-colors',
                    notification.read 
                      ? 'bg-white hover:bg-surface-50' 
                      : 'bg-brand-50/50 hover:bg-brand-50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      notification.read ? 'bg-surface-100' : 'bg-white'
                    )}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          'font-medium text-sm',
                          notification.read ? 'text-surface-700' : 'text-surface-900'
                        )}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-surface-500 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-surface-400 mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-surface-100 bg-surface-50">
            <Button 
              variant="ghost" 
              size="sm" 
              fullWidth
              onClick={() => {
                // TODO: navigate to notifications page
                onClose()
              }}
            >
              Voir toutes les notifications
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export { NotificationsPanel }
export default NotificationsPanel
