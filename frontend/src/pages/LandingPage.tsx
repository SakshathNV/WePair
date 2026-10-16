import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../utils/helpers';
import { Truck, Wrench, MapPin, Shield, Clock, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleRequestAssistance = () => {
    if (isAuthenticated) {
      navigate('/cases/new');
    } else {
      navigate('/login');
    }
  };
  const features = [
    {
      icon: Truck,
      title: '24/7 Roadside Assistance',
      description: 'Get help anytime, anywhere with our network of verified service providers.',
    },
    {
      icon: Wrench,
      title: 'Quick Service Dispatch',
      description: 'Fast matching with the nearest available provider for your vehicle type.',
    },
    {
      icon: MapPin,
      title: 'Real-Time Tracking',
      description: 'Track your service provider on a map as they head to your location.',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Cashless transactions with Razorpay integration. Pay only for what you use.',
    },
    {
      icon: Clock,
      title: 'OTP Verification',
      description: 'Secure job confirmation with one-time passwords for service verification.',
    },
    {
      icon: Users,
      title: 'Multi-Role Platform',
      description: 'Customers, service providers, and admins all on one integrated platform.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="fixed top-0 left-0 right-0 z-40 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
              W
            </span>
            <span className="text-xl font-bold tracking-tight text-white">
              We<span className="text-indigo-400">Pair</span>
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition-all duration-200">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
              Automobile Public Service System
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight mb-6">
              Seamless roadside dispatch,{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                powered by WePair
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Get fast, reliable roadside assistance for your vehicle. Connect with verified service providers in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-lg shadow-indigo-600/30 transition-all duration-200">
                Request Assistance
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-lg transition-all duration-200">
                How It Works
              </a>
            </div>
          </div>

          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-none" />
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { icon: MapPin, label: 'Pickup Location', color: 'text-indigo-400', value: 'Add your vehicle location' },
                { icon: Wrench, label: 'Select Service', color: 'text-purple-400', value: 'Choose assistance type' },
                { icon: Truck, label: 'Provider Match', color: 'text-blue-400', value: 'Nearest provider assigned' },
              ].map((step) => (
                <div key={step.label} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <div className={`w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center mb-4 ${step.color}`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-100">{step.label}</h3>
                  <p className="text-sm text-slate-500 mt-1">{step.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 -z-10">
          <div className="top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20" />
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Why Choose WePair</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need for reliable roadside assistance</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-100 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">From breakdown to resolution in four simple steps</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2">
              <div className="relative h-64 mx-auto">
                <div className="absolute inset-0 bg-slate-900/50 rounded-2xl border border-slate-800" />
                <div className="absolute inset-4 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl blur opacity-20" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
                  <Truck className="w-16 h-16 text-indigo-400 mb-6" />
                  <h3 className="text-xl font-bold text-slate-100 mb-2">Request Help</h3>
                  <p className="text-slate-400 text-sm">Open the app and request roadside assistance with your vehicle details.</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative h-64 mx-auto">
                <div className="absolute inset-0 bg-slate-900/50 rounded-2xl border border-slate-800" />
                <div className="absolute inset-4 bg-gradient-to-tr from-green-500 to-emerald-500 rounded-2xl blur opacity-20" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
                  <Shield className="w-16 h-16 text-green-400 mb-6" />
                  <h3 className="text-xl font-bold text-slate-100 mb-2">Provider Assigned</h3>
                  <p className="text-slate-400 text-sm">We match you with the nearest verified service provider.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Transparent Pricing</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">No hidden fees. Pay only for the services you use.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Roadside Assistance', price: '₹499', desc: 'Jump start, tire change, fuel delivery', popular: false },
              { name: 'Towing Service', price: '₹1,299', desc: 'Flatbed towing up to 50km', popular: true },
              { name: 'Workshop Repair', price: '₹2,499', desc: 'On-site or workshop repairs', popular: false },
            ].map((plan) => (
              <div key={plan.name} className={cn(
                'p-6 rounded-2xl border transition-all duration-300 flex flex-col',
                plan.popular ? 'bg-indigo-500/10 border-indigo-500/50 shadow-xl shadow-indigo-500/20' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              )}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-500 text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="font-bold text-slate-100 text-lg mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-slate-100 mb-3">{plan.price}</div>
                <p className="text-sm text-slate-400 mb-6 flex-1">{plan.desc}</p>
                <Link to="/register" className={cn(
                  'w-full py-3 rounded-xl font-medium transition-all duration-200 text-center',
                  plan.popular ? 'bg-indigo-500 text-white hover:bg-indigo-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                )}>
                  Get Quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white">
              W
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              We<span className="text-indigo-400">Pair</span>
            </span>
          </div>
          <p className="text-sm text-slate-500">
            WePair Automobile Public Service System. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="text-sm text-slate-400 hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}