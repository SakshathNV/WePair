import { Link, useSearchParams } from 'react-router-dom';
import { Search, Wrench, Truck, MapPin, Clock, Shield, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Feedback';
import { formatRelativeTime } from '../../utils/helpers';
import { useState, useEffect } from 'react';

export function ProviderJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    search: searchParams.get('search') || '',
  });

  useEffect(() => {
    setJobs([
      {
        id: '1',
        caseId: 'case-1',
        providerId: 'provider-1',
        status: 'EN_ROUTE',
        otp: '123456',
        createdAt: new Date(Date.now() - 900000).toISOString(),
        updatedAt: new Date(Date.now() - 600000).toISOString(),
        case: {
          id: 'case-1',
          customerId: 'customer-1',
          vehicleId: 'vehicle-1',
          serviceId: 'service-1',
          location: { latitude: 19.076, longitude: 72.8777, address: 'Bandra Linking Road, Mumbai' },
          description: 'Car battery not starting, needs jump start',
          status: 'IN_PROGRESS',
          createdAt: new Date(Date.now() - 1200000).toISOString(),
          updatedAt: new Date(Date.now() - 1200000).toISOString(),
          customer: { id: 'customer-1', email: 'john@example.com', name: 'John Doe', phone: '+91 98765 43210', role: 'CUSTOMER', createdAt: '', updatedAt: '' },
          vehicle: { id: 'vehicle-1', userId: 'customer-1', category: 'CAR', make: 'Maruti Suzuki', model: 'Swift', year: 2022, licensePlate: 'MH12 AB 1234', fuelType: 'PETROL', color: 'Red', createdAt: '', updatedAt: '' },
          service: { id: 'service-1', name: 'Battery Jump Start', description: 'Vehicle battery assistance', category: 'ROADSIDE_ASSISTANCE', basePrice: 499, vehicleCategories: ['CAR', 'SUV'], fuelTypes: ['PETROL', 'DIESEL', 'CNG'], estimatedDurationMinutes: 30, isActive: true, createdAt: '', updatedAt: '' },
        },
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
          location: { latitude: 19.089, longitude: 72.865, address: 'Andheri West, Mumbai' },
          description: 'Front tire flat, needs replacement',
          status: 'OPEN',
          createdAt: new Date(Date.now() - 4000000).toISOString(),
          updatedAt: new Date(Date.now() - 4000000).toISOString(),
          customer: { id: 'customer-2', email: 'sarah@example.com', name: 'Sarah Patel', phone: '+91 98765 43211', role: 'CUSTOMER', createdAt: '', updatedAt: '' },
          vehicle: { id: 'vehicle-2', userId: 'customer-2', category: 'CAR', make: 'Hyundai', model: 'i20', year: 2021, licensePlate: 'MH02 CD 5678', fuelType: 'PETROL', color: 'White', createdAt: '', updatedAt: '' },
          service: { id: 'service-2', name: 'Flat Tire Change', description: 'Tire replacement service', category: 'ROADSIDE_ASSISTANCE', basePrice: 799, vehicleCategories: ['CAR', 'SUV'], fuelTypes: ['PETROL', 'DIESEL'], estimatedDurationMinutes: 45, isActive: true, createdAt: '', updatedAt: '' },
        },
      },
      {
        id: '3',
        caseId: 'case-3',
        providerId: 'provider-1',
        status: 'COMPLETED',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        case: {
          id: 'case-3',
          customerId: 'customer-3',
          vehicleId: 'vehicle-3',
          serviceId: 'service-3',
          location: { latitude: 19.10, longitude: 72.85, address: 'Powai, Mumbai' },
          description: 'Fuel delivery - ran out of petrol',
          status: 'RESOLVED',
          createdAt: new Date(Date.now() - 90000000).toISOString(),
          updatedAt: new Date(Date.now() - 90000000).toISOString(),
          customer: { id: 'customer-3', email: 'mike@example.com', name: 'Mike Ross', phone: '+91 98765 43212', role: 'CUSTOMER', createdAt: '', updatedAt: '' },
          vehicle: { id: 'vehicle-3', userId: 'customer-3', category: 'CAR', make: 'Tata', model: 'Nexon', year: 2023, licensePlate: 'MH43 EF 9012', fuelType: 'PETROL', color: 'Black', createdAt: '', updatedAt: '' },
          service: { id: 'service-3', name: 'Fuel Assistance', description: 'Emergency fuel delivery', category: 'FUEL_ASSISTANCE', basePrice: 299, vehicleCategories: ['CAR', 'SUV'], fuelTypes: ['PETROL', 'DIESEL'], estimatedDurationMinutes: 40, isActive: true, createdAt: '', updatedAt: '' },
        },
      },
    ]);
    setIsLoading(false);
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = !filters.status || job.status === filters.status;
    const matchesSearch = !filters.search ||
      job.case?.service?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.case?.customer?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.case?.vehicle?.licensePlate?.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'SEARCHING', label: 'Searching' },
    { value: 'ASSIGNED', label: 'Assigned' },
    { value: 'EN_ROUTE', label: 'En Route' },
    { value: 'ARRIVED', label: 'Arrived' },
    { value: 'SERVICE_STARTED', label: 'Service Started' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const acceptingJobs = filteredJobs.filter(j => j.status === 'SEARCHING');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">My Jobs</h1>
          <p className="text-slate-400 mt-1">Manage your service assignments</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Available Jobs</CardTitle>
            <CardDescription>{acceptingJobs.length} job(s) available to accept</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                placeholder="Search jobs..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 w-64"
              />
            </div>
            <Select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              options={statusOptions}
              className="w-48"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300">No jobs found</h3>
              <p className="text-slate-500 mt-1">
                {filters.status || filters.search ? 'Try adjusting your filters' : 'No jobs available at the moment. Go online to receive job requests.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Link key={job.id} to={`/provider/jobs/${job.id}`} className="block">
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-medium text-slate-100 truncate">{job.case?.service?.name || 'Service Job'}</span>
                          <StatusBadge status={job.status} size="md" />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.case?.location?.address || 'Location not specified'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Truck className="w-4 h-4" />
                            {job.case?.vehicle?.make} {job.case?.vehicle?.model}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {job.case?.customer?.name}
                          </span>
                          {job.otp && (
                            <span className="flex items-center gap-1 text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                              <Shield className="w-3 h-3" />
                              OTP: {job.otp}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-slate-500 line-clamp-2">{job.case?.description || ''}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono text-slate-500">{formatRelativeTime(job.createdAt)}</div>
                      </div>
                    </div>
                    {job.status === 'SEARCHING' && (
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <Button size="sm" variant="primary" className="w-full"><Clock className="w-4 h-4 mr-2" /> Accept This Job</Button>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}