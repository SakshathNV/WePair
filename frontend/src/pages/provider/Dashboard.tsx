import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Wrench, Truck, MapPin, Clock, CreditCard, Users, Shield, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge, StatusBadge } from '../../components/ui/Feedback';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';
import { useState, useEffect } from 'react';

export function ProviderDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock provider jobs data
    setJobs([
      {
        id: '1',
        caseId: 'case-1',
        providerId: 'provider-1',
        status: 'EN_ROUTE',
        createdAt: new Date(Date.now() - 900000).toISOString(),
        updatedAt: new Date(Date.now() - 600000).toISOString(),
        case: {
          id: 'case-1',
          customerId: 'customer-1',
          vehicleId: 'vehicle-1',
          serviceId: 'service-1',
          location: { latitude: 19.076, longitude: 72.8777, address: 'Bandra, Mumbai' },
          description: 'Car battery jump start needed',
          status: 'IN_PROGRESS',
          createdAt: new Date(Date.now() - 1200000).toISOString(),
          updatedAt: new Date(Date.now() - 1200000).toISOString(),
          customer: { id: 'customer-1', email: 'john@example.com', name: 'John Doe', phone: '+91 9876543210', role: 'CUSTOMER', createdAt: '', updatedAt: '' },
          vehicle: { id: 'vehicle-1', userId: 'customer-1', category: 'CAR', make: 'Maruti Suzuki', model: 'Swift', year: 2022, licensePlate: 'MH12 AB 1234', fuelType: 'PETROL', color: 'Red', createdAt: '', updatedAt: '' },
          service: { id: 'service-1', name: 'Battery Jump Start', description: 'Vehicle battery assistance', category: 'ROADSIDE_ASSISTANCE', basePrice: 499, vehicleCategories: ['CAR', 'SUV'], fuelTypes: ['PETROL', 'DIESEL', 'CNG'], estimatedDurationMinutes: 30, isActive: true, createdAt: '', updatedAt: '' },
        },
        provider: { id: 'provider-1', userId: 'provider-1', name: 'Rajesh Kumar', serviceCategories: ['ROADSIDE_ASSISTANCE'], coverageRadiusKm: 10, baseLocation: { latitude: 19.076, longitude: 72.8777, address: 'Bandra, Mumbai' }, status: 'ONLINE', rating: 4.8, totalJobs: 150, isVerified: true, createdAt: '', updatedAt: '', user: { id: 'provider-1', email: 'rajesh@example.com', name: 'Rajesh Kumar', role: 'PROVIDER', createdAt: '', updatedAt: '' } },
      },
      {
        id: '2',
        caseId: 'case-2',
        providerId: 'provider-1',
        status: 'SEARCHING',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        case: {
          id: 'case-2',
          customerId: 'customer-2',
          vehicleId: 'vehicle-2',
          serviceId: 'service-2',
          location: { latitude: 19.089, longitude: 72.865, address: 'Andheri, Mumbai' },
          description: 'Flat tire change',
          status: 'OPEN',
          createdAt: new Date(Date.now() - 4000000).toISOString(),
          updatedAt: new Date(Date.now() - 4000000).toISOString(),
          customer: { id: 'customer-2', email: 'sarah@example.com', name: 'Sarah Patel', phone: '+91 9876543211', role: 'CUSTOMER', createdAt: '', updatedAt: '' },
          vehicle: { id: 'vehicle-2', userId: 'customer-2', category: 'CAR', make: 'Hyundai', model: 'i20', year: 2021, licensePlate: 'MH02 CD 5678', fuelType: 'PETROL', color: 'White', createdAt: '', updatedAt: '' },
          service: { id: 'service-2', name: 'Flat Tire Change', description: 'Tire replacement service', category: 'ROADSIDE_ASSISTANCE', basePrice: 799, vehicleCategories: ['CAR', 'SUV'], fuelTypes: ['PETROL', 'DIESEL'], estimatedDurationMinutes: 45, isActive: true, createdAt: '', updatedAt: '' },
        },
      },
    ]);
    setIsLoading(false);
  }, []);

  const activeJobs = jobs.filter(j => j.status === 'EN_ROUTE' || j.status === 'ARRIVED' || j.status === 'SERVICE_STARTED').length;
  const pendingJobs = jobs.filter(j => j.status === 'SEARCHING' || j.status === 'ASSIGNED').length;
  const completedToday = jobs.filter(j => j.status === 'COMPLETED').length;
  const earnings = 5400;

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
          <h1 className="text-2xl font-bold text-slate-100">Welcome back, {user?.name?.split(' ')[0] || 'Provider'}</h1>
          <p className="text-slate-400 mt-1">Manage your service jobs and availability</p>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-green-400 font-medium">Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Jobs</p>
                <p className="text-3xl font-bold text-slate-100">{activeJobs}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending Jobs</p>
                <p className="text-3xl font-bold text-slate-100">{pendingJobs}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Completed Today</p>
                <p className="text-3xl font-bold text-slate-100">{completedToday}</p>
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
                <p className="text-sm text-slate-400">Today's Earnings</p>
                <p className="text-3xl font-bold text-slate-100">{formatCurrency(earnings)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-400" />
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
                <CardTitle>Active Jobs</CardTitle>
                <CardDescription>Your current and upcoming service assignments</CardDescription>
              </div>
              <Link to="/provider/jobs">
                <Button variant="ghost" size="sm"><Clock className="w-4 h-4" /> View All Jobs</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <div className="text-center py-12">
                  <Wrench className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-300">No active jobs</h3>
                  <p className="text-slate-500 mt-1">You'll see available jobs here when they come in</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-100">{job.case?.service?.name || 'Service Job'}</h4>
                          <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                            <span>{job.case?.vehicle?.make} {job.case?.vehicle?.model}</span>
                            <span>{job.case?.vehicle?.licensePlate}</span>
                          </div>
                        </div>
                        <StatusBadge status={job.status} size="sm" />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.case?.location?.address || 'Location not specified'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatRelativeTime(job.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.case?.customer?.name}
                        </span>
                      </div>
                      <CardFooter className="flex items-center gap-3">
                        {job.status === 'SEARCHING' && (
                          <Button size="sm" variant="primary" className="flex-1"><Clock className="w-4 h-4 mr-2" /> Accept Job</Button>
                        )}
                        {job.status === 'ASSIGNED' && (
                          <Button size="sm" variant="outline" className="flex-1"><MapPin className="w-4 h-4 mr-2" /> Start En Route</Button>
                        )}
                        {job.status === 'EN_ROUTE' && (
                          <Button size="sm" variant="outline" className="flex-1"><Truck className="w-4 h-4 mr-2" /> Mark Arrived</Button>
                        )}
                        {job.status === 'ARRIVED' && (
                          <Button size="sm" variant="outline" className="flex-1"><Shield className="w-4 h-4 mr-2" /> Verify OTP</Button>
                        )}
                      </CardFooter>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Status</CardTitle>
              <CardDescription>Update your availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Shield className="w-4 h-4" />
                <span className="flex-1 text-left">Go Online</span>
                <Badge variant="success" size="sm">Available</Badge>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Clock className="w-4 h-4" />
                <span className="flex-1 text-left">Set Busy</span>
                <Badge variant="warning" size="sm">Occupied</Badge>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Users className="w-4 h-4" />
                <span className="flex-1 text-left">View Profile</span>
              </Button>
              <Link to="/provider/earnings" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Activity className="w-4 h-4" />
                  <span className="flex-1 text-left">View Earnings</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}