import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Sparkles, Home, Star, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CountUp } from '@/components/ui/CountUp'

function Hero() {
  const stats = [
    { value: 500, suffix: '+', label: 'Hôtes actifs', icon: Users },
    { value: 98, suffix: '%', label: 'Satisfaction', icon: Star },
    { value: 24, suffix: 'h', label: 'Réponse max', icon: Clock },
  ]

  const benefits = [
    'Cleaners vérifiés et assurés',
    'Paiement sécurisé',
    'Annulation gratuite 24h',
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-mesh-animated pt-20">
      {/* Animated background blobs */}
      <div className="absolute top-40 -left-40 w-80 h-80 bg-brand-300 rounded-full blur-3xl opacity-20 animate-morph" />
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-accent-300 rounded-full blur-3xl opacity-20 animate-morph delay-500" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-200 rounded-full blur-3xl opacity-10 animate-pulse-soft" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      <div className="container-custom relative z-10 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-brand-100 rounded-full shadow-soft animate-fade-in-down">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-surface-700">
                🎉 Nouveau : Synchronisation calendrier Airbnb
              </span>
            </div>

            {/* Title */}
            <div className="space-y-4 animate-fade-in-up">
              <h1 className="font-display text-display-lg lg:text-display-xl text-surface-900">
                Le ménage de vos{' '}
                <span className="text-gradient relative">
                  locations
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M1 5.5C47 2 153 2 199 5.5" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="200" y2="0">
                        <stop stopColor="#0ea5e9"/>
                        <stop offset="1" stopColor="#14b8a6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                {' '}simplifié
              </h1>
              <p className="text-xl text-surface-600 max-w-xl leading-relaxed">
                Connectez-vous aux meilleurs professionnels du ménage. 
                Automatisez vos réservations. 
                <strong className="text-surface-900"> Gagnez du temps.</strong>
              </p>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
              {benefits.map((benefit, index) => (
                <div 
                  key={benefit} 
                  className="flex items-center gap-2 text-surface-600 bg-white/60 backdrop-blur px-3 py-1.5 rounded-full border border-surface-100"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <Link to="/register?role=host">
                <Button size="lg" icon={Home} iconPosition="left" className="btn-ripple group">
                  <span>Je suis hôte</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/register?role=cleaner">
                <Button variant="secondary" size="lg" icon={Sparkles} iconPosition="left" className="btn-ripple">
                  Je suis cleaner
                </Button>
              </Link>
            </div>

            {/* Animated Stats */}
            <div className="flex items-center gap-8 pt-6 animate-fade-in-up delay-400">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="text-center group"
                >
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-3xl lg:text-4xl font-bold text-surface-900 font-display">
                      <CountUp 
                        end={stat.value} 
                        duration={2000} 
                        delay={500 + index * 200}
                        suffix={stat.suffix}
                      />
                    </p>
                  </div>
                  <p className="text-sm text-surface-500 mt-1 group-hover:text-brand-600 transition-colors">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - App Preview */}
          <div className="relative hidden lg:block">
            {/* Phone Mockup */}
            <div className="relative mx-auto animate-fade-in-right delay-300" style={{ maxWidth: '320px' }}>
              {/* Phone Frame */}
              <div className="relative bg-surface-900 rounded-[3rem] p-3 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-surface-900 rounded-b-2xl z-10" />
                
                {/* Screen */}
                <div className="bg-gradient-to-b from-brand-500 to-brand-600 rounded-[2.4rem] overflow-hidden">
                  <div className="p-6 pt-10 h-[520px]">
                    {/* App Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-brand-100 text-sm">Bonjour 👋</p>
                        <p className="text-white font-bold text-xl">Marie Dupont</p>
                      </div>
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                        <img 
                          src="https://randomuser.me/api/portraits/women/44.jpg" 
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white/15 backdrop-blur rounded-2xl p-4 mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-white">3</p>
                          <p className="text-brand-100 text-sm">Biens actifs</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-white">12</p>
                          <p className="text-brand-100 text-sm">Ménages ce mois</p>
                        </div>
                      </div>
                    </div>

                    {/* Next Cleaning Card */}
                    <div className="bg-white rounded-2xl p-4 mb-3 shadow-lg">
                      <p className="text-surface-500 text-sm mb-2">Prochain ménage</p>
                      <div className="flex items-center gap-3">
                        <img 
                          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=100&fit=crop"
                          alt="Appartement"
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-surface-900">Studio Marais</p>
                          <p className="text-surface-500 text-sm">14h00 • Marie L.</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full animate-pulse-soft">
                          Confirmé
                        </span>
                      </div>
                    </div>

                    {/* Quick Action */}
                    <button className="w-full bg-white rounded-2xl p-4 text-left hover:shadow-lg transition-shadow group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-surface-900">Réserver un ménage</p>
                            <p className="text-surface-500 text-sm">3 cleaners disponibles</p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-surface-400 group-hover:translate-x-1 group-hover:text-brand-500 transition-all" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-20 top-20 bg-white rounded-2xl shadow-soft-xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900">Ménage terminé</p>
                    <p className="text-surface-500 text-sm">Il y a 2 min</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-16 top-40 bg-white rounded-2xl shadow-soft-xl p-4 animate-float delay-300">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Cleaner"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-surface-900">Thomas accepté</p>
                    <p className="text-surface-500 text-sm">Nouvelle mission</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-12 bottom-28 bg-white rounded-2xl shadow-soft-xl p-4 animate-float delay-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900">4.9/5</p>
                    <p className="text-surface-500 text-sm">Note moyenne</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-surface-300 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-brand-500 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}

export { Hero }
export default Hero
