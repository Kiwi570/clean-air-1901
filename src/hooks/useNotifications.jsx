import { useState, useEffect, useCallback, createContext, useContext } from 'react'

const NotificationsContext = createContext(null)

// Types de notifications
export const NOTIFICATION_TYPES = {
  MISSION_CREATED: 'mission_created',
  MISSION_APPLIED: 'mission_applied',
  MISSION_CONFIRMED: 'mission_confirmed',
  MISSION_REJECTED: 'mission_rejected',
  MISSION_STARTED: 'mission_started',
  MISSION_COMPLETED: 'mission_completed',
  MISSION_RATED: 'mission_rated',
  NEW_MESSAGE: 'new_message',
}

// Notifications initiales pour la démo
const initialNotifications = [
  {
    id: 'notif-1',
    type: NOTIFICATION_TYPES.MISSION_CONFIRMED,
    title: 'Mission confirmée !',
    message: 'Marie a confirmé votre candidature pour Studio Marais',
    forRole: 'cleaner',
    read: false,
    actionUrl: '/cleaner/missions/mission-1',
    missionId: 'mission-1',
    createdAt: Date.now() - 79200000,
  },
  {
    id: 'notif-2',
    type: NOTIFICATION_TYPES.MISSION_RATED,
    title: 'Nouvel avis reçu ⭐',
    message: 'Marie vous a donné 5 étoiles pour Studio Marais',
    forRole: 'cleaner',
    read: true,
    actionUrl: '/cleaner/earnings',
    missionId: 'mission-old-1',
    createdAt: Date.now() - 165600000,
  },
]

const STORAGE_KEY = 'cleanair_notifications'

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : initialNotifications
    } catch {
      return initialNotifications
    }
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  // Obtenir les notifications pour un rôle
  const getNotifications = useCallback((role) => {
    return notifications
      .filter(n => n.forRole === role)
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [notifications])

  // Obtenir le nombre de notifications non lues
  const getUnreadCount = useCallback((role) => {
    return notifications.filter(n => n.forRole === role && !n.read).length
  }, [notifications])

  // Ajouter une notification
  const addNotification = useCallback((notification) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      ...notification,
      read: false,
      createdAt: Date.now(),
    }
    setNotifications(prev => [newNotif, ...prev])
    return newNotif
  }, [])

  // Marquer une notification comme lue
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === notificationId) {
        return { ...n, read: true }
      }
      return n
    }))
  }, [])

  // Marquer toutes les notifications comme lues pour un rôle
  const markAllAsRead = useCallback((role) => {
    setNotifications(prev => prev.map(n => {
      if (n.forRole === role) {
        return { ...n, read: true }
      }
      return n
    }))
  }, [])

  // Supprimer une notification
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }, [])

  // Créer des notifications pour les différents événements
  const notifyMissionCreated = useCallback((mission) => {
    addNotification({
      type: NOTIFICATION_TYPES.MISSION_CREATED,
      title: 'Nouvelle mission disponible ! 🆕',
      message: `${mission.propertyName} - ${mission.date} à ${mission.time} (${mission.price}€)`,
      forRole: 'cleaner',
      actionUrl: `/cleaner/missions/${mission.id}`,
      missionId: mission.id,
    })
  }, [addNotification])

  const notifyMissionApplied = useCallback((mission) => {
    addNotification({
      type: NOTIFICATION_TYPES.MISSION_APPLIED,
      title: 'Nouvelle candidature ! 👋',
      message: `${mission.cleanerName} a postulé pour ${mission.propertyName}`,
      forRole: 'host',
      actionUrl: `/host/bookings`,
      missionId: mission.id,
    })
  }, [addNotification])

  const notifyMissionConfirmed = useCallback((mission) => {
    addNotification({
      type: NOTIFICATION_TYPES.MISSION_CONFIRMED,
      title: 'Mission confirmée ! ✅',
      message: `${mission.hostName} a confirmé votre candidature pour ${mission.propertyName}`,
      forRole: 'cleaner',
      actionUrl: `/cleaner/missions/${mission.id}`,
      missionId: mission.id,
    })
  }, [addNotification])

  const notifyMissionRejected = useCallback((mission) => {
    addNotification({
      type: NOTIFICATION_TYPES.MISSION_REJECTED,
      title: 'Candidature non retenue',
      message: `Votre candidature pour ${mission.propertyName} n'a pas été retenue`,
      forRole: 'cleaner',
      actionUrl: `/cleaner/missions`,
      missionId: mission.id,
    })
  }, [addNotification])

  const notifyMissionStarted = useCallback((mission) => {
    addNotification({
      type: NOTIFICATION_TYPES.MISSION_STARTED,
      title: 'Ménage en cours 🧹',
      message: `${mission.cleanerName} a commencé le ménage de ${mission.propertyName}`,
      forRole: 'host',
      actionUrl: `/host/bookings`,
      missionId: mission.id,
    })
  }, [addNotification])

  const notifyMissionCompleted = useCallback((mission) => {
    addNotification({
      type: NOTIFICATION_TYPES.MISSION_COMPLETED,
      title: 'Ménage terminé ! ✨',
      message: `Le ménage de ${mission.propertyName} est terminé. N'oubliez pas de noter !`,
      forRole: 'host',
      actionUrl: `/host/bookings`,
      missionId: mission.id,
    })
  }, [addNotification])

  const notifyMissionRated = useCallback((mission, rating) => {
    addNotification({
      type: NOTIFICATION_TYPES.MISSION_RATED,
      title: `Nouvel avis reçu ${'⭐'.repeat(rating)}`,
      message: `${mission.hostName} vous a donné ${rating} étoile${rating > 1 ? 's' : ''} pour ${mission.propertyName}`,
      forRole: 'cleaner',
      actionUrl: `/cleaner/earnings`,
      missionId: mission.id,
    })
  }, [addNotification])

  const notifyNewMessage = useCallback((fromName, forRole) => {
    addNotification({
      type: NOTIFICATION_TYPES.NEW_MESSAGE,
      title: 'Nouveau message 💬',
      message: `${fromName} vous a envoyé un message`,
      forRole: forRole,
      actionUrl: forRole === 'host' ? '/host/messages' : '/cleaner/messages',
    })
  }, [addNotification])

  // Reset pour la démo
  const resetNotifications = useCallback(() => {
    setNotifications(initialNotifications)
  }, [])

  const value = {
    notifications,
    getNotifications,
    getUnreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    notifyMissionCreated,
    notifyMissionApplied,
    notifyMissionConfirmed,
    notifyMissionRejected,
    notifyMissionStarted,
    notifyMissionCompleted,
    notifyMissionRated,
    notifyNewMessage,
    resetNotifications,
    NOTIFICATION_TYPES,
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}

export default useNotifications
