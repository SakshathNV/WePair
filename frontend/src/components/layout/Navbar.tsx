import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/helpers';
import { LayoutDashboard, Truck, User, LogOut, Menu, Wrench, Building2, Shield, CreditCard, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/cases', label: 'My Cases', icon: Wrench },
    { path: '/vehicles', label: 'Vehicles', icon: Truck },
    { path: '/payments', label: 'Payments', icon: CreditCard },
    { path: '/notifications', label: 'Notifications', icon: Bell },
  ];

  const providerNavItems = [
    { path: '/provider/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/provider/jobs', label: 'Jobs', icon: Wrench },
    { path: '/provider/profile', label: 'Profile', icon: User },
    { path: '/provider/earnings', label: 'Earnings', icon: CreditCard },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: User },
    { path: '/admin/providers', label: 'Providers', icon: Building2 },
    { path: '/admin/services', label: 'Services', icon: Wrench },
    { path: '/admin/analytics', label: 'Analytics', icon: Shield },
  ];

  const getNavItems = () => {
    if (!user) return navItems;
    switch (user.role) {
      case 'PROVIDER':
        return providerNavItems;
      case 'ADMIN':
        return adminNavItems;
      default:
        return navItems;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
              W
            </span>
            <span className="hidden sm:block text-xl font-bold tracking-tight text-white">
              We<span className="text-indigo-400">Pair</span>
            </span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {getNavItems().map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user && (
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-100">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}