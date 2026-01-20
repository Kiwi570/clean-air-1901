import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, MapPin, Calendar, Clock, Euro, Home, User, 
  Phone, MessageSquare, Navigation, CheckCircle, X, Star,
  Ruler, Bath, Wind, Wifi
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/hooks/useToast'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

function MissionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error } = useToast()
  
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // Mock data - would come from API
  const mission = {
    id,
    property: 'Studio Marais',
    address: '15 Rue des Archives, 75004 Paris',
    date: '2025-01-20',
    dateFormatted: 'Lundi 20 Janvier 2025',
    time: '14:00',
    duration: '2h',
    price: 55,
    status: 'available', // available, pending, accepted, in_progress, completed
    type: 'Studio',
    surface: 25,
    rooms: 1,
    bathrooms: 1,
    floor: 3,
    elevator: true,
    code: 'A1234',
    instructions: 'Les draps propres sont dans l\'armoire de l\'entrée. Merci de bien aérer l\'appartement en partant.',
    amenities: ['Cuisine équipée', 'Lave-linge', 'Climatisation'],
    checklist: [
      'Nettoyage complet de la cuisine',
      'Nettoyage salle de bain',
      'Changement des draps',
      'Aspirateur et serpillère',
      'Poubelles vidées',
    ],
    host: {
      name: 'Marie Dupont',
      rating: 4.8,
      reviewCount: 24,
      phone: '06 12 34 56 78',
      memberSince: '2023',
    },
    lat: 48.8589,
    lng: 2.3579,
  }

  const handleAccept = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setShowAcceptModal(false)
    success('Mission acceptée ! Elle a été ajoutée à votre planning.')
    navigate('/cleaner/planning')
  }

  const handleDecline = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setLoading(false)
    setShowDeclineModal(false)
    success('Mission refusée')
    navigate('/cleaner/missions')
  }

  const openNavigation = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mission.lat},${mission.lng}`
    window.open(url, '_blank')
  }

  const getStatusActions = () => {
    switch (mission.status) {
      case 'available':
        return (
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              onClick={() => setShowDeclineModal(true)}
              icon={X}
            >
              Refuser
            </Button>
            <Button 
              onClick={() => setShowAcceptModal(true)}
              icon={CheckCircle}
              className="flex-1"
            >
              Accepter la mission
            </Button>
          </div>
        )
      case 'accepted':
        return (
          <div className="flex gap-3">
            <Button variant="secondary" icon={MessageSquare}>
              Contacter
            </Button>
            <Button 
              onClick={openNavigation}
              icon={Navigation}
              className="flex-1"
            >
              Lancer la navigation
            </Button>
          </div>
        )
      case 'in_progress':
        return (
          <Button fullWidth icon={CheckCircle}>
            Marquer comme terminé
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-surface-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-surface-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-surface-900 font-display">
            {mission.property}
          </h1>
          <p className="text-surface-500 flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4" />
            {mission.address}
          </p>
        </div>
        <StatusBadge status={mission.status} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mission Info Card */}
          <Card className="bg-gradient-to-br from-brand-50 to-accent-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <Calendar className="w-6 h-6 text-brand-500 mx-auto mb-2" />
                <p className="text-sm text-surface-500">Date</p>
                <p className="font-semibold text-surface-900">{mission.dateFormatted}</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <Clock className="w-6 h-6 text-brand-500 mx-auto mb-2" />
                <p className="text-sm text-surface-500">Horaire</p>
                <p className="font-semibold text-surface-900">{mission.time} • {mission.duration}</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <Home className="w-6 h-6 text-brand-500 mx-auto mb-2" />
                <p className="text-sm text-surface-500">Type</p>
                <p className="font-semibold text-surface-900">{mission.type} • {mission.surface}m²</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <Euro className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-surface-500">Rémunération</p>
                <p className="font-bold text-2xl text-green-600">{formatCurrency(mission.price)}</p>
              </div>
            </div>
          </Card>

          {/* Property Details */}
          <Card>
            <h2 className="text-lg font-semibold text-surface-900 mb-4">
              Détails du logement
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                <Ruler className="w-5 h-5 text-surface-400" />
                <div>
                  <p className="text-sm text-surface-500">Surface</p>
                  <p className="font-medium text-surface-900">{mission.surface}m²</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                <Home className="w-5 h-5 text-surface-400" />
                <div>
                  <p className="text-sm text-surface-500">Pièces</p>
                  <p className="font-medium text-surface-900">{mission.rooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                <Bath className="w-5 h-5 text-surface-400" />
                <div>
                  <p className="text-sm text-surface-500">Salle de bain</p>
                  <p className="font-medium text-surface-900">{mission.bathrooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                <span className="text-lg">🛗</span>
                <div>
                  <p className="text-sm text-surface-500">Étage</p>
                  <p className="font-medium text-surface-900">{mission.floor}e {mission.elevator ? '(asc.)' : ''}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-6">
              {mission.amenities.map((amenity) => (
                <Badge key={amenity} variant="default">{amenity}</Badge>
              ))}
            </div>

            {/* Access Code */}
            {mission.status === 'accepted' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-700 font-medium mb-1">Code d'accès</p>
                <p className="text-2xl font-bold text-amber-900 font-mono">{mission.code}</p>
              </div>
            )}
          </Card>

          {/* Checklist */}
          <Card>
            <h2 className="text-lg font-semibold text-surface-900 mb-4">
              Tâches à effectuer
            </h2>
            <div className="space-y-3">
              {mission.checklist.map((task, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <span className="text-surface-700">{task}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Instructions */}
          {mission.instructions && (
            <Card>
              <h2 className="text-lg font-semibold text-surface-900 mb-4">
                Instructions particulières
              </h2>
              <p className="text-surface-600 leading-relaxed">
                {mission.instructions}
              </p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card className="sticky top-4">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-surface-900 mb-1">
                {formatCurrency(mission.price)}
              </p>
              <p className="text-surface-500">pour {mission.duration}</p>
            </div>
            {getStatusActions()}
          </Card>

          {/* Host Info */}
          <Card>
            <h3 className="font-semibold text-surface-900 mb-4">Hôte</h3>
            <div className="flex items-center gap-4 mb-4">
              <Avatar name={mission.host.name} size="lg" />
              <div>
                <p className="font-semibold text-surface-900">{mission.host.name}</p>
                <div className="flex items-center gap-1 text-sm text-surface-500">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span>{mission.host.rating}</span>
                  <span>•</span>
                  <span>{mission.host.reviewCount} avis</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-surface-500 mb-4">
              Membre depuis {mission.host.memberSince}
            </p>
            {mission.status === 'accepted' && (
              <Button variant="secondary" fullWidth icon={Phone}>
                {mission.host.phone}
              </Button>
            )}
          </Card>

          {/* Map Preview */}
          <Card padding="none" className="overflow-hidden">
            <div className="h-48 bg-surface-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-surface-400 mx-auto mb-2" />
                <p className="text-sm text-surface-500">Paris 4e</p>
              </div>
            </div>
            <div className="p-4">
              <Button 
                variant="secondary" 
                fullWidth 
                icon={Navigation}
                onClick={openNavigation}
              >
                Voir sur Google Maps
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Accept Modal */}
      <Modal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        title="Accepter la mission"
      >
        <div className="space-y-4">
          <p className="text-surface-600">
            Vous êtes sur le point d'accepter cette mission :
          </p>
          <div className="p-4 bg-surface-50 rounded-xl">
            <p className="font-semibold text-surface-900">{mission.property}</p>
            <p className="text-sm text-surface-500">{mission.dateFormatted} à {mission.time}</p>
            <p className="text-lg font-bold text-brand-600 mt-2">{formatCurrency(mission.price)}</p>
          </div>
          <p className="text-sm text-surface-500">
            En acceptant, vous vous engagez à effectuer cette prestation. Une annulation tardive peut affecter votre note.
          </p>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowAcceptModal(false)}>
              Annuler
            </Button>
            <Button onClick={handleAccept} loading={loading} className="flex-1">
              Confirmer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Decline Modal */}
      <Modal
        isOpen={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        title="Refuser la mission"
      >
        <div className="space-y-4">
          <p className="text-surface-600">
            Êtes-vous sûr de vouloir refuser cette mission ?
          </p>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowDeclineModal(false)}>
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDecline} loading={loading}>
              Refuser
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MissionDetail
