import { Link } from 'react-router-dom'
import { MapPin, Calendar, Clock, Euro, ArrowRight, ChevronRight, Star, MessageCircle, Sparkles, Play, CheckCircle, Hand } from 'lucide-react'
import { Card, StatCard } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { CountUp } from '@/components/ui/CountUp'
import { useAuth } from '@/hooks/useAuth'
import { useMissions, MISSION_STATUS } from '@/hooks/useMissions'
import { useNotifications } from '@/hooks/useNotifications'
import { useToast } from '@/hooks/useToast'
import { useConfetti } from '@/hooks/useConfetti'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

function CleanerDashboard() {
  const { user } = useAuth()
  const { 
    getAvailableMissions, 
    getConfirmedMissions, 
    getMyApplications,
    getStats,
    applyToMission,
    startMission,
    completeMission
  } = useMissions()
  const { notifyMissionApplied, notifyMissionStarted, notifyMissionCompleted } = useNotifications()
  const { success: showSuccess } = useToast()
  const { trigger: triggerConfetti } = useConfetti()

  const available = getAvailableMissions()
  const confirmed = getConfirmedMissions()
  const applications = getMyApplications()
  const stats = getStats('cleaner')

  // Prochaine mission (confirmée ou en cours)
  const nextMission = confirmed[0]

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (date.toDateString() === today.toDateString()) return "Aujourd'hui"
    if (date.toDateString() === tomorrow.toDateString()) return 'Demain'
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const handleApply = (mission) => {
    applyToMission(mission.id)
    notifyMissionApplied(mission)
    showSuccess(`Candidature envoyée pour ${mission.propertyName} ! 🎉`)
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
    showSuccess(`Ménage terminé ! ${mission.hostName} va être notifié 💰`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Alert: Available Missions */}
      {available.length > 0 && (
        <div className="p-4 bg-brand-50 border border-brand-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center animate-pulse">
              <Sparkles className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="font-semibold text-brand-900">
                {available.length} nouvelle{available.length > 1 ? 's' : ''} mission{available.length > 1 ? 's' : ''} disponible{available.length > 1 ? 's' : ''} !
              </p>
              <p className="text-sm text-brand-700">
                Postulez maintenant pour décrocher la mission
              </p>
            </div>
          </div>
          <Link to="/cleaner/missions">
            <Button size="sm">
              Voir les missions
            </Button>
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={cn("p-4 cursor-pointer hover:shadow-md transition-shadow", stats.available > 0 && "ring-2 ring-brand-400")}>
          <Link to="/cleaner/missions" className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stats.available > 0 ? "bg-brand-100" : "bg-surface-100")}>
              <Sparkles className={cn("w-5 h-5", stats.available > 0 ? "text-brand-600" : "text-surface-500")} />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.available}</p>
              <p className="text-sm text-surface-500">Disponibles</p>
            </div>
          </Link>
        </Card>
        <StatCard
          icon={Hand}
          label="Candidatures"
          value={stats.applied}
        />
        <StatCard
          icon={CheckCircle}
          label="Confirmées"
          value={stats.confirmed + stats.inProgress}
        />
        <StatCard
          icon={Euro}
          label="Ce mois"
          value="1250€"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Next Mission */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-900">Prochaine mission</h2>
            {nextMission && (
              <Badge variant={nextMission.status === MISSION_STATUS.IN_PROGRESS ? 'info' : 'success'}>
                {nextMission.status === MISSION_STATUS.IN_PROGRESS ? 'En cours' : 'Confirmée'}
              </Badge>
            )}
          </div>

          {nextMission ? (
            <div className="bg-gradient-to-br from-brand-50 to-accent-50 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-surface-900 mb-1">
                    {nextMission.propertyName}
                  </h3>
                  <p className="text-surface-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {nextMission.propertyAddress}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand-600">
                    {formatCurrency(nextMission.price)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2 text-surface-700">
                  <Calendar className="w-4 h-4 text-surface-500" />
                  <span>{formatDate(nextMission.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-surface-700">
                  <Clock className="w-4 h-4 text-surface-500" />
                  <span>{nextMission.time} • {nextMission.duration}</span>
                </div>
              </div>

              {/* Host Info */}
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl mb-4">
                <img
                  src={nextMission.hostAvatar}
                  alt={nextMission.hostName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-surface-900">{nextMission.hostName}</p>
                  <p className="text-xs text-surface-500">Hôte</p>
                </div>
                <Link to="/cleaner/messages">
                  <Button variant="secondary" size="sm" icon={MessageCircle}>
                    Message
                  </Button>
                </Link>
              </div>

              <div className="flex gap-3">
                {nextMission.status === MISSION_STATUS.CONFIRMED && (
                  <Button fullWidth icon={Play} onClick={() => handleStart(nextMission)}>
                    Démarrer le ménage
                  </Button>
                )}
                {nextMission.status === MISSION_STATUS.IN_PROGRESS && (
                  <Button fullWidth variant="accent" icon={CheckCircle} onClick={() => handleComplete(nextMission)}>
                    Terminer le ménage
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-surface-400" />
              </div>
              <p className="text-surface-500 mb-4">Aucune mission confirmée</p>
              <Link to="/cleaner/missions">
                <Button icon={Sparkles}>
                  Voir les missions disponibles
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Quick Stats */}
        <Card>
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Ce mois</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl group hover:bg-brand-50 transition-colors">
              <div>
                <p className="text-sm text-surface-500">Missions terminées</p>
                <p className="text-2xl font-bold text-surface-900">
                  <CountUp end={stats.completed} duration={1500} />
                </p>
              </div>
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-brand-600" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl group hover:bg-green-50 transition-colors">
              <div>
                <p className="text-sm text-surface-500">Revenus totaux</p>
                <p className="text-2xl font-bold text-surface-900">
                  <CountUp end={1250} duration={1800} prefix="" suffix=" €" />
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Euro className="w-6 h-6 text-green-600" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl group hover:bg-amber-50 transition-colors">
              <div>
                <p className="text-sm text-surface-500">Note moyenne</p>
                <p className="text-2xl font-bold text-surface-900 flex items-center gap-1">
                  <CountUp end={4.9} duration={1500} decimals={1} />
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Available Missions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900">
            Missions disponibles
            {available.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-brand-100 text-brand-700 text-sm font-bold rounded-full">
                {available.length}
              </span>
            )}
          </h2>
          <Link to="/cleaner/missions">
            <Button variant="ghost" size="sm" icon={ChevronRight} iconPosition="right">
              Voir tout
            </Button>
          </Link>
        </div>

        {available.length === 0 ? (
          <div className="text-center py-8 text-surface-500">
            <p>Aucune mission disponible pour le moment</p>
            <p className="text-sm mt-1">Revenez bientôt !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {available.slice(0, 3).map((mission) => (
              <div
                key={mission.id}
                className="flex items-center justify-between p-4 bg-surface-50 hover:bg-surface-100 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={mission.propertyImage} 
                    alt={mission.propertyName}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-surface-900 group-hover:text-brand-600 transition-colors">
                      {mission.propertyName}
                    </h3>
                    <p className="text-sm text-surface-500">
                      {formatDate(mission.date)} • {mission.time} • {mission.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-brand-600">{formatCurrency(mission.price)}</p>
                    <p className="text-xs text-surface-500">{mission.propertyType} • {mission.propertySurface}m²</p>
                  </div>
                  <Button size="sm" icon={Hand} onClick={() => handleApply(mission)}>
                    Postuler
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default CleanerDashboard
