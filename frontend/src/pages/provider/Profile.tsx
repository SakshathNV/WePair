import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { User, Truck, MapPin, Phone, Mail, Building2, Wrench, RefreshCw, CreditCard, Activity, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Feedback';
import { getServiceCategoryLabel } from '../../utils/helpers';
import { ProviderStatus } from '../../types';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  serviceCategories: z.array(z.string()).min(1, 'Select at least one service category'),
  coverageRadiusKm: z.coerce.number().min(1, 'Coverage radius must be at least 1 km'),
  status: z.nativeEnum(ProviderStatus),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProviderProfile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [provider, setProvider] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      description: '',
      serviceCategories: [],
      coverageRadiusKm: 10,
      status: 'ONLINE',
    },
  });

  const selectedCategories = watch('serviceCategories');

  const categoryOptions = [
    { value: 'ROADSIDE_ASSISTANCE', label: 'Roadside Assistance' },
    { value: 'TOWING', label: 'Towing' },
    { value: 'WORKSHOP', label: 'Workshop' },
    { value: 'FUEL_ASSISTANCE', label: 'Fuel Assistance' },
  ];

  useEffect(() => {
    setProvider({
      id: 'provider-1',
      userId: user?.id,
      name: user?.name || 'Rajesh Kumar',
      description: 'Verified roadside assistance provider with 5+ years experience',
      serviceCategories: ['ROADSIDE_ASSISTANCE', 'TOWING'],
      coverageRadiusKm: 15,
      baseLocation: { latitude: 19.076, longitude: 72.8777, address: 'Bandra, Mumbai, Maharashtra' },
      status: 'ONLINE',
      rating: 4.8,
      totalJobs: 150,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: { id: 'provider-1', email: 'rajesh@example.com', name: user?.name || 'Rajesh Kumar', phone: '+91 98765 43210', role: 'PROVIDER', createdAt: '', updatedAt: '' },
    });
    setIsLoading(false);
  }, [user]);

  const onSubmit = (data: ProfileFormData) => {
    console.log('Profile updated:', data);
    setIsEditing(false);
  };

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
          <h1 className="text-2xl font-bold text-slate-100">Provider Profile</h1>
          <p className="text-slate-400 mt-1">Manage your service provider information</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant="outline" size="sm">
          {isEditing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2" /> Cancel
            </>
          ) : (
            <>
              <User className="w-4 h-4 mr-2" /> Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your public provider details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-indigo-500/30">
                  {provider?.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">{provider?.name}</h2>
                  <p className="text-slate-400 text-sm">{provider?.user?.email}</p>
                  <Badge variant={provider?.isVerified ? 'success' : 'default'} size="sm" dot>
                    {provider?.isVerified ? 'Verified Provider' : 'Unverified'}
                  </Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-sm font-medium text-slate-300 mb-3">Description</p>
                <p className="text-slate-400">{provider?.description || 'No description added'}</p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-sm font-medium text-slate-300 mb-3">Service Categories</p>
                <div className="flex flex-wrap gap-3">
                  {provider?.serviceCategories?.map((cat: string) => (
                    <Badge key={cat} variant="outline" size="sm">
                      {getServiceCategoryLabel(cat)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-300">Coverage Radius</span>
                  <span className="text-sm text-slate-100 font-mono">{provider?.coverageRadiusKm} km</span>
                </div>
                <p className="text-sm text-slate-400">You serve customers within this radius of your base location.</p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-300">Base Location</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>{provider?.baseLocation?.address || 'Not set'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Jobs</p>
                  <p className="text-2xl font-bold text-slate-100">{provider?.totalJobs}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Rating</p>
                  <p className="text-2xl font-bold text-slate-100">{provider?.rating} <span className="text-sm font-normal text-yellow-400">★</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Operational Status</CardTitle>
              <CardDescription>Toggle your availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">Available for Jobs</span>
                <Badge variant={provider?.status === 'ONLINE' ? 'success' : 'default'} size="sm" dot>
                  {provider?.status === 'ONLINE' ? 'Online' : 'Offline'}
                </Badge>
              </div>
              <div className="space-y-3">
                <Button
                  variant={provider?.status === 'ONLINE' ? 'outline' : 'primary'}
                  className="w-full"
                  onClick={() => {}}
                >
                  {provider?.status === 'ONLINE' ? 'Go Offline' : 'Go Online'}
                </Button>
                <Button variant="ghost" className="w-full text-red-400 hover:bg-red-500/10">
                  <Truck className="w-4 h-4 mr-2" />
                  Set Busy
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How customers can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-100">Phone</p>
                  <p className="text-sm text-slate-400">{provider?.user?.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-100">Email</p>
                  <p className="text-sm text-slate-400">{provider?.user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-100">Address</p>
                  <p className="text-sm text-slate-400">{provider?.baseLocation?.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your provider information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Provider Name"
                  type="text"
                  placeholder="Rajesh Kumar"
                  error={errors.name?.message}
                  {...register('name')}
                  defaultValue={provider?.name}
                  leftIcon={<User className="w-5 h-5 text-slate-400" />}
                />
                <Input
                  label="Coverage Radius (km)"
                  type="number"
                  placeholder="15"
                  error={errors.coverageRadiusKm?.message}
                  {...register('coverageRadiusKm')}
                  defaultValue={provider?.coverageRadiusKm}
                  leftIcon={<MapPin className="w-5 h-5 text-slate-400" />}
                />
              </div>
              <Input
                label="Description"
                type="text"
                placeholder="Brief description of your services"
                error={errors.description?.message}
                {...register('description')}
                defaultValue={provider?.description}
                leftIcon={<Wrench className="w-5 h-5 text-slate-400" />}
              />
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Service Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((cat) => (
                    <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.value)}
                        onChange={(e) => {
                          const current = watch('serviceCategories');
                          if (e.target.checked) {
                            setValue('serviceCategories', [...current, cat.value]);
                          } else {
                            setValue('serviceCategories', current.filter((c: string) => c !== cat.value));
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
                      />
                      {cat.label}
                    </label>
                  ))}
                </div>
                {errors.serviceCategories?.message && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.serviceCategories.message}</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1">Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function ProviderEarnings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Earnings</h1>
        <p className="text-slate-400 mt-1">Track your service income and payouts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Earnings</p>
                <p className="text-3xl font-bold text-slate-100">₹45,200</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">This Month</p>
                <p className="text-3xl font-bold text-slate-100">₹8,450</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending Payout</p>
                <p className="text-3xl font-bold text-slate-100">₹1,200</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest earnings history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-400 border-b border-slate-800">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Job</th>
                  <th className="pb-3 font-medium">Service</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  { date: 'Oct 14, 2026', job: 'CA-1234', service: 'Battery Jump Start', amount: '₹499', status: 'CAPTURED' },
                  { date: 'Oct 13, 2026', job: 'CA-1233', service: 'Flat Tire Change', amount: '₹799', status: 'CAPTURED' },
                  { date: 'Oct 12, 2026', job: 'CA-1232', service: 'Fuel Assistance', amount: '₹299', status: 'CAPTURED' },
                  { date: 'Oct 11, 2026', job: 'CA-1231', service: 'Towing Service', amount: '₹1,299', status: 'PENDING' },
                ].map((tx) => (
                  <tr key={tx.job} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 text-sm text-slate-300">{tx.date}</td>
                    <td className="py-4 text-sm font-mono text-slate-100">{tx.job}</td>
                    <td className="py-4 text-sm text-slate-400">{tx.service}</td>
                    <td className="py-4 text-sm font-medium text-slate-100">{tx.amount}</td>
                    <td className="py-4"><Badge variant={tx.status === 'CAPTURED' ? 'success' : 'warning'} size="sm">{tx.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}