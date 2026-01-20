import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, MapPin, Clock, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

function Planning() {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [selectedDay, setSelectedDay] = useState(null) // null = voir tous les jours

  // Generate week days
  const getWeekDays = (weekOffset = 0) => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7)
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return {
        date,
        day: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        dayFull: date.toLocaleDateString('fr-FR', { weekday: 'long' }),
        number: date.getDate(),
        isToday: date.toDateString() === today.toDateString(),
        month: date.toLocaleDateString('fr-FR', { month: 'short' }),
        monthFull: date.toLocaleDateString('fr-FR', { month: 'long' }),
      }
    })
  }

  const weekDays = getWeekDays(currentWeek)

  // Mock missions data - dates relatives à aujourd'hui
  const today = new Date()
  const getDateStr = (daysOffset) => {
    const d = new Date(today)
    d.setDate(today.getDate() + daysOffset)
    return d.toISOString().split('T')[0]
  }

  const missions = {
    [getDateStr(0)]: [
      {
        id: '1',
        property: 'Studio Marais',
        address: 'Paris 4e',
        time: '09:00',
        duration: '2h',
        price: 55,
        status: 'accepted',
      },
      {
        id: '2',
        property: 'Appartement Bastille',
        address: 'Paris 11e',
        time: '14:00',
        duration: '3h',
        price: 72,
        status: 'accepted',
      },
    ],
    [getDateStr(2)]: [
      {
        id: '3',
        property: 'Loft Oberkampf',
        address: 'Paris 11e',
        time: '10:00',
        duration: '4h',
        price: 95,
        status: 'accepted',
      },
    ],
    [getDateStr(4)]: [
      {
        id: '4',
        property: 'Studio République',
        address: 'Paris 10e',
        time: '11:00',
        duration: '1h30',
        price: 42,
        status: 'pending',
      },
    ],
  }

  const getMissionsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return missions[dateStr] || []
  }

  const weekTotal = weekDays.reduce((total, day) => {
    const dayMissions = getMissionsForDate(day.date)
    return total + dayMissions.reduce((sum, m) => sum + m.price, 0)
  }, 0)

  const weekMissionCount = weekDays.reduce((total, day) => {
    return total + getMissionsForDate(day.date).length
  }, 0)

  // Jours avec des missions pour l'affichage agenda
  const daysWithMissions = weekDays.filter(day => getMissionsForDate(day.date).length > 0)

  // Jours à afficher (filtré si un jour est sélectionné)
  const displayDays = selectedDay !== null 
    ? weekDays.filter((_, index) => index === selectedDay)
    : daysWithMissions

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 font-display">
            Mon Planning
          </h1>
          <p className="text-surface-500 mt-1">
            {weekMissionCount} mission{weekMissionCount > 1 ? 's' : ''} • {formatCurrency(weekTotal)} cette semaine
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setCurrentWeek(prev => prev - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setCurrentWeek(0)
              setSelectedDay(null)
            }}
          >
            Aujourd'hui
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setCurrentWeek(prev => prev + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Week Calendar - Sélecteur de jour */}
      <Card padding="sm">
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {weekDays.map((day, index) => {
            const dayMissions = getMissionsForDate(day.date)
            const hasMissions = dayMissions.length > 0
            const isSelected = selectedDay === index
            
            return (
              <button
                key={day.number}
                onClick={() => setSelectedDay(isSelected ? null : index)}
                className={cn(
                  'text-center py-2 sm:py-3 rounded-xl transition-all relative',
                  day.isToday && !isSelected && 'bg-brand-100',
                  isSelected && 'bg-brand-500 text-white shadow-lg shadow-brand-500/25',
                  !day.isToday && !isSelected && 'hover:bg-surface-50'
                )}
              >
                <p className={cn(
                  'text-xs font-medium uppercase',
                  isSelected ? 'text-brand-100' : day.isToday ? 'text-brand-600' : 'text-surface-500'
                )}>
                  {day.day}
                </p>
                <p className={cn(
                  'text-base sm:text-lg font-bold mt-0.5',
                  isSelected ? 'text-white' : day.isToday ? 'text-brand-600' : 'text-surface-900'
                )}>
                  {day.number}
                </p>
                {/* Indicateur de missions */}
                {hasMissions && (
                  <div className="flex justify-center gap-0.5 mt-1">
                    {dayMissions.slice(0, 3).map((_, i) => (
                      <span 
                        key={i} 
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          isSelected ? 'bg-white' : 'bg-brand-500'
                        )} 
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </Card>

      {/* Agenda - Liste des missions par jour */}
      {displayDays.length > 0 ? (
        <div className="space-y-6">
          {displayDays.map((day) => {
            const dayMissions = getMissionsForDate(day.date)
            if (dayMissions.length === 0 && selectedDay === null) return null
            
            return (
              <div key={day.number}>
                {/* En-tête du jour */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0',
                    day.isToday ? 'bg-brand-500 text-white' : 'bg-surface-100'
                  )}>
                    <span className={cn(
                      'text-xs font-medium uppercase leading-none',
                      day.isToday ? 'text-brand-100' : 'text-surface-500'
                    )}>
                      {day.day}
                    </span>
                    <span className={cn(
                      'text-lg font-bold leading-none mt-0.5',
                      day.isToday ? 'text-white' : 'text-surface-900'
                    )}>
                      {day.number}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-surface-900 capitalize">
                      {day.dayFull}
                    </p>
                    <p className="text-sm text-surface-500">
                      {dayMissions.length > 0 
                        ? `${dayMissions.length} mission${dayMissions.length > 1 ? 's' : ''}` 
                        : 'Aucune mission'
                      }
                    </p>
                  </div>
                  {day.isToday && (
                    <Badge variant="primary" size="sm">
                      Aujourd'hui
                    </Badge>
                  )}
                </div>

                {/* Missions du jour */}
                {dayMissions.length > 0 ? (
                  <div className="space-y-3">
                    {dayMissions.map((mission) => (
                      <Link key={mission.id} to={`/cleaner/missions/${mission.id}`}>
                        <Card 
                          hover 
                          className={cn(
                            'border-l-4',
                            mission.status === 'accepted' ? 'border-l-brand-500' : 'border-l-amber-500'
                          )}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            {/* Horaire */}
                            <div className="flex items-center gap-3 sm:min-w-[140px]">
                              <div className="w-10 h-10 bg-surface-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-surface-500" />
                              </div>
                              <div>
                                <p className="font-semibold text-surface-900">{mission.time}</p>
                                <p className="text-sm text-surface-500">{mission.duration}</p>
                              </div>
                            </div>

                            {/* Séparateur desktop */}
                            <div className="hidden sm:block w-px h-10 bg-surface-200 flex-shrink-0" />

                            {/* Infos mission */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-surface-900">
                                {mission.property}
                              </h3>
                              <p className="text-sm text-surface-500 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{mission.address}</span>
                              </p>
                            </div>

                            {/* Prix et statut */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-surface-100 flex-shrink-0">
                              <span className="text-lg font-bold text-brand-600">
                                {formatCurrency(mission.price)}
                              </span>
                              <StatusBadge status={mission.status} />
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-surface-50 border-dashed border-surface-300">
                    <div className="text-center py-4">
                      <Calendar className="w-8 h-8 text-surface-300 mx-auto mb-2" />
                      <p className="text-surface-500">Aucune mission ce jour</p>
                      <Link 
                        to="/cleaner/missions" 
                        className="text-brand-600 font-medium text-sm hover:underline mt-1 inline-block"
                      >
                        Voir les missions disponibles
                      </Link>
                    </div>
                  </Card>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <Card className="bg-surface-50">
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-surface-300 mx-auto mb-3" />
            <h3 className="font-semibold text-surface-900 mb-1">Aucune mission cette semaine</h3>
            <p className="text-surface-500 mb-4">
              Vous n'avez pas encore de mission planifiée.
            </p>
            <Link to="/cleaner/missions">
              <Button>
                Trouver des missions
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Week Summary */}
      <Card className="bg-gradient-to-br from-brand-50 to-accent-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-surface-900 mb-1">
              Résumé de la semaine
            </h3>
            <p className="text-surface-600">
              {weekMissionCount} mission{weekMissionCount > 1 ? 's' : ''} planifiée{weekMissionCount > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-surface-500">Heures</p>
              <p className="text-xl font-bold text-surface-900">10h30</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-surface-500">Revenus</p>
              <p className="text-xl font-bold text-brand-600">{formatCurrency(weekTotal)}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Planning
