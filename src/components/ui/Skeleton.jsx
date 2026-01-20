import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('skeleton bg-surface-200 animate-pulse', className)}
      {...props}
    />
  )
}

function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            'h-4 rounded',
            i === lines - 1 && 'w-3/4'
          )} 
        />
      ))}
    </div>
  )
}

function SkeletonCard({ className }) {
  return (
    <div className={cn(
      'bg-white rounded-2xl border border-surface-200 p-6',
      className
    )}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2 rounded" />
          <Skeleton className="h-3 w-1/3 rounded" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  )
}

function SkeletonAvatar({ size = 'md', className }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  return (
    <Skeleton className={cn('rounded-full', sizes[size], className)} />
  )
}

function SkeletonButton({ size = 'md', className }) {
  const sizes = {
    sm: 'h-9 w-20',
    md: 'h-11 w-28',
    lg: 'h-13 w-36',
  }

  return (
    <Skeleton className={cn('rounded-xl', sizes[size], className)} />
  )
}

// Full page loading skeleton
function SkeletonPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <SkeletonButton />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-surface-200 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-16 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}

export { 
  Skeleton, 
  SkeletonText, 
  SkeletonCard, 
  SkeletonAvatar, 
  SkeletonButton,
  SkeletonPage 
}
export default Skeleton
