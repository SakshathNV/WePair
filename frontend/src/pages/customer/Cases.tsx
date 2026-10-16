import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Search, Truck, MapPin, Clock, RefreshCw } from 'lucide-react';
import { api } from '../../api/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Input';
import { StatusBadge, Badge } from '../../components/ui/Feedback';
import { formatRelativeTime, getServiceCategoryLabel } from '../../utils/helpers';
import type { Case } from '../../types';

export function CustomerCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    search: searchParams.get('search') || '',
  });

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setIsLoading(true);
        const response = await api.getCases();
        setCases(response.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load cases');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCases();
  }, []);

  const filteredCases = cases.filter((caseItem) => {
    const matchesStatus = !filters.status || caseItem.status === filters.status;
    const matchesSearch = !filters.search || 
      caseItem.service?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      caseItem.location?.address?.toLowerCase().includes(filters.search.toLowerCase()) ||
      caseItem.vehicle?.make?.toLowerCase().includes(filters.search.toLowerCase()) ||
      caseItem.vehicle?.model?.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">My Cases</h1>
          <p className="text-slate-400 mt-1">Track all your roadside assistance requests</p>
        </div>
        <Link to="/cases/new">
          <Button size="lg"><Plus className="w-5 h-5 mr-2" /> New Request</Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          {error}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>All Cases</CardTitle>
            <CardDescription>{filteredCases.length} case(s) found</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                placeholder="Search cases..."
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
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300">No cases found</h3>
              <p className="text-slate-500 mt-1">
                {filters.status || filters.search ? 'Try adjusting your filters' : 'You haven\'t requested any assistance yet'}
              </p>
              {!filters.status && !filters.search && (
                <Link to="/cases/new" className="mt-4 inline-block">
                  <Button><Plus className="w-4 h-4 mr-2" /> Request Assistance</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCases.map((caseItem) => (
                <Link key={caseItem.id} to={`/cases/${caseItem.id}`} className="block">
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-medium text-slate-100 truncate">
                            {caseItem.service?.name || 'Service Request'}
                          </span>
                          <StatusBadge status={caseItem.status} size="md" />
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
                              {caseItem.vehicle.make} {caseItem.vehicle.model} ({caseItem.vehicle.licensePlate})
                            </span>
                          )}
                          {caseItem.service && (
                            <Badge variant="outline" className="text-xs">
                              {getServiceCategoryLabel(caseItem.service.category)}
                            </Badge>
                          )}
                        </div>
                        {caseItem.description && (
                          <p className="mt-2 text-sm text-slate-500 line-clamp-2">{caseItem.description}</p>
                        )}
                      </div>
                      <RefreshCw className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    </div>
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