import { cn } from '@/lib/utils'
import { Button } from './Button'

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  actionIcon,
  secondaryAction,
  secondaryActionLabel,
  className,
  size = 'default',
}) {
  const sizes = {
    sm: {
      icon: 'w-12 h-12',
      iconWrapper: 'w-16 h-16',
      title: 'text-lg',
      description: 'text-sm',
    },
    default: {
      icon: 'w-16 h-16',
      iconWrapper: 'w-24 h-24',
      title: 'text-xl',
      description: 'text-base',
    },
    lg: {
      icon: 'w-20 h-20',
      iconWrapper: 'w-32 h-32',
      title: 'text-2xl',
      description: 'text-lg',
    },
  }

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center py-12 px-6',
      className
    )}>
      {Icon && (
        <div className={cn(
          'rounded-full bg-surface-100 flex items-center justify-center mb-6',
          sizes[size].iconWrapper
        )}>
          <Icon className={cn('text-surface-400', sizes[size].icon)} />
        </div>
      )}
      
      <h3 className={cn(
        'font-semibold text-surface-900 mb-2',
        sizes[size].title
      )}>
        {title}
      </h3>
      
      {description && (
        <p className={cn(
          'text-surface-500 max-w-md mb-6',
          sizes[size].description
        )}>
          {description}
        </p>
      )}
      
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button onClick={action} icon={actionIcon}>
              {actionLabel}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="secondary" onClick={secondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Predefined empty states
function NoMissionsEmpty({ onAction }) {
  return (
    <EmptyState
      icon={({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )}
      title="Aucune mission disponible"
      description="Il n'y a pas de missions disponibles pour le moment. Revenez plus tard ou élargissez vos zones d'intervention."
      actionLabel="Modifier mes zones"
      action={onAction}
    />
  )
}

function NoPropertiesEmpty({ onAction }) {
  return (
    <EmptyState
      icon={({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )}
      title="Aucun bien enregistré"
      description="Ajoutez votre premier bien pour commencer à planifier des ménages."
      actionLabel="Ajouter un bien"
      action={onAction}
    />
  )
}

function NoResultsEmpty({ query, onReset }) {
  return (
    <EmptyState
      icon={({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )}
      title="Aucun résultat"
      description={query ? `Aucun résultat pour "${query}"` : "Aucun élément ne correspond à vos critères."}
      actionLabel="Réinitialiser les filtres"
      action={onReset}
    />
  )
}

function ErrorEmpty({ onRetry }) {
  return (
    <EmptyState
      icon={({ className }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )}
      title="Une erreur est survenue"
      description="Impossible de charger les données. Veuillez réessayer."
      actionLabel="Réessayer"
      action={onRetry}
    />
  )
}

export { 
  EmptyState,
  NoMissionsEmpty,
  NoPropertiesEmpty,
  NoResultsEmpty,
  ErrorEmpty
}
export default EmptyState
