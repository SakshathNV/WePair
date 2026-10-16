import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, Building2, Wrench, Shield, Activity, Truck, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge, StatusBadge } from '../../components/ui/Feedback';
import { formatCurrency } from '../../utils/helpers';
import { useState, useEffect } from 'react';

export function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    setStats({
      totalUsers: 1250,
      totalProviders: 85,
      totalCases: 3420,
      totalJobs: 2980,
      activeCases: 24,
      pendingJobs: 12,
      revenue: 845000,
      providersOnline: 32,
    });
  }, []);

  if (!stats) {
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
          <h1 className="text-2xl font-bold text-slate-100">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Platform overview and system management</p>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-800">
          <span className="text-sm font-medium text-slate-300">{user?.name}</span>
          <Badge variant="outline" size="sm" dot>ADMIN</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Users</p>
                <p className="text-3xl font-bold text-slate-100">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Service Providers</p>
                <p className="text-3xl font-bold text-slate-100">{stats.totalProviders}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Cases</p>
                <p className="text-3xl font-bold text-slate-100">{stats.totalCases}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Revenue</p>
                <p className="text-3xl font-bold text-slate-100">{formatCurrency(stats.revenue)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>System Activity</CardTitle>
              <CardDescription>Recent platform events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: '2m ago', type: 'CASE_CREATED', desc: 'New roadside assistance request from Mumbai', user: 'John Doe' },
                  { time: '15m ago', type: 'JOB_ASSIGNED', desc: 'Job assigned to provider Rajesh Kumar', user: 'System' },
                  { time: '1h ago', type: 'CASE_RESOLVED', desc: 'Case #CA-1234 marked as resolved', user: 'Sarah Patel' },
                  { time: '3h ago', type: 'PROVIDER_ONLINE', desc: 'Provider Mike Ross came online', user: 'System' },
                  { time: '5h ago', type: 'PAYMENT_CAPTURED', desc: 'Payment of ₹2,500 captured', user: 'System' },
                ].map((activity) => (
                  <div key={activity.type} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-100">{activity.desc}</span>
                        <span className="text-xs text-slate-500">{activity.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{activity.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/users">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Users className="w-4 h-4" />
                  <span className="flex-1 text-left">Manage Users</span>
                </Button>
              </Link>
              <Link to="/admin/providers">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Building2 className="w-4 h-4" />
                  <span className="flex-1 text-left">Manage Providers</span>
                </Button>
              </Link>
              <Link to="/admin/services">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Wrench className="w-4 h-4" />
                  <span className="flex-1 text-left">Service Catalog</span>
                </Button>
              </Link>
              <Link to="/admin/analytics">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Shield className="w-4 h-4" />
                  <span className="flex-1 text-left">Analytics</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
              <CardDescription>System status overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">API Status</span>
                <Badge variant="success" size="sm">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Database</span>
                <Badge variant="success" size="sm">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Providers Online</span>
                <Badge variant="info" size="sm">{stats.providersOnline} active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Pending Jobs</span>
                <Badge variant="warning" size="sm">{stats.pendingJobs}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    setUsers([
      { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+91 98765 43210', role: 'CUSTOMER', createdAt: new Date().toISOString(), status: 'active' },
      { id: '2', name: 'Sarah Patel', email: 'sarah@example.com', phone: '+91 98765 43211', role: 'CUSTOMER', createdAt: new Date().toISOString(), status: 'active' },
      { id: '3', name: 'Mike Ross', email: 'mike@example.com', phone: '+91 98765 43212', role: 'PROVIDER', createdAt: new Date().toISOString(), status: 'active' },
      { id: '4', name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 98765 43213', role: 'PROVIDER', createdAt: new Date().toISOString(), status: 'active' },
      { id: '5', name: 'Admin User', email: 'admin@wepair.com', phone: '+91 98765 43214', role: 'ADMIN', createdAt: new Date().toISOString(), status: 'active' },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">User Management</h1>
          <p className="text-slate-400 mt-1">Manage platform users and accounts</p>
        </div>
        <Link to="/admin/users/new">
          <Button size="lg"><Users className="w-4 h-4 mr-2" /> Add User</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>{users.length} registered user(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-400 border-b border-slate-800">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 text-sm font-medium text-slate-100">{u.name}</td>
                    <td className="py-4 text-sm text-slate-400">{u.email}</td>
                    <td className="py-4 text-sm text-slate-400 font-mono">{u.phone}</td>
                    <td className="py-4"><Badge variant={u.role === 'ADMIN' ? 'info' : u.role === 'PROVIDER' ? 'success' : 'default'} size="sm">{u.role}</Badge></td>
                    <td className="py-4"><Badge variant="success" size="sm" dot>Active</Badge></td>
                    <td className="py-4 text-sm text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-4">
                      <Button variant="ghost" size="sm" className="p-2"><Truck className="w-4 h-4" /></Button>
                    </td>
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

export function AdminProviders() {
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    setProviders([
      { id: '1', name: 'Rajesh Kumar', email: 'rajesh@example.com', serviceCategories: ['ROADSIDE_ASSISTANCE', 'TOWING'], status: 'ONLINE', rating: 4.8, totalJobs: 150, isVerified: true },
      { id: '2', name: 'Mike Ross', email: 'mike@example.com', serviceCategories: ['FUEL_ASSISTANCE', 'WORKSHOP'], status: 'BUSY', rating: 4.5, totalJobs: 89, isVerified: true },
      { id: '3', name: 'Priya Sharma', email: 'priya@example.com', serviceCategories: ['ROADSIDE_ASSISTANCE'], status: 'OFFLINE', rating: 4.9, totalJobs: 203, isVerified: false },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Provider Management</h1>
          <p className="text-slate-400 mt-1">Manage service providers on the platform</p>
        </div>
        <Link to="/admin/providers/new">
          <Button size="lg"><Building2 className="w-4 h-4 mr-2" /> Add Provider</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Providers</CardTitle>
          <CardDescription>{providers.length} service provider(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-400 border-b border-slate-800">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Services</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Rating</th>
                  <th className="pb-3 font-medium">Jobs</th>
                  <th className="pb-3 font-medium">Verified</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {providers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 text-sm font-medium text-slate-100">{p.name}</td>
                    <td className="py-4 text-sm text-slate-400">{p.email}</td>
                    <td className="py-4 text-sm text-slate-400">{p.serviceCategories.join(', ')}</td>
                    <td className="py-4"><StatusBadge status={p.status} size="sm" /></td>
                    <td className="py-4 text-sm text-slate-400 font-mono">{p.rating} ★</td>
                    <td className="py-4 text-sm text-slate-400">{p.totalJobs}</td>
                    <td className="py-4"><Badge variant={p.isVerified ? 'success' : 'default'} size="sm">{p.isVerified ? 'Yes' : 'No'}</Badge></td>
                    <td className="py-4">
                      <Button variant="ghost" size="sm" className="p-2"><Truck className="w-4 h-4" /></Button>
                    </td>
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

export function AdminServices() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    setServices([
      { id: '1', name: 'Battery Jump Start', category: 'ROADSIDE_ASSISTANCE', basePrice: 499, vehicleCategories: ['CAR', 'SUV'], fuelTypes: ['PETROL', 'DIESEL', 'CNG'], duration: 30, isActive: true },
      { id: '2', name: 'Flat Tire Change', category: 'ROADSIDE_ASSISTANCE', basePrice: 799, vehicleCategories: ['CAR', 'SUV'], fuelTypes: ['PETROL', 'DIESEL'], duration: 45, isActive: true },
      { id: '3', name: 'Fuel Delivery', category: 'FUEL_ASSISTANCE', basePrice: 299, vehicleCategories: ['CAR', 'SUV', 'TWO_WHEELER'], fuelTypes: ['PETROL', 'DIESEL'], duration: 40, isActive: true },
      { id: '4', name: 'Vehicle Towing', category: 'TOWING', basePrice: 1299, vehicleCategories: ['CAR', 'SUV', 'COMMERCIAL'], fuelTypes: ['PETROL', 'DIESEL', 'CNG', 'ELECTRIC'], duration: 60, isActive: true },
      { id: '5', name: 'Workshop Repair', category: 'WORKSHOP', basePrice: 2499, vehicleCategories: ['CAR', 'SUV', 'EV'], fuelTypes: ['PETROL', 'DIESEL', 'ELECTRIC'], duration: 120, isActive: false },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Service Catalog</h1>
          <p className="text-slate-400 mt-1">Manage available roadside assistance services</p>
        </div>
        <Link to="/admin/services/new">
          <Button size="lg"><Wrench className="w-4 h-4 mr-2" /> Add Service</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>{services.length} service(s) in catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-400 border-b border-slate-800">
                  <th className="pb-3 font-medium">Service Name</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Base Price</th>
                  <th className="pb-3 font-medium">Vehicle Types</th>
                  <th className="pb-3 font-medium">Duration</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 text-sm font-medium text-slate-100">{s.name}</td>
                    <td className="py-4 text-sm text-slate-400">{s.category.replace(/_/g, ' ')}</td>
                    <td className="py-4 text-sm text-slate-400 font-mono">₹{s.basePrice}</td>
                    <td className="py-4 text-sm text-slate-400">{s.vehicleCategories.join(', ')}</td>
                    <td className="py-4 text-sm text-slate-400">{s.duration} min</td>
                    <td className="py-4"><Badge variant={s.isActive ? 'success' : 'default'} size="sm">{s.isActive ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="py-4">
                      <Button variant="ghost" size="sm" className="p-2"><Wrench className="w-4 h-4" /></Button>
                    </td>
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

export function AdminAnalytics() {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    setChartData([
      { day: 'Mon', cases: 45, jobs: 38, revenue: 12500 },
      { day: 'Tue', cases: 52, jobs: 44, revenue: 15800 },
      { day: 'Wed', cases: 38, jobs: 32, revenue: 11200 },
      { day: 'Thu', cases: 61, jobs: 52, revenue: 18900 },
      { day: 'Fri', cases: 74, jobs: 65, revenue: 22400 },
      { day: 'Sat', cases: 88, jobs: 78, revenue: 26700 },
      { day: 'Sun', cases: 67, jobs: 58, revenue: 19800 },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
        <p className="text-slate-400 mt-1">Platform performance and insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cases Overview</CardTitle>
            <CardDescription>Weekly case volume</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <div className="flex items-end h-full gap-2 p-4">
              {chartData.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-2">
                  <div className={`h-[calc(100%-4rem)] w-full bg-indigo-500/20 rounded-t-md transition-all duration-300 group-hover:bg-indigo-500/40`} style={{ height: `${(d.cases / 88) * 100}%` }} />
                  <span className="text-xs text-slate-500">{d.day}</span>
                  <span className="text-xs font-medium text-slate-100">{d.cases}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Weekly revenue trend</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <div className="flex items-end h-full gap-2 p-4">
              {chartData.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-2">
                  <div className={`h-[calc(100%-4rem)] w-full bg-green-500/20 rounded-t-md transition-all duration-300 group-hover:bg-green-500/40`} style={{ height: `${(d.revenue / 26700) * 100}%` }} />
                  <span className="text-xs text-slate-500">{d.day}</span>
                  <span className="text-xs font-medium text-slate-100">₹{d.revenue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-400">Total Cases (7 days)</p>
            <p className="text-3xl font-bold text-slate-100">{chartData.reduce((sum, d) => sum + d.cases, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-400">Total Jobs (7 days)</p>
            <p className="text-3xl font-bold text-slate-100">{chartData.reduce((sum, d) => sum + d.jobs, 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-400">Total Revenue (7 days)</p>
            <p className="text-3xl font-bold text-slate-100">₹{chartData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}