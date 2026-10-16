import { useLocation, NavLink } from 'react-router-dom';
import { cn } from '../../utils/helpers';
import { LayoutDashboard, Truck, Wrench, User, LogOut, ChevronRight, Building2, Shield, CreditCard, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
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
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'fixed top-16 left-0 bottom-0 z-40 w-64 bg-slate-900/95 backdrop-blur-md border-r border-slate-800',
          'transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Sidebar navigation"
      >
        <nav className="flex h-full flex-col p-4" aria-label="Main navigation">
          <div className="flex-1 overflow-y-auto space-y-1">
            {getNavItems().map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto text-indigo-400" />}
                </NavLink>
              );
            })}
          </div>

          {isAuthenticated && user && (
            <div className="border-t border-slate-800 pt-4">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-100 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
                </div>
              </div>
              <button
                onClick={() => { logout(); onClose(); }}
                className="w-full mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}