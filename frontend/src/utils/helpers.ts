import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString));
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    OPEN: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    IN_PROGRESS: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    RESOLVED: 'bg-green-500/20 text-green-400 border-green-500/30',
    CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
    CREATED: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    SEARCHING: 'bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse',
    ASSIGNED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    EN_ROUTE: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    ARRIVED: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    SERVICE_STARTED: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/30',
    NO_PROVIDER: 'bg-red-500/20 text-red-400 border-red-500/30',
    ONLINE: 'bg-green-500/20 text-green-400 border-green-500/30',
    OFFLINE: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    BUSY: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    INITIATED: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    AUTHORIZED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    CAPTURED: 'bg-green-500/20 text-green-400 border-green-500/30',
    REFUNDED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    FAILED: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    CUSTOMER: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    PROVIDER: 'bg-green-500/20 text-green-400 border-green-500/30',
    ADMIN: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };
  return colors[role] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
}

export function getVehicleCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    TWO_WHEELER: 'Two Wheeler',
    CAR: 'Car',
    SUV: 'SUV',
    COMMERCIAL: 'Commercial',
    EV: 'Electric Vehicle',
  };
  return labels[category] || category;
}

export function getFuelTypeLabel(fuelType: string): string {
  const labels: Record<string, string> = {
    PETROL: 'Petrol',
    DIESEL: 'Diesel',
    CNG: 'CNG',
    ELECTRIC: 'Electric',
    HYBRID: 'Hybrid',
  };
  return labels[fuelType] || fuelType;
}

export function getServiceCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    ROADSIDE_ASSISTANCE: 'Roadside Assistance',
    TOWING: 'Towing',
    WORKSHOP: 'Workshop',
    FUEL_ASSISTANCE: 'Fuel Assistance',
  };
  return labels[category] || category;
}

export function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    INITIATED: 'Initiated',
    PENDING: 'Pending',
    AUTHORIZED: 'Authorized',
    CAPTURED: 'Captured',
    REFUNDED: 'Refunded',
    PARTIAL_REFUND: 'Partial Refund',
    FAILED: 'Failed',
  };
  return labels[status] || status;
}