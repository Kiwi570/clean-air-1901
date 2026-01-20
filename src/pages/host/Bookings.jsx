import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, Clock, MapPin, Euro, Plus, Star, MessageCircle,
  CheckCircle, XCircle, Play, AlertCircle, ChevronRight
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CreateMissionModal } from '@/components/ui/CreateMissionModal'
import { RateMissionModal } from '@/components/ui/RateMissionModal'
import { useMissions, MISSION_STATUS } from '@/hooks/useMissions'
import { useNotifications } from '@/hooks/useNotifications'
import { useToast } from '@/hooks/useToast'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

function Bookings() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [missionToRate, setMissionToRate] = useState(null)
  const [activeTab, setActiveTab] = useState('all')

  const { 
    missions, 
    confirmMission, 
    rejectCleaner,
    getStats 
  } = useMissions()
  const { notifyMissionConfirmed, notifyMissionRejected } = useNotifications()
  const { success: showSuccess, error: showError } = useToast()

  // Filtrer les missions de l'hôte
  const hostMissions = missions.filter(m => m.hostId === 'host-demo')
  const stats = getStats('host')

  // Grouper par statut
  const pending = hostMissions.filter(m => m.status === MISSION_STATUS.PENDING)
  const applied = hostMissions.filter(m => m.status === MISSION_STATUS.APPLIED)
  const confirmed = hostMissions.filter(m => m.status === MISSION_STATUS.CONFIRMED)
  const inProgress = hostMissions.filter(m => m.status === MISSION_STATUS.IN_PROGRESS)
  const completed = hostMissions.filter(m => m.status === MISSION_STATUS.COMPLETED)
  const rated = hostMissions.filter(m => m.status === MISSION_STATUS.RATED)

  const tabs = [
    { id: 'all', label: 'Toutes', count: hostMissions.length },
    { id: 'pending', label: 'En attente', count: pending.length },
    { id: 'applied', label: 'Candidatures', count: applied.length, highlight: applied.length > 0 },
    { id: 'confirmed', label: 'Confirmées', count: confirmed.length },
    { id: 'progress', label: 'En cours', count: inProgress.length },
    { id: 'done', label: 'Terminées', count: completed.length + rated.length },
  ]

  const getFilteredMissions = () => {
    switch (activeTab) {
      case 'pending': return pending
      case 'applied': return applied
      case 'confirmed': return confirmed
      case 'progress': return inProgress
      case 'done': return [...completed, ...rated]
      default: return hostMissions
    }
  }

  const handleConfirm = (mission) => {
    confirmMission(mission.id)
    notifyMissionConfirmed(mission)
    showSuccess(`${mission.cleanerName} a été confirmé pour ${mission.propertyName} ! ✅`)
  }

  const handleReject = (mission) => {
    rejectCleaner(mission.id)
    notifyMissionRejected(mission)
    showError(`Candidature de ${mission.cleanerName} refusée`)
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return "Aujourd'hui"
    if (date.toDateString() === tomorrow.toDateString()) return 'Demain'
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case MISSION_STATUS.PENDING:
        return <Badge variant="default" size="sm">En attente</Badge>
      case MISSION_STATUS.APPLIED:
        return <Badge variant="warning" size="sm">Candidature</Badge>
      case MISSION_STATUS.CONFIRMED:
        return <Badge variant="primary" size="sm">Confirmé</Badge>
      case MISSION_STATUS.IN_PROGRESS:
        return <Badge variant="info" size="sm">En cours</Badge>
      case MISSION_STATUS.COMPLETED:
        return <Badge variant="success" size="sm">À noter</Badge>
      case MISSION_STATUS.RATED:
        return <Badge variant="success" size="sm">Terminé</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 font-display">
            Réservations
          </h1>
          <p className="text-surface-500 mt-1">
            Gérez vos demandes de ménage
          </p>
        </div>

        <Button variant="accent" icon={Plus} onClick={() => setShowCreateModal(true)}>
          Nouveau ménage
        </Button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-surface-900">{stats.pending}</p>
          <p className="text-sm text-surface-500">En attente</p>
        </Card>
        <Card className={cn("p-4 text-center", stats.applied > 0 && "ring-2 ring-amber-400 bg-amber-50")}>
          <p className="text-3xl font-bold text-amber-600">{stats.applied}</p>
          <p className="text-sm text-surface-500">Candidatures</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-accent-600">{stats.confirmed + stats.inProgress}</p>
          <p className="text-sm text-surface-500">À venir</p>
        </Card>
        <Card className={cn("p-4 text-center", stats.toRate > 0 && "ring-2 ring-green-400 bg-green-50")}>
          <p className="text-3xl font-bold text-green-600">{stats.toRate}</p>
          <p className="text-sm text-surface-500">À noter</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all',
              activeTab === tab.id
                ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/25'
                : tab.highlight
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            )}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={cn(
                'px-1.5 py-0.5 rounded-full text-xs font-bold',
                activeTab === tab.id
                  ? 'bg-white/20'
                  : tab.highlight
                    ? 'bg-amber-200'
                    : 'bg-surface-200'
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Missions List */}
      {getFilteredMissions().length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-surface-400" />
          </div>
          <h3 className="font-semibold text-surface-900 mb-2">Aucune réservation</h3>
          <p className="text-surface-500 mb-4">
            {activeTab === 'all' 
              ? "Créez votre première demande de ménage pour commencer."
              : "Aucune réservation dans cette catégorie."}
          </p>
          {activeTab === 'all' && (
            <Button variant="accent" icon={Plus} onClick={() => setShowCreateModal(true)}>
              Planifier un ménage
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {getFilteredMissions().map((mission) => (
            <Card key={mission.id} className="p-0 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-48 h-40 md:h-auto">
                  <img
                    src={mission.propertyImage}
                    alt={mission.propertyName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg text-surface-900">
                          {mission.propertyName}
                        </h3>
                        {getStatusBadge(mission.status)}
                      </div>
                      <p className="text-surface-500 text-sm flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {mission.propertyAddress}
                      </p>
                    </div>
                    <span className="text-xl font-bold text-accent-600">
                      {formatCurrency(mission.price)}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-4 text-sm text-surface-600 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-surface-400" />
                      {formatDate(mission.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-surface-400" />
                      {mission.time} • {mission.duration}
                    </span>
                  </div>

                  {/* Cleaner Info (if assigned) */}
                  {mission.cleanerId && (
                    <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl mb-4">
                      <img
                        src={mission.cleanerAvatar}
                        alt={mission.cleanerName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-surface-900">{mission.cleanerName}</p>
                        <p className="text-sm text-surface-500 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          4.9 • 47 missions
                        </p>
                      </div>
                      <Link to="/host/messages">
                        <Button variant="secondary" size="sm" icon={MessageCircle}>
                          Message
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Actions based on status */}
                  <div className="flex items-center gap-3">
                    {mission.status === MISSION_STATUS.APPLIED && (
                      <>
                        <Button 
                          variant="accent" 
                          size="sm" 
                          icon={CheckCircle}
                          onClick={() => handleConfirm(mission)}
                        >
                          Confirmer
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          icon={XCircle}
                          onClick={() => handleReject(mission)}
                        >
                          Refuser
                        </Button>
                      </>
                    )}

                    {mission.status === MISSION_STATUS.COMPLETED && (
                      <Button 
                        variant="accent" 
                        size="sm" 
                        icon={Star}
                        onClick={() => setMissionToRate(mission)}
                      >
                        Noter le ménage
                      </Button>
                    )}

                    {mission.status === MISSION_STATUS.RATED && (
                      <div className="flex items-center gap-2 text-sm text-surface-500">
                        <div className="flex items-center gap-0.5">
                          {[...Array(mission.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <span>• {mission.review?.slice(0, 50)}...</span>
                      </div>
                    )}

                    {mission.status === MISSION_STATUS.PENDING && (
                      <p className="text-sm text-surface-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        En attente de candidatures...
                      </p>
                    )}

                    {mission.status === MISSION_STATUS.CONFIRMED && (
                      <p className="text-sm text-accent-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Mission confirmée, en attente du jour J
                      </p>
                    )}

                    {mission.status === MISSION_STATUS.IN_PROGRESS && (
                      <p className="text-sm text-blue-600 font-medium flex items-center gap-1 animate-pulse">
                        <Play className="w-4 h-4" />
                        Ménage en cours...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Mission Modal */}
      <CreateMissionModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />

      {/* Rate Mission Modal */}
      <RateMissionModal
        isOpen={!!missionToRate}
        onClose={() => setMissionToRate(null)}
        mission={missionToRate}
      />
    </div>
  )
}

export default Bookings
