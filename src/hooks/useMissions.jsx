import { useState, useEffect, useCallback, createContext, useContext } from 'react'

const MissionsContext = createContext(null)

// Statuts possibles d'une mission
export const MISSION_STATUS = {
  PENDING: 'pending',           // Créée par host, en attente de candidatures
  APPLIED: 'applied',           // Cleaner a postulé
  CONFIRMED: 'confirmed',       // Host a confirmé le cleaner
  IN_PROGRESS: 'in_progress',   // Cleaner a commencé
  COMPLETED: 'completed',       // Cleaner a terminé
  RATED: 'rated',               // Host a noté
  CANCELLED: 'cancelled',       // Annulée
}

// Missions initiales pour la démo
const initialMissions = [
  {
    id: 'mission-1',
    propertyId: 'prop-1',
    propertyName: 'Studio Marais',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    propertyAddress: '15 Rue des Archives, Paris 4e',
    propertySurface: 25,
    propertyType: 'Studio',
    hostId: 'host-demo',
    hostName: 'Marie Dupont',
    hostAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    cleanerId: 'cleaner-demo',
    cleanerName: 'Thomas L.',
    cleanerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: '2025-01-21',
    time: '14:00',
    duration: '2h',
    price: 55,
    status: MISSION_STATUS.CONFIRMED,
    instructions: 'Merci de bien aérer après le ménage.',
    createdAt: Date.now() - 86400000,
    appliedAt: Date.now() - 82800000,
    confirmedAt: Date.now() - 79200000,
    startedAt: null,
    completedAt: null,
    rating: null,
    review: null,
  },
  {
    id: 'mission-2',
    propertyId: 'prop-2',
    propertyName: 'Appartement Bastille',
    propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    propertyAddress: '42 Rue de la Roquette, Paris 11e',
    propertySurface: 45,
    propertyType: 'T2',
    hostId: 'host-demo',
    hostName: 'Marie Dupont',
    hostAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    cleanerId: null,
    cleanerName: null,
    cleanerAvatar: null,
    date: '2025-01-22',
    time: '10:00',
    duration: '3h',
    price: 72,
    status: MISSION_STATUS.PENDING,
    instructions: '',
    createdAt: Date.now() - 3600000,
    appliedAt: null,
    confirmedAt: null,
    startedAt: null,
    completedAt: null,
    rating: null,
    review: null,
  },
  {
    id: 'mission-3',
    propertyId: 'prop-3',
    propertyName: 'Loft Oberkampf',
    propertyImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop',
    propertyAddress: '25 Rue Oberkampf, Paris 11e',
    propertySurface: 80,
    propertyType: 'Loft',
    hostId: 'host-demo',
    hostName: 'Marie Dupont',
    hostAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    cleanerId: null,
    cleanerName: null,
    cleanerAvatar: null,
    date: '2025-01-23',
    time: '09:00',
    duration: '4h',
    price: 95,
    status: MISSION_STATUS.PENDING,
    instructions: 'Grand ménage de printemps, merci de nettoyer les vitres.',
    createdAt: Date.now() - 7200000,
    appliedAt: null,
    confirmedAt: null,
    startedAt: null,
    completedAt: null,
    rating: null,
    review: null,
  },
  {
    id: 'mission-old-1',
    propertyId: 'prop-1',
    propertyName: 'Studio Marais',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    propertyAddress: '15 Rue des Archives, Paris 4e',
    propertySurface: 25,
    propertyType: 'Studio',
    hostId: 'host-demo',
    hostName: 'Marie Dupont',
    hostAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    cleanerId: 'cleaner-demo',
    cleanerName: 'Thomas L.',
    cleanerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: '2025-01-18',
    time: '14:00',
    duration: '2h',
    price: 55,
    status: MISSION_STATUS.RATED,
    instructions: '',
    createdAt: Date.now() - 259200000,
    appliedAt: Date.now() - 255600000,
    confirmedAt: Date.now() - 252000000,
    startedAt: Date.now() - 172800000,
    completedAt: Date.now() - 165600000,
    rating: 5,
    review: 'Excellent travail, appartement impeccable ! Je recommande.',
  },
]

const STORAGE_KEY = 'cleanair_missions'

export function MissionsProvider({ children }) {
  const [missions, setMissions] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : initialMissions
    } catch {
      return initialMissions
    }
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(missions))
  }, [missions])

  // Obtenir les missions par statut pour un rôle
  const getMissionsByStatus = useCallback((status, role) => {
    return missions.filter(m => {
      if (m.status !== status) return false
      if (role === 'host') return m.hostId === 'host-demo'
      if (role === 'cleaner') {
        // Pour pending, montrer toutes les missions sans cleaner
        if (status === MISSION_STATUS.PENDING) return !m.cleanerId
        // Sinon, seulement les missions où le cleaner est assigné
        return m.cleanerId === 'cleaner-demo'
      }
      return true
    })
  }, [missions])

  // Obtenir toutes les missions disponibles pour un cleaner
  const getAvailableMissions = useCallback(() => {
    return missions.filter(m => 
      m.status === MISSION_STATUS.PENDING && !m.cleanerId
    )
  }, [missions])

  // Obtenir les candidatures d'un cleaner
  const getMyApplications = useCallback(() => {
    return missions.filter(m => 
      m.status === MISSION_STATUS.APPLIED && m.cleanerId === 'cleaner-demo'
    )
  }, [missions])

  // Obtenir les missions confirmées d'un cleaner
  const getConfirmedMissions = useCallback(() => {
    return missions.filter(m => 
      [MISSION_STATUS.CONFIRMED, MISSION_STATUS.IN_PROGRESS].includes(m.status) && 
      m.cleanerId === 'cleaner-demo'
    )
  }, [missions])

  // Obtenir les missions passées
  const getPastMissions = useCallback((role) => {
    return missions.filter(m => {
      if (![MISSION_STATUS.COMPLETED, MISSION_STATUS.RATED].includes(m.status)) return false
      if (role === 'host') return m.hostId === 'host-demo'
      if (role === 'cleaner') return m.cleanerId === 'cleaner-demo'
      return true
    })
  }, [missions])

  // Obtenir une mission par ID
  const getMissionById = useCallback((id) => {
    return missions.find(m => m.id === id)
  }, [missions])

  // HOST: Créer une nouvelle mission
  const createMission = useCallback((missionData) => {
    const newMission = {
      id: `mission-${Date.now()}`,
      ...missionData,
      hostId: 'host-demo',
      hostName: 'Marie Dupont',
      hostAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      cleanerId: null,
      cleanerName: null,
      cleanerAvatar: null,
      status: MISSION_STATUS.PENDING,
      createdAt: Date.now(),
      appliedAt: null,
      confirmedAt: null,
      startedAt: null,
      completedAt: null,
      rating: null,
      review: null,
    }
    setMissions(prev => [newMission, ...prev])
    return newMission
  }, [])

  // CLEANER: Postuler à une mission
  const applyToMission = useCallback((missionId) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return {
          ...m,
          status: MISSION_STATUS.APPLIED,
          cleanerId: 'cleaner-demo',
          cleanerName: 'Thomas L.',
          cleanerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          appliedAt: Date.now(),
        }
      }
      return m
    }))
  }, [])

  // CLEANER: Annuler sa candidature
  const cancelApplication = useCallback((missionId) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return {
          ...m,
          status: MISSION_STATUS.PENDING,
          cleanerId: null,
          cleanerName: null,
          cleanerAvatar: null,
          appliedAt: null,
        }
      }
      return m
    }))
  }, [])

  // HOST: Confirmer un cleaner
  const confirmMission = useCallback((missionId) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return {
          ...m,
          status: MISSION_STATUS.CONFIRMED,
          confirmedAt: Date.now(),
        }
      }
      return m
    }))
  }, [])

  // HOST: Refuser un cleaner (remet en pending)
  const rejectCleaner = useCallback((missionId) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return {
          ...m,
          status: MISSION_STATUS.PENDING,
          cleanerId: null,
          cleanerName: null,
          cleanerAvatar: null,
          appliedAt: null,
        }
      }
      return m
    }))
  }, [])

  // CLEANER: Démarrer une mission
  const startMission = useCallback((missionId) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return {
          ...m,
          status: MISSION_STATUS.IN_PROGRESS,
          startedAt: Date.now(),
        }
      }
      return m
    }))
  }, [])

  // CLEANER: Terminer une mission
  const completeMission = useCallback((missionId) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return {
          ...m,
          status: MISSION_STATUS.COMPLETED,
          completedAt: Date.now(),
        }
      }
      return m
    }))
  }, [])

  // HOST: Noter une mission
  const rateMission = useCallback((missionId, rating, review) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return {
          ...m,
          status: MISSION_STATUS.RATED,
          rating,
          review,
        }
      }
      return m
    }))
  }, [])

  // Annuler une mission
  const cancelMission = useCallback((missionId) => {
    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return {
          ...m,
          status: MISSION_STATUS.CANCELLED,
        }
      }
      return m
    }))
  }, [])

  // Reset pour la démo
  const resetMissions = useCallback(() => {
    setMissions(initialMissions)
  }, [])

  // Stats pour dashboard
  const getStats = useCallback((role) => {
    if (role === 'host') {
      const myMissions = missions.filter(m => m.hostId === 'host-demo')
      return {
        pending: myMissions.filter(m => m.status === MISSION_STATUS.PENDING).length,
        applied: myMissions.filter(m => m.status === MISSION_STATUS.APPLIED).length,
        confirmed: myMissions.filter(m => m.status === MISSION_STATUS.CONFIRMED).length,
        inProgress: myMissions.filter(m => m.status === MISSION_STATUS.IN_PROGRESS).length,
        completed: myMissions.filter(m => [MISSION_STATUS.COMPLETED, MISSION_STATUS.RATED].includes(m.status)).length,
        toRate: myMissions.filter(m => m.status === MISSION_STATUS.COMPLETED).length,
      }
    } else {
      return {
        available: missions.filter(m => m.status === MISSION_STATUS.PENDING && !m.cleanerId).length,
        applied: missions.filter(m => m.status === MISSION_STATUS.APPLIED && m.cleanerId === 'cleaner-demo').length,
        confirmed: missions.filter(m => m.status === MISSION_STATUS.CONFIRMED && m.cleanerId === 'cleaner-demo').length,
        inProgress: missions.filter(m => m.status === MISSION_STATUS.IN_PROGRESS && m.cleanerId === 'cleaner-demo').length,
        completed: missions.filter(m => [MISSION_STATUS.COMPLETED, MISSION_STATUS.RATED].includes(m.status) && m.cleanerId === 'cleaner-demo').length,
      }
    }
  }, [missions])

  const value = {
    missions,
    getMissionsByStatus,
    getAvailableMissions,
    getMyApplications,
    getConfirmedMissions,
    getPastMissions,
    getMissionById,
    createMission,
    applyToMission,
    cancelApplication,
    confirmMission,
    rejectCleaner,
    startMission,
    completeMission,
    rateMission,
    cancelMission,
    resetMissions,
    getStats,
    MISSION_STATUS,
  }

  return (
    <MissionsContext.Provider value={value}>
      {children}
    </MissionsContext.Provider>
  )
}

export function useMissions() {
  const context = useContext(MissionsContext)
  if (!context) {
    throw new Error('useMissions must be used within a MissionsProvider')
  }
  return context
}

export default useMissions
