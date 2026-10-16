import { cn } from '../../utils/helpers';
import { X } from 'lucide-react';
import { forwardRef, type HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-slate-700 text-slate-300 border-slate-600',
      success: 'bg-green-500/20 text-green-400 border-green-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      danger: 'bg-red-500/20 text-red-400 border-red-500/30',
      info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      outline: 'bg-transparent text-slate-300 border-slate-600',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs gap-1',
      md: 'px-2.5 py-1 text-sm gap-1.5',
      lg: 'px-3 py-1.5 text-base gap-2',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full border transition-all duration-200',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export function StatusBadge({ status, size = 'md', showDot = true }: StatusBadgeProps) {
  const variantMap: Record<string, BadgeProps['variant']> = {
    OPEN: 'info',
    IN_PROGRESS: 'warning',
    RESOLVED: 'success',
    CANCELLED: 'danger',
    CREATED: 'default',
    SEARCHING: 'info',
    ASSIGNED: 'info',
    EN_ROUTE: 'info',
    ARRIVED: 'success',
    SERVICE_STARTED: 'warning',
    COMPLETED: 'success',
    NO_PROVIDER: 'danger',
    ONLINE: 'success',
    OFFLINE: 'default',
    BUSY: 'warning',
    INITIATED: 'default',
    PENDING: 'warning',
    AUTHORIZED: 'info',
    CAPTURED: 'success',
    REFUNDED: 'info',
    FAILED: 'danger',
  };

  return (
    <Badge variant={variantMap[status] || 'default'} size={size} dot={showDot}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn('rounded-full object-cover ring-2 ring-slate-700', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white ring-2 ring-slate-700',
        sizes[size],
        className
      )}
      aria-label={alt}
    >
      {fallback || alt?.charAt(0).toUpperCase() || '?'}
    </div>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Modal({ isOpen, onClose, title, description, children, className, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          className={cn(
            'relative w-full bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl',
            'transform transition-all duration-300 ease-in-out',
            sizes[size],
            className
          )}
        >
          {(title || description) && (
            <div className="flex items-start justify-between p-6 border-b border-slate-800">
              <div>
                {title && <h2 className="text-xl font-bold text-slate-100">{title}</h2>}
                {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const variants = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    danger: 'bg-red-500/10 border-red-500/30 text-red-400',
  };

  const icons = {
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    danger: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className={cn('flex gap-3 p-4 rounded-xl border', variants[variant], className)}>
      <div className="flex-shrink-0">{icons[variant]}</div>
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-medium">{title}</h4>}
        <div className={cn('text-sm', title && 'mt-1')}>{children}</div>
      </div>
    </div>
  );
}