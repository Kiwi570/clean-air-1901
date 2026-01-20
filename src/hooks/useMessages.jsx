import { useState, useEffect, useCallback, createContext, useContext } from 'react'

const MessagesContext = createContext(null)

// Messages mock initiaux pour la démo
const initialMessages = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    from: 'host',
    fromName: 'Marie Dupont',
    fromAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    fromProperty: 'Studio Marais',
    to: 'cleaner',
    toName: 'Thomas L.',
    toAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'Bonjour Thomas ! Merci pour le ménage d\'hier, l\'appartement était impeccable ! 🌟',
    timestamp: Date.now() - 7200000,
    readByHost: true,
    readByCleaner: true,
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    from: 'cleaner',
    fromName: 'Thomas L.',
    fromAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    to: 'host',
    toName: 'Marie Dupont',
    toAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    toProperty: 'Studio Marais',
    text: 'Avec plaisir Marie ! C\'était un appartement très agréable à nettoyer. N\'hésitez pas si vous avez besoin de quelque chose !',
    timestamp: Date.now() - 6000000,
    readByHost: true,
    readByCleaner: true,
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    from: 'host',
    fromName: 'Marie Dupont',
    fromAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    fromProperty: 'Studio Marais',
    to: 'cleaner',
    toName: 'Thomas L.',
    toAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'Parfait ! J\'ai une nouvelle réservation pour vendredi, ça vous irait ? 😊',
    timestamp: Date.now() - 180000,
    readByHost: true,
    readByCleaner: false, // Non lu par cleaner !
  },
  {
    id: 'msg-4',
    conversationId: 'conv-2',
    from: 'host',
    fromName: 'Pierre Martin',
    fromAvatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    fromProperty: 'Appartement Bastille',
    to: 'cleaner',
    toName: 'Thomas L.',
    toAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'Bonjour, êtes-vous disponible demain matin pour un ménage ?',
    timestamp: Date.now() - 3600000,
    readByHost: true,
    readByCleaner: false, // Non lu par cleaner !
  },
]

// Conversations mock
const initialConversations = [
  {
    id: 'conv-1',
    hostId: 'host-1',
    hostName: 'Marie Dupont',
    hostAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    cleanerId: 'cleaner-1',
    cleanerName: 'Thomas L.',
    cleanerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    propertyName: 'Studio Marais',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=100&fit=crop',
  },
  {
    id: 'conv-2',
    hostId: 'host-2',
    hostName: 'Pierre Martin',
    hostAvatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    cleanerId: 'cleaner-1',
    cleanerName: 'Thomas L.',
    cleanerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    propertyName: 'Appartement Bastille',
    propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&h=100&fit=crop',
  },
]

const STORAGE_KEY = 'cleanair_messages'
const CONVERSATIONS_KEY = 'cleanair_conversations'

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : initialMessages
    } catch {
      return initialMessages
    }
  })

  const [conversations, setConversations] = useState(() => {
    try {
      const stored = localStorage.getItem(CONVERSATIONS_KEY)
      return stored ? JSON.parse(stored) : initialConversations
    } catch {
      return initialConversations
    }
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations))
  }, [conversations])

  // Compter les messages non lus pour un rôle
  const getUnreadCount = useCallback((role) => {
    return messages.filter(msg => {
      if (role === 'host') {
        return msg.to === 'host' && !msg.readByHost
      } else {
        return msg.to === 'cleaner' && !msg.readByCleaner
      }
    }).length
  }, [messages])

  // Obtenir les messages d'une conversation
  const getConversationMessages = useCallback((conversationId) => {
    return messages
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => a.timestamp - b.timestamp)
  }, [messages])

  // Obtenir la dernière message d'une conversation
  const getLastMessage = useCallback((conversationId) => {
    const convMessages = messages.filter(msg => msg.conversationId === conversationId)
    return convMessages.sort((a, b) => b.timestamp - a.timestamp)[0]
  }, [messages])

  // Obtenir les conversations avec le dernier message et status
  const getConversationsWithPreview = useCallback((role) => {
    return conversations.map(conv => {
      const lastMessage = getLastMessage(conv.id)
      const unreadCount = messages.filter(msg => {
        if (role === 'host') {
          return msg.conversationId === conv.id && msg.to === 'host' && !msg.readByHost
        } else {
          return msg.conversationId === conv.id && msg.to === 'cleaner' && !msg.readByCleaner
        }
      }).length

      return {
        ...conv,
        lastMessage,
        unreadCount,
      }
    }).sort((a, b) => {
      const timeA = a.lastMessage?.timestamp || 0
      const timeB = b.lastMessage?.timestamp || 0
      return timeB - timeA
    })
  }, [conversations, messages, getLastMessage])

  // Envoyer un message
  const sendMessage = useCallback((conversationId, text, fromRole) => {
    const conversation = conversations.find(c => c.id === conversationId)
    if (!conversation) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      from: fromRole,
      fromName: fromRole === 'host' ? conversation.hostName : conversation.cleanerName,
      fromAvatar: fromRole === 'host' ? conversation.hostAvatar : conversation.cleanerAvatar,
      fromProperty: fromRole === 'host' ? conversation.propertyName : undefined,
      to: fromRole === 'host' ? 'cleaner' : 'host',
      toName: fromRole === 'host' ? conversation.cleanerName : conversation.hostName,
      toAvatar: fromRole === 'host' ? conversation.cleanerAvatar : conversation.hostAvatar,
      toProperty: fromRole === 'cleaner' ? conversation.propertyName : undefined,
      text,
      timestamp: Date.now(),
      readByHost: fromRole === 'host',
      readByCleaner: fromRole === 'cleaner',
    }

    setMessages(prev => [...prev, newMessage])
    return newMessage
  }, [conversations])

  // Marquer les messages d'une conversation comme lus
  const markConversationAsRead = useCallback((conversationId, role) => {
    setMessages(prev => prev.map(msg => {
      if (msg.conversationId === conversationId) {
        if (role === 'host' && msg.to === 'host') {
          return { ...msg, readByHost: true }
        } else if (role === 'cleaner' && msg.to === 'cleaner') {
          return { ...msg, readByCleaner: true }
        }
      }
      return msg
    }))
  }, [])

  // Marquer tous les messages comme lus pour un rôle
  const markAllAsRead = useCallback((role) => {
    setMessages(prev => prev.map(msg => {
      if (role === 'host' && msg.to === 'host') {
        return { ...msg, readByHost: true }
      } else if (role === 'cleaner' && msg.to === 'cleaner') {
        return { ...msg, readByCleaner: true }
      }
      return msg
    }))
  }, [])

  // Reset pour la démo
  const resetMessages = useCallback(() => {
    setMessages(initialMessages)
    setConversations(initialConversations)
  }, [])

  const value = {
    messages,
    conversations,
    getUnreadCount,
    getConversationMessages,
    getLastMessage,
    getConversationsWithPreview,
    sendMessage,
    markConversationAsRead,
    markAllAsRead,
    resetMessages,
  }

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  const context = useContext(MessagesContext)
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider')
  }
  return context
}

// Hook simple pour obtenir le count non lu (pour les badges)
export function useUnreadCount(role) {
  const { getUnreadCount } = useMessages()
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(getUnreadCount(role))
  }, [getUnreadCount, role])

  return count
}

export default useMessages
