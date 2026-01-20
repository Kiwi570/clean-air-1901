import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

const Input = forwardRef(({
  label,
  error,
  hint,
  icon: Icon,
  type = 'text',
  className,
  containerClassName,
  floatingLabel = false,
  value,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type
  
  // Check if input has value (controlled or uncontrolled)
  const hasValue = value !== undefined ? value !== '' : false
  const isActive = isFocused || hasValue

  if (floatingLabel) {
    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        <div className="relative">
          {Icon && (
            <div className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200',
              isFocused ? 'text-brand-500' : 'text-surface-400'
            )}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'w-full px-4 py-4 bg-white border-2 rounded-xl text-surface-900',
              'transition-all duration-200 ease-out',
              'focus:outline-none focus:border-brand-500',
              'hover:border-surface-300',
              'peer',
              Icon && 'pl-12',
              isPassword && 'pr-12',
              error ? 'border-red-500 focus:border-red-500' : 'border-surface-200',
              className
            )}
            placeholder=" "
            {...props}
          />
          
          {/* Floating Label */}
          <label className={cn(
            'absolute transition-all duration-200 pointer-events-none',
            'text-surface-500 bg-white px-1',
            Icon ? 'left-11' : 'left-3',
            isActive 
              ? '-top-2.5 text-xs font-medium text-brand-600' 
              : 'top-1/2 -translate-y-1/2 text-base',
            error && isActive && 'text-red-500'
          )}>
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1.5 ml-1">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
        
        {hint && !error && (
          <p className="text-sm text-surface-500 ml-1">{hint}</p>
        )}
      </div>
    )
  }

  // Standard input (non-floating)
  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className={cn(
            'absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200',
            isFocused ? 'text-brand-500' : 'text-surface-400'
          )}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'w-full px-4 py-3 bg-surface-50 border-2 border-surface-200 rounded-xl',
            'text-surface-900 placeholder-surface-400',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10',
            'hover:border-surface-300',
            Icon && 'pl-12',
            isPassword && 'pr-12',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
            className
          )}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
      
      {hint && !error && (
        <p className="text-sm text-surface-500">{hint}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

// Textarea component
const Textarea = forwardRef(({
  label,
  error,
  hint,
  className,
  containerClassName,
  rows = 4,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          'w-full px-4 py-3 bg-surface-50 border-2 border-surface-200 rounded-xl',
          'text-surface-900 placeholder-surface-400 resize-none',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10',
          'hover:border-surface-300',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {hint && !error && (
        <p className="text-sm text-surface-500">{hint}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

// Select component
const Select = forwardRef(({
  label,
  error,
  hint,
  options = [],
  placeholder = 'Sélectionner...',
  className,
  containerClassName,
  ...props
}, ref) => {
  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        className={cn(
          'w-full px-4 py-3 bg-surface-50 border-2 border-surface-200 rounded-xl',
          'text-surface-900 appearance-none cursor-pointer',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10',
          'hover:border-surface-300',
          'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2364748b%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E")]',
          'bg-[length:1.5rem_1.5rem] bg-[position:right_0.75rem_center] bg-no-repeat pr-10',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
          className
        )}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {hint && !error && (
        <p className="text-sm text-surface-500">{hint}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

// Toggle Switch component
const Toggle = ({ checked, onChange, disabled = false, size = 'md', label, description }) => {
  const sizes = {
    sm: { track: 'w-9 h-5', thumb: 'w-4 h-4', translate: 'translate-x-4', icon: 'w-2.5 h-2.5' },
    md: { track: 'w-12 h-7', thumb: 'w-5 h-5', translate: 'translate-x-5', icon: 'w-3 h-3' },
    lg: { track: 'w-14 h-8', thumb: 'w-6 h-6', translate: 'translate-x-6', icon: 'w-3.5 h-3.5' },
  }
  const s = sizes[size]

  return (
    <div className="flex items-center justify-between">
      {(label || description) && (
        <div className="flex-1 mr-4">
          {label && <p className="font-medium text-surface-900">{label}</p>}
          {description && <p className="text-sm text-surface-500">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative inline-flex items-center rounded-full transition-colors duration-300 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
          s.track,
          checked ? 'bg-brand-500' : 'bg-surface-300',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 ease-out',
            s.thumb,
            checked ? s.translate : 'translate-x-1'
          )}
        >
          {checked ? (
            <svg className={cn(s.icon, 'text-brand-500')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className={cn(s.icon, 'text-surface-400')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </span>
      </button>
    </div>
  )
}

export { Input, Textarea, Select, Toggle }
export default Input
