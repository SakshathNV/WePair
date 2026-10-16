import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/helpers';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<string, string> = {
      primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 focus:ring-indigo-500',
      secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 focus:ring-slate-500',
      outline: 'bg-transparent hover:bg-slate-800 text-slate-300 border border-slate-700 focus:ring-slate-500',
      ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 focus:ring-slate-500',
      danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 focus:ring-red-500',
      success: 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/30 focus:ring-green-500',
    };

    const sizes: Record<string, string> = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-base gap-2',
      lg: 'px-7 py-3.5 text-lg gap-2.5',
      xl: 'px-10 py-4 text-xl gap-3',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';