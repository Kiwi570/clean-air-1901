import { useState } from 'react'
import { Calendar, Clock, Euro, FileText, MapPin, Home, X, Sparkles } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useMissions } from '@/hooks/useMissions'
import { useNotifications } from '@/hooks/useNotifications'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

// Properties disponibles (mock)
const properties = [
  {
    id: 'prop-1',
    name: 'Studio Marais',
    address: '15 Rue des Archives, Paris 4e',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    type: 'Studio',
    surface: 25,
    suggestedPrice: 55,
    suggestedDuration: '2h',
  },
  {
    id: 'prop-2',
    name: 'Appartement Bastille',
    address: '42 Rue de la Roquette, Paris 11e',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    type: 'T2',
    surface: 45,
    suggestedPrice: 72,
    suggestedDuration: '3h',
  },
  {
    id: 'prop-3',
    name: 'Loft Oberkampf',
    address: '25 Rue Oberkampf, Paris 11e',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop',
    type: 'Loft',
    surface: 80,
    suggestedPrice: 95,
    suggestedDuration: '4h',
  },
]

function CreateMissionModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [formData, setFormData] = useState({
    date: '',
    time: '10:00',
    duration: '2h',
    price: '',
    instructions: '',
  })
  const [loading, setLoading] = useState(false)

  const { createMission } = useMissions()
  const { notifyMissionCreated } = useNotifications()
  const { success: showSuccess } = useToast()

  const handlePropertySelect = (property) => {
    setSelectedProperty(property)
    setFormData(prev => ({
      ...prev,
      price: property.suggestedPrice.toString(),
      duration: property.suggestedDuration,
    }))
  }

  const handleSubmit = async () => {
    if (!selectedProperty || !formData.date || !formData.time || !formData.price) return

    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    const newMission = createMission({
      propertyId: selectedProperty.id,
      propertyName: selectedProperty.name,
      propertyImage: selectedProperty.image,
      propertyAddress: selectedProperty.address,
      propertySurface: selectedProperty.surface,
      propertyType: selectedProperty.type,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      price: parseInt(formData.price),
      instructions: formData.instructions,
    })

    // Notify cleaners
    notifyMissionCreated(newMission)

    showSuccess('Demande de ménage créée ! Les cleaners ont été notifiés. 🎉')

    setLoading(false)
    resetAndClose()
  }

  const resetAndClose = () => {
    setStep(1)
    setSelectedProperty(null)
    setFormData({
      date: '',
      time: '10:00',
      duration: '2h',
      price: '',
      instructions: '',
    })
    onClose()
  }

  // Get tomorrow's date as default minimum
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title={step === 1 ? 'Choisir un bien' : 'Planifier le ménage'}
      size="lg"
    >
      {step === 1 ? (
        /* Step 1: Select Property */
        <div className="space-y-4">
          <p className="text-surface-500 mb-4">
            Sélectionnez le bien pour lequel vous souhaitez planifier un ménage.
          </p>

          <div className="grid gap-3">
            {properties.map((property) => (
              <button
                key={property.id}
                onClick={() => handlePropertySelect(property)}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left',
                  selectedProperty?.id === property.id
                    ? 'border-accent-500 bg-accent-50'
                    : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
                )}
              >
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-surface-900">{property.name}</h3>
                  <p className="text-sm text-surface-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {property.address}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs bg-surface-100 text-surface-600 px-2 py-1 rounded-lg">
                      {property.type}
                    </span>
                    <span className="text-xs bg-surface-100 text-surface-600 px-2 py-1 rounded-lg">
                      {property.surface}m²
                    </span>
                    <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded-lg font-medium">
                      ~{property.suggestedPrice}€
                    </span>
                  </div>
                </div>
                {selectedProperty?.id === property.id && (
                  <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-100">
            <Button variant="secondary" onClick={resetAndClose}>
              Annuler
            </Button>
            <Button 
              variant="accent" 
              onClick={() => setStep(2)}
              disabled={!selectedProperty}
            >
              Continuer
            </Button>
          </div>
        </div>
      ) : (
        /* Step 2: Mission Details */
        <div className="space-y-5">
          {/* Selected Property Summary */}
          <div className="flex items-center gap-4 p-4 bg-accent-50 rounded-2xl">
            <img
              src={selectedProperty.image}
              alt={selectedProperty.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-semibold text-surface-900">{selectedProperty.name}</h3>
              <p className="text-sm text-surface-500">{selectedProperty.address}</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="ml-auto text-accent-600 hover:text-accent-700 text-sm font-medium"
            >
              Changer
            </button>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Date du ménage
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="date"
                  min={minDate}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-surface-50 border-2 border-surface-200 rounded-xl text-surface-900 focus:outline-none focus:border-accent-500 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Heure de début
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-surface-50 border-2 border-surface-200 rounded-xl text-surface-900 focus:outline-none focus:border-accent-500 focus:bg-white transition-all appearance-none"
                >
                  {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Duration & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Durée estimée
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-surface-50 border-2 border-surface-200 rounded-xl text-surface-900 focus:outline-none focus:border-accent-500 focus:bg-white transition-all appearance-none"
                >
                  <option value="1h">1 heure</option>
                  <option value="1h30">1h30</option>
                  <option value="2h">2 heures</option>
                  <option value="2h30">2h30</option>
                  <option value="3h">3 heures</option>
                  <option value="3h30">3h30</option>
                  <option value="4h">4 heures</option>
                  <option value="5h">5 heures</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Prix proposé (€)
              </label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="number"
                  min="20"
                  max="500"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-surface-50 border-2 border-surface-200 rounded-xl text-surface-900 focus:outline-none focus:border-accent-500 focus:bg-white transition-all"
                  placeholder="55"
                />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Instructions spéciales (optionnel)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-surface-400" />
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={3}
                className="w-full pl-11 pr-4 py-3 bg-surface-50 border-2 border-surface-200 rounded-xl text-surface-900 focus:outline-none focus:border-accent-500 focus:bg-white transition-all resize-none"
                placeholder="Ex: Merci de bien aérer après le ménage, les draps sont dans le placard..."
              />
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-surface-50 rounded-xl">
            <h4 className="font-medium text-surface-900 mb-2">Récapitulatif</h4>
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-500">
                {selectedProperty.name} • {formData.date ? new Date(formData.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) : '...'} à {formData.time}
              </span>
              <span className="font-bold text-accent-600 text-lg">
                {formData.price ? `${formData.price}€` : '...'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-3 pt-4 border-t border-surface-100">
            <Button variant="secondary" onClick={() => setStep(1)}>
              Retour
            </Button>
            <Button 
              variant="accent" 
              onClick={handleSubmit}
              loading={loading}
              disabled={!formData.date || !formData.price}
            >
              Publier la demande
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export { CreateMissionModal }
export default CreateMissionModal
