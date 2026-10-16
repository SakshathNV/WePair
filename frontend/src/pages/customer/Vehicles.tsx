import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Truck, Edit, Trash2, Shield, Zap, Fuel, Car, Bike } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Feedback';
import { getVehicleCategoryLabel, getFuelTypeLabel } from '../../utils/helpers';
import type { Vehicle } from '../../types';

const vehicleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  CAR: Car,
  SUV: Car,
  TWO_WHEELER: Bike,
  EV: Zap,
  COMMERCIAL: Truck,
};

const fuelIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  PETROL: Fuel,
  DIESEL: Fuel,
  CNG: Fuel,
  ELECTRIC: Zap,
  HYBRID: Zap,
};

export function CustomerVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For now using mock data since we don't have the vehicles endpoint yet
    setVehicles([
      {
        id: '1',
        userId: '1',
        category: 'CAR',
        make: 'Maruti Suzuki',
        model: 'Swift',
        year: 2022,
        licensePlate: 'MH12 AB 1234',
        fuelType: 'PETROL',
        color: 'Red',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: '1',
        category: 'TWO_WHEELER',
        make: 'Honda',
        model: 'Activa',
        year: 2021,
        licensePlate: 'MH12 CD 5678',
        fuelType: 'PETROL',
        color: 'Blue',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">My Vehicles</h1>
          <p className="text-slate-400 mt-1">Manage your registered vehicles for faster assistance</p>
        </div>
        <Link to="/vehicles/new">
          <Button size="lg"><Plus className="w-5 h-5 mr-2" /> Add Vehicle</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Vehicles</CardTitle>
          <CardDescription>{vehicles.length} vehicle(s) registered</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12">
              <Car className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-300">No vehicles registered</h3>
              <p className="text-slate-500 mt-1">Add your vehicles to request assistance faster</p>
              <Link to="/vehicles/new" className="mt-4 inline-block">
                <Button><Plus className="w-4 h-4 mr-2" /> Add Your First Vehicle</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((vehicle) => {
                const VehicleIcon = vehicleIcons[vehicle.category] || Car;
                const FuelIcon = fuelIcons[vehicle.fuelType] || Fuel;
                return (
                  <div key={vehicle.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <VehicleIcon className="w-10 h-10 text-indigo-400 mb-3" />
                        <h3 className="font-medium text-slate-100">{vehicle.make} {vehicle.model}</h3>
                        <p className="text-sm text-slate-400">{vehicle.year} • {vehicle.color || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">{getVehicleCategoryLabel(vehicle.category)}</Badge>
                        <div className="flex items-center justify-end gap-1 text-xs text-slate-400">
                          <FuelIcon className="w-3 h-3" />
                          <span>{getFuelTypeLabel(vehicle.fuelType)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-slate-500" />
                        <span className="font-mono text-slate-300">{vehicle.licensePlate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/vehicles/${vehicle.id}/edit`}>
                          <Button variant="ghost" size="sm" className="p-2"><Edit className="w-4 h-4" /></Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}