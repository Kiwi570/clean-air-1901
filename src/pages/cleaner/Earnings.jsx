import { useState } from 'react'
import { Euro, TrendingUp, Calendar, CheckCircle, Clock, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CountUp } from '@/components/ui/CountUp'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

function Earnings() {
  const [period, setPeriod] = useState('month')

  const stats = {
    month: {
      total: 1250,
      missions: 12,
      avgPerMission: 104,
      trend: '+12%',
      trendUp: true,
    },
    week: {
      total: 320,
      missions: 4,
      avgPerMission: 80,
      trend: '+8%',
      trendUp: true,
    },
    year: {
      total: 14500,
      missions: 142,
      avgPerMission: 102,
      trend: '+25%',
      trendUp: true,
    },
  }

  const currentStats = stats[period]

  const transactions = [
    {
      id: '1',
      property: 'Studio Marais',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=100&fit=crop',
      date: '2025-01-20',
      amount: 55,
      status: 'paid',
      paidAt: '2025-01-22',
    },
    {
      id: '2',
      property: 'Appartement Bastille',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&h=100&fit=crop',
      date: '2025-01-19',
      amount: 72,
      status: 'paid',
      paidAt: '2025-01-21',
    },
    {
      id: '3',
      property: 'Loft Oberkampf',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=100&h=100&fit=crop',
      date: '2025-01-18',
      amount: 95,
      status: 'paid',
      paidAt: '2025-01-20',
    },
    {
      id: '4',
      property: 'Studio République',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100&h=100&fit=crop',
      date: '2025-01-17',
      amount: 42,
      status: 'pending',
    },
    {
      id: '5',
      property: 'Duplex Belleville',
      image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=100&h=100&fit=crop',
      date: '2025-01-16',
      amount: 85,
      status: 'paid',
      paidAt: '2025-01-18',
    },
  ]

  const pendingAmount = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 font-display">
            Mes Revenus
          </h1>
          <p className="text-surface-500 mt-1">
            Suivez vos gains et vos paiements
          </p>
        </div>

        <Button variant="secondary" icon={Download} className="hover-lift">
          Exporter
        </Button>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-2 p-1 bg-surface-100 rounded-2xl w-fit">
        {[
          { value: 'week', label: 'Semaine' },
          { value: 'month', label: 'Mois' },
          { value: 'year', label: 'Année' },
        ].map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={cn(
              'px-5 py-2.5 rounded-xl font-medium transition-all duration-300',
              period === p.value
                ? 'bg-white text-brand-600 shadow-md'
                : 'text-surface-600 hover:text-surface-900'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total gagné - Carte principale */}
        <Card className="bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-xl shadow-brand-500/25 hover-lift col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Euro className="w-6 h-6" />
            </div>
            <span className="text-brand-100 font-medium">Total gagné</span>
          </div>
          <p className="text-4xl font-bold mb-2">
            <CountUp end={currentStats.total} suffix=" €" duration={1500} />
          </p>
          <div className="flex items-center gap-2 text-brand-100">
            {currentStats.trendUp ? (
              <ArrowUpRight className="w-4 h-4 text-green-300" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-300" />
            )}
            <span className="text-sm">{currentStats.trend} vs période précédente</span>
          </div>
        </Card>

        {/* Missions terminées */}
        <Card className="border-l-4 border-l-green-500 shadow-soft hover:shadow-soft-lg transition-all hover-lift group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-surface-500 font-medium mb-1">Missions terminées</p>
          <p className="text-3xl font-bold text-surface-900">
            <CountUp end={currentStats.missions} duration={1500} delay={200} />
          </p>
        </Card>

        {/* Moyenne / mission */}
        <Card className="border-l-4 border-l-brand-500 shadow-soft hover:shadow-soft-lg transition-all hover-lift group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-brand-600" />
            </div>
          </div>
          <p className="text-sm text-surface-500 font-medium mb-1">Moyenne / mission</p>
          <p className="text-3xl font-bold text-surface-900">
            <CountUp end={currentStats.avgPerMission} suffix=" €" duration={1500} delay={400} />
          </p>
        </Card>

        {/* En attente */}
        <Card className={cn(
          'border-l-4 border-l-amber-500 shadow-soft hover:shadow-soft-lg transition-all hover-lift group',
          pendingAmount > 0 && 'bg-gradient-to-br from-amber-50 to-white'
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform',
              pendingAmount > 0 ? 'bg-amber-100 animate-pulse-soft' : 'bg-surface-100'
            )}>
              <Clock className={cn('w-6 h-6', pendingAmount > 0 ? 'text-amber-600' : 'text-surface-500')} />
            </div>
          </div>
          <p className="text-sm text-surface-500 font-medium mb-1">En attente</p>
          <p className="text-3xl font-bold text-surface-900">
            <CountUp end={pendingAmount} suffix=" €" duration={1500} delay={600} />
          </p>
        </Card>
      </div>

      {/* Transactions */}
      <Card className="hover-lift">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-surface-900">
            Historique des paiements
          </h2>
          <Badge variant="default" className="animate-fade-in">{transactions.length} transactions</Badge>
        </div>

        <div className="space-y-3">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-surface-50 hover:bg-surface-100 rounded-xl transition-all group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <img 
                  src={transaction.image}
                  alt={transaction.property}
                  className="w-12 h-12 rounded-xl object-cover group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="font-semibold text-surface-900 group-hover:text-brand-600 transition-colors">
                    {transaction.property}
                  </h3>
                  <p className="text-sm text-surface-500">
                    Mission du {formatDate(transaction.date, { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-4">
                <div>
                  <p className="font-bold text-surface-900 text-lg">
                    {formatCurrency(transaction.amount)}
                  </p>
                  {transaction.status === 'paid' ? (
                    <p className="text-sm text-green-600 flex items-center gap-1 justify-end">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Payé le {formatDate(transaction.paidAt, { day: 'numeric', month: 'short' })}
                    </p>
                  ) : (
                    <p className="text-sm text-amber-600 flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      En attente
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payout Info */}
      <Card className="bg-gradient-to-br from-surface-50 to-brand-50/30 border-brand-100 hover-lift">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/25">
            <Euro className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-900 mb-1 text-lg">
              Informations de paiement
            </h3>
            <p className="text-surface-600 mb-4">
              Les paiements sont effectués automatiquement sous 48h après validation du ménage par le client.
            </p>
            <Button variant="secondary" size="sm" className="hover-scale">
              Modifier mon RIB
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Earnings
