import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, Calendar, Clock, Euro, Star, MessageCircle,
  CheckCircle, XCircle, Play, Square, Sparkles, Hand, Search
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useMissions, MISSION_STATUS } from '@/hooks/useMissions'
import { useNotifications } from '@/hooks/useNotifications'
import { useToast } from '@/hooks/useToast'
import { useConfetti } from '@/hooks/useConfetti'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

function Missions() {
  const [activeTab, setActiveTab] = useState('available')
  const [searchQuery, setSearchQuery] = useState('')

  const { 
    getAvailableMissions,
    getMyApplications,
    getConfirmedMissions,
    getPastMissions,
    applyToMission,
    cancelApplication,
    startMission,
    completeMission,
    getStats
  } = useMissions()
  
  const { 
    notifyMissionApplied, 
    notifyMissionStarted, 
    notifyMissionCompleted 
  } = useNotifications()
  
  const { success: showSuccess, error: showError } = useToast()
  const { trigger: triggerConfetti } = useConfetti()

  const available = getAvailableMissions()
  const applications = getMyApplications()
  const confirmed = getConfirmedMissions()
  const past = getPastMissions('cleaner')
  const stats = getStats('cleaner')

  const tabs = [
    { id: 'available', label: 'Disponibles', count: available.length, icon: Sparkles },
    { id: 'applications', label: 'Candidatures', count: applications.length, icon: Hand },
    { id: 'confirmed', label: 'Confirmées', count: confirmed.length, icon: CheckCircle },
    { id: 'past', label: 'Passées', count: past.length, icon: Star },
  ]

  const getFilteredMissions = () => {
    let missions = []
    switch (activeTab) {
      case 'available': missions = available; break
      case 'applications': missions = applications; break
      case 'confirmed': missions = confirmed; break
      case 'past': missions = past; break
      default: missions = available
    }

    if (searchQuery) {
      missions = missions.filter(m => 
        m.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return missions
  }

  const handleApply = (mission) => {
    applyToMission(mission.id)
    notifyMissionApplied(mission)
    showSuccess(`Candidature envoyée pour ${mission.propertyName} ! 🎉`)
  }

  const handleCancelApplication = (mission) => {
    cancelApplication(mission.id)
    showError('Candidature annulée')
  }

  const handleStart = (mission) => {
    startMission(mission.id)
    notifyMissionStarted(mission)
    showSuccess(`C'est parti ! Bon ménage chez ${mission.propertyName} 🧹`)
  }

  const handleComplete = (mission) => {
    completeMission(mission.id)
    notifyMissionCompleted(mission)
    triggerConfetti()
    showSuccess(`Ménage terminé ! ${mission.hostName} va être notifié pour vous payer 💰`)
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 font-display">
            Missions
          </h1>
          <p className="text-surface-500 mt-1">
            Trouvez et gérez vos missions de ménage
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border-2 border-surface-200 rounded-xl text-surface-900 placeholder-surface-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={cn("p-4 text-center cursor-pointer transition-all", activeTab === 'available' && "ring-2 ring-brand-400")} onClick={() => setActiveTab('available')}>
          <p className="text-3xl font-bold text-brand-600">{stats.available}</p>
          <p className="text-sm text-surface-500">Disponibles</p>
        </Card>
        <Card className={cn("p-4 text-center cursor-pointer transition-all", activeTab === 'applications' && "ring-2 ring-amber-400")} onClick={() => setActiveTab('applications')}>
          <p className="text-3xl font-bold text-amber-600">{stats.applied}</p>
          <p className="text-sm text-surface-500">En attente</p>
        </Card>
        <Card className={cn("p-4 text-center cursor-pointer transition-all", activeTab === 'confirmed' && "ring-2 ring-green-400")} onClick={() => setActiveTab('confirmed')}>
          <p className="text-3xl font-bold text-green-600">{stats.confirmed + stats.inProgress}</p>
          <p className="text-sm text-surface-500">À faire</p>
        </Card>
        <Card className="p-4 text-center cursor-pointer" onClick={() => setActiveTab('past')}>
          <p className="text-3xl font-bold text-surface-600">{stats.completed}</p>
          <p className="text-sm text-surface-500">Terminées</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className={cn(
                  'px-1.5 py-0.5 rounded-full text-xs font-bold',
                  activeTab === tab.id ? 'bg-white/20' : 'bg-surface-200'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Missions List */}
      {getFilteredMissions().length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === 'available' ? (
              <Sparkles className="w-8 h-8 text-surface-400" />
            ) : (
              <Calendar className="w-8 h-8 text-surface-400" />
            )}
          </div>
          <h3 className="font-semibold text-surface-900 mb-2">
            {activeTab === 'available' && "Aucune mission disponible"}
            {activeTab === 'applications' && "Aucune candidature en cours"}
            {activeTab === 'confirmed' && "Aucune mission confirmée"}
            {activeTab === 'past' && "Aucune mission passée"}
          </h3>
          <p className="text-surface-500">
            {activeTab === 'available' 
              ? "Les nouvelles missions apparaîtront ici. Revenez bientôt !"
              : "Les missions apparaîtront ici au fur et à mesure."}
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {getFilteredMissions().map((mission) => (
            <Card key={mission.id} className="p-0 overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative">
                {/* Image */}
                <div className="h-40 overflow-hidden">
                  <img
                    src={mission.propertyImage}
                    alt={mission.propertyName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Price Badge */}
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg">
                  <span className="text-lg font-bold text-brand-600">{formatCurrency(mission.price)}</span>
                </div>

                {/* Status Badge */}
                {mission.status === MISSION_STATUS.IN_PROGRESS && (
                  <div className="absolute top-3 left-3 px-3 py-1.5 bg-blue-500 text-white rounded-xl shadow-lg animate-pulse flex items-center gap-1.5">
                    <Play className="w-4 h-4" />
                    <span className="font-medium text-sm">En cours</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg text-surface-900 group-hover:text-brand-600 transition-colors">
                    {mission.propertyName}
                  </h3>
                  <p className="text-surface-500 text-sm flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {mission.propertyAddress}
                  </p>
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 text-sm text-surface-600 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-surface-400" />
                    {formatDate(mission.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-surface-400" />
                    {mission.time}
                  </span>
                  <span className="text-surface-400">•</span>
                  <span>{mission.duration}</span>
                </div>

                {/* Property Info */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="default" size="sm">{mission.propertyType}</Badge>
                  <Badge variant="default" size="sm">{mission.propertySurface}m²</Badge>
                </div>

                {/* Host Info (for confirmed/past) */}
                {(activeTab === 'confirmed' || activeTab === 'past' || activeTab === 'applications') && mission.hostName && (
                  <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl mb-4">
                    <img
                      src={mission.hostAvatar}
                      alt={mission.hostName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-surface-900">{mission.hostName}</p>
                      <p className="text-xs text-surface-500">Hôte</p>
                    </div>
                    {activeTab !== 'applications' && (
                      <Link to="/cleaner/messages">
                        <Button variant="secondary" size="sm" icon={MessageCircle}>
                          Message
                        </Button>
                      </Link>
                    )}
                  </div>
                )}

                {/* Rating (for past missions) */}
                {mission.status === MISSION_STATUS.RATED && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl mb-4">
                    <div className="flex items-center gap-0.5">
                      {[...Array(mission.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-sm text-amber-700 font-medium">{mission.rating}/5</span>
                    {mission.review && (
                      <span className="text-sm text-surface-500 truncate ml-2">
                        "{mission.review.slice(0, 30)}..."
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {/* Available - Can Apply */}
                  {activeTab === 'available' && (
                    <Button 
                      fullWidth
                      icon={Hand}
                      onClick={() => handleApply(mission)}
                    >
                      Postuler
                    </Button>
                  )}

                  {/* Applications - Can Cancel */}
                  {activeTab === 'applications' && (
                    <>
                      <div className="flex-1 text-sm text-amber-600 font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        En attente de confirmation...
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleCancelApplication(mission)}
                      >
                        Annuler
                      </Button>
                    </>
                  )}

                  {/* Confirmed - Can Start */}
                  {mission.status === MISSION_STATUS.CONFIRMED && (
                    <Button 
                      fullWidth
                      icon={Play}
                      onClick={() => handleStart(mission)}
                    >
                      Démarrer le ménage
                    </Button>
                  )}

                  {/* In Progress - Can Complete */}
                  {mission.status === MISSION_STATUS.IN_PROGRESS && (
                    <Button 
                      fullWidth
                      variant="accent"
                      icon={CheckCircle}
                      onClick={() => handleComplete(mission)}
                    >
                      Terminer le ménage
                    </Button>
                  )}

                  {/* Completed - Waiting for rating */}
                  {mission.status === MISSION_STATUS.COMPLETED && (
                    <div className="flex-1 text-sm text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      En attente du paiement et de l'avis...
                    </div>
                  )}

                  {/* Rated - Show earnings */}
                  {mission.status === MISSION_STATUS.RATED && (
                    <div className="flex-1 text-sm text-green-600 font-medium flex items-center gap-1">
                      <Euro className="w-4 h-4" />
                      +{formatCurrency(mission.price)} reçus !
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Missions
