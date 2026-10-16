import { Link } from 'react-router-dom';
import { Wrench, Truck, MapPin, Clock, Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Feedback';
import { Alert } from '../../components/ui/Feedback';
import { formatRelativeTime, formatCurrency, getServiceCategoryLabel } from '../../utils/helpers';
import { useState, useEffect } from 'react';
import type { Case, Service, Vehicle } from '../../types';

export function CustomerDashboard() {
  const { user } = useAuth();
  const [recentCases, setRecentCases] = useState<Case[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [casesRes, vehiclesRes, servicesRes] = await Promise.all([
          api.getCases(),
          api.getServices(),
          // We'll fetch vehicles from a different endpoint - for now using mock
          Promise.resolve({ data: [] }),
        ]);
        setRecentCases(casesRes.data?.slice(0, 3) || []);
        setVehicles(vehiclesRes.data || []);
        setServices(servicesRes.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeCases = recentCases.filter(c => c.status === 'OPEN' || c.status === 'IN_PROGRESS');
  const completedCases = recentCases.filter(c => c.status === 'RESOLVED').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Welcome back, {user?.name?.split(' ')[0] || 'Customer'}</h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your roadside assistance</p>
        </div>
        <Link to="/cases/new" className="flex items-center gap-2">
          <Button size="lg"><Plus className="w-5 h-5" /> Request Assistance</Button>
        </Link>
      </div>

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Cases</p>
                <p className="text-3xl font-bold text-slate-100">{activeCases.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Completed</p>
                <p className="text-3xl font-bold text-slate-100">{completedCases}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Truck className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Registered Vehicles</p>
                <p className="text-3xl font-bold text-slate-100">{vehicles.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Available Services</p>
                <p className="text-3xl font-bold text-slate-100">{services.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Cases</CardTitle>
                <CardDescription>Your latest roadside assistance requests</CardDescription>
              </div>
              <Link to="/cases">
                <Button variant="ghost" size="sm"><RefreshCw className="w-4 h-4" /> View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentCases.length === 0 ? (
                <div className="text-center py-12">
                  <Wrench className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-300">No cases yet</h3>
                  <p className="text-slate-500 mt-1">Request roadside assistance when you need help</p>
                  <Link to="/cases/new" className="mt-4 inline-block">
                    <Button><Plus className="w-4 h-4 mr-2" /> Request Assistance</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentCases.map((caseItem) => (
                    <Link key={caseItem.id} to={`/cases/${caseItem.id}`} className="block">
                      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-medium text-slate-100 truncate">
                                {caseItem.service?.name || 'Service Request'}
                              </span>
                              <StatusBadge status={caseItem.status} size="sm" />
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {caseItem.location?.address || 'Location not specified'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatRelativeTime(caseItem.createdAt)}
                              </span>
                              {caseItem.vehicle && (
                                <span className="flex items-center gap-1">
                                  <Truck className="w-4 h-4" />
                                  {caseItem.vehicle.make} {caseItem.vehicle.model}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/cases/new" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Wrench className="w-5 h-5" />
                  <span>Request Assistance</span>
                </Button>
              </Link>
              <Link to="/vehicles" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Truck className="w-5 h-5" />
                  <span>Manage Vehicles</span>
                </Button>
              </Link>
              <Link to="/payments" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Payment History</span>
                </Button>
              </Link>
              <Link to="/notifications" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <RefreshCw className="w-5 h-5" />
                  <span>Notifications</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {services.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Popular Services</CardTitle>
                <CardDescription>Most requested assistance types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {services.slice(0, 5).map((service) => (
                  <Link key={service.id} to={`/cases/new?service=${service.id}`} className="block">
                    <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-100">{service.name}</p>
                          <p className="text-xs text-slate-400">{getServiceCategoryLabel(service.category)}</p>
                        </div>
                        <span className="text-sm font-medium text-indigo-400">{formatCurrency(service.basePrice)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}