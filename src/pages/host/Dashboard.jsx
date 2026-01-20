import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, Calendar, Euro, Star, Plus, ChevronRight, MapPin, Clock, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, StatCard } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { CountUp } from '@/components/ui/CountUp'
import { CreateMissionModal } from '@/components/ui/CreateMissionModal'
import { RateMissionModal } from '@/components/ui/RateMissionModal'
import { useAuth } from '@/hooks/useAuth'
import { useMissions, MISSION_STATUS } from '@/hooks/useMissions'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

function HostDashboard() {
  const { user } = useAuth()
  const { missions, getStats, confirmMission } = useMissions()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [missionToRate, setMissionToRate] = useState(null)

  const stats = getStats('host')
  
  // Missions de l'hôte
  const hostMissions = missions.filter(m => m.hostId === 'host-demo')
  const nextMission = hostMissions.find(m => 
    [MISSION_STATUS.CONFIRMED, MISSION_STATUS.IN_PROGRESS].includes(m.status)
  )
  const pendingApplications = hostMissions.filter(m => m.status === MISSION_STATUS.APPLIED)
  const toRate = hostMissions.filter(m => m.status === MISSION_STATUS.COMPLETED)

  const properties = [
    {
      id: '1',
      name: 'Studio Marais',
      address: 'Paris 4e',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      type: 'Studio',
      surface: 25,
    },
    {
      id: '2',
      name: 'Appartement Bastille',
      address: 'Paris 11e',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      type: 'T2',
      surface: 45,
    },
    {
      id: '3',
      name: 'Loft Oberkampf',
      address: 'Paris 11e',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop',
      type: 'Loft',
      surface: 80,
    },
  ]

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
      {/* Alert: Pending Applications */}
      {pendingApplications.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-amber-900">
                {pendingApplications.length} candidature{pendingApplications.length > 1 ? 's' : ''} en attente
              </p>
              <p className="text-sm text-amber-700">
                Des cleaners ont postulé à vos missions
              </p>
            </div>
          </div>
          <Link to="/host/bookings">
            <Button variant="accent" size="sm">
              Voir les candidatures
            </Button>
          </Link>
        </div>
      )}

      {/* Alert: To Rate */}
      {toRate.length > 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-900">
                {toRate.length} ménage{toRate.length > 1 ? 's' : ''} à noter
              </p>
              <p className="text-sm text-green-700">
                N'oubliez pas de noter vos cleaners !
              </p>
            </div>
          </div>
          <Button variant="accent" size="sm" onClick={() => setMissionToRate(toRate[0])}>
            Noter maintenant
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Home}
          label="Biens actifs"
          value={3}
        />
        <StatCard
          icon={Calendar}
          label="Ménages ce mois"
          value={stats.completed}
        />
        <Card className={cn("p-4", stats.applied > 0 && "ring-2 ring-amber-400")}>
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stats.applied > 0 ? "bg-amber-100" : "bg-surface-100")}>
              <AlertCircle className={cn("w-5 h-5", stats.applied > 0 ? "text-amber-600" : "text-surface-500")} />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.applied}</p>
              <p className="text-sm text-surface-500">Candidatures</p>
            </div>
          </div>
        </Card>
        <StatCard
          icon={Star}
          label="Note moyenne"
          value="4.9 ⭐"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Next Cleaning */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-900">Prochain ménage</h2>
            {nextMission && (
              <Badge variant={nextMission.status === MISSION_STATUS.IN_PROGRESS ? 'info' : 'success'}>
                {nextMission.status === MISSION_STATUS.IN_PROGRESS ? 'En cours' : 'Confirmé'}
              </Badge>
            )}
          </div>

          {nextMission ? (
            <div className="bg-gradient-to-br from-accent-50 to-brand-50 rounded-2xl p-5">
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
                <div className="flex items-center gap-3">
                  <Avatar src={nextMission.cleanerAvatar} name={nextMission.cleanerName} size="md" />
                  <div>
                    <p className="font-semibold text-surface-900">{nextMission.cleanerName}</p>
                    <p className="text-sm text-surface-500">⭐ 4.9</p>
                  </div>
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
                <div className="flex items-center gap-2 text-accent-600 font-semibold">
                  <Euro className="w-4 h-4" />
                  <span>{nextMission.price}€</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link to="/host/bookings" className="flex-1">
                  <Button fullWidth variant="accent">
                    Voir les détails
                  </Button>
                </Link>
                <Link to="/host/messages">
                  <Button variant="secondary" icon={MessageCircle}>
                    Message
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-surface-400" />
              </div>
              <p className="text-surface-500 mb-4">Aucun ménage prévu</p>
              <Button variant="accent" icon={Plus} onClick={() => setShowCreateModal(true)}>
                Planifier un ménage
              </Button>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Actions rapides</h2>
          
          <div className="space-y-3">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="w-full flex items-center gap-3 p-4 bg-accent-50 hover:bg-accent-100 rounded-xl transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-accent-900">Nouveau ménage</p>
                <p className="text-sm text-accent-700">Planifier une intervention</p>
              </div>
            </button>

            <Link 
              to="/host/bookings"
              className="w-full flex items-center gap-3 p-4 bg-surface-50 hover:bg-surface-100 rounded-xl transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-surface-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-surface-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-surface-900">Réservations</p>
                <p className="text-sm text-surface-500">Gérer mes demandes</p>
              </div>
              {stats.applied > 0 && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                  {stats.applied}
                </span>
              )}
            </Link>

            <Link 
              to="/host/messages"
              className="w-full flex items-center gap-3 p-4 bg-surface-50 hover:bg-surface-100 rounded-xl transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-surface-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5 text-surface-600" />
              </div>
              <div>
                <p className="font-semibold text-surface-900">Messages</p>
                <p className="text-sm text-surface-500">Contacter mes cleaners</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>

      {/* Properties */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900">
            Mes biens
          </h2>
          <Link to="/host/properties/new">
            <Button size="sm" variant="secondary" icon={Plus}>
              Ajouter
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {properties.map((property) => (
            <Link
              key={property.id}
              to={`/host/properties/${property.id}`}
              className="bg-surface-50 hover:bg-surface-100 rounded-xl transition-colors group overflow-hidden"
            >
              <div className="h-24 overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-surface-900 group-hover:text-accent-600 transition-colors">
                    {property.name}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-surface-400 group-hover:text-surface-600 transition-colors" />
                </div>
                <p className="text-sm text-surface-500">
                  {property.address} • {property.surface}m²
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Modals */}
      <CreateMissionModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
      
      <RateMissionModal
        isOpen={!!missionToRate}
        onClose={() => setMissionToRate(null)}
        mission={missionToRate}
      />
    </div>
  )
}

export default HostDashboard
