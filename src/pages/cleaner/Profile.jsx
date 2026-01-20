import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, Star, MapPin, Calendar, CheckCircle, Edit2, Settings } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Badge, RatingBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { ZONES } from '@/lib/constants'

function Profile() {
  const { user, updateProfile } = useAuth()
  const { success: showSuccess } = useToast()
  
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    bio: 'Professionnelle du ménage depuis 5 ans, je suis spécialisée dans les locations courte durée. Minutieuse et ponctuelle, je m\'adapte à vos besoins.',
    zones: ['Paris 3e', 'Paris 4e', 'Paris 11e'],
  })

  const stats = {
    rating: 4.9,
    reviewCount: 48,
    completedMissions: 142,
    memberSince: '2024',
  }

  const reviews = [
    {
      id: '1',
      author: 'Sophie M.',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5,
      date: '2025-01-15',
      comment: 'Excellent travail, appartement impeccable ! Je recommande vivement.',
      property: 'Studio Marais',
    },
    {
      id: '2',
      author: 'Pierre D.',
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
      rating: 5,
      date: '2025-01-10',
      comment: 'Très professionnelle et ponctuelle. Le ménage était parfait.',
      property: 'Appartement Bastille',
    },
    {
      id: '3',
      author: 'Marie L.',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      rating: 4,
      date: '2025-01-05',
      comment: 'Bon travail dans l\'ensemble, quelques petits détails à améliorer.',
      property: 'Loft Oberkampf',
    },
  ]

  const handleSave = async () => {
    await updateProfile(formData)
    setEditing(false)
    showSuccess('Profil mis à jour')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-surface-900 font-display">
          Mon Profil
        </h1>
        <Button 
          variant={editing ? 'primary' : 'secondary'} 
          icon={editing ? CheckCircle : Edit2}
          onClick={editing ? handleSave : () => setEditing(true)}
        >
          {editing ? 'Enregistrer' : 'Modifier'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <Avatar 
                  name={`${formData.firstName} ${formData.lastName}`}
                  size="2xl"
                />
                {editing && (
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-brand-600 transition-colors">
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Name */}
              <h2 className="text-xl font-bold text-surface-900 mb-1">
                {formData.firstName} {formData.lastName}
              </h2>
              
              {/* Rating */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <RatingBadge rating={stats.rating} reviewCount={stats.reviewCount} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-surface-900">{stats.completedMissions}</p>
                  <p className="text-sm text-surface-500">Missions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-surface-900">{stats.memberSince}</p>
                  <p className="text-sm text-surface-500">Membre depuis</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Zones */}
          <Card className="mt-4">
            <h3 className="font-semibold text-surface-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-500" />
              Zones d'intervention
            </h3>
            <div className="flex flex-wrap gap-2">
              {formData.zones.map((zone) => (
                <Badge 
                  key={zone} 
                  variant="primary"
                  removable={editing}
                  onRemove={() => {
                    setFormData(prev => ({
                      ...prev,
                      zones: prev.zones.filter(z => z !== zone)
                    }))
                  }}
                >
                  {zone}
                </Badge>
              ))}
              {editing && (
                <button className="px-3 py-1 border-2 border-dashed border-surface-300 text-surface-500 rounded-full text-sm hover:border-brand-500 hover:text-brand-500 transition-colors">
                  + Ajouter
                </button>
              )}
            </div>
          </Card>

          {/* Settings Link (Mobile) */}
          <Link to="/cleaner/settings" className="lg:hidden block mt-4">
            <Card hover className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-surface-600" />
                </div>
                <span className="font-medium text-surface-900">Paramètres</span>
              </div>
              <svg className="w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Card>
          </Link>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Form */}
          <Card>
            <h3 className="text-lg font-semibold text-surface-900 mb-4">
              Informations personnelles
            </h3>
            
            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Prénom"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                  <Input
                    label="Nom"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <Input
                  label="Téléphone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
                <Textarea
                  label="Bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  hint="Décrivez votre expérience et vos points forts"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-surface-500 mb-1">Prénom</p>
                    <p className="font-medium text-surface-900">{formData.firstName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-surface-500 mb-1">Nom</p>
                    <p className="font-medium text-surface-900">{formData.lastName || '-'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-surface-500 mb-1">Email</p>
                  <p className="font-medium text-surface-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-surface-500 mb-1">Téléphone</p>
                  <p className="font-medium text-surface-900">{formData.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-surface-500 mb-1">Bio</p>
                  <p className="text-surface-700">{formData.bio}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Reviews */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">
                Derniers avis
              </h3>
              <Badge variant="default">{stats.reviewCount} avis</Badge>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 bg-surface-50 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <img 
                        src={review.avatar} 
                        alt={review.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-surface-900">{review.author}</p>
                        <p className="text-sm text-surface-500">{review.property}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-surface-700 ml-12">{review.comment}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile
