import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Tractor, 
  Wheat, 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  initialRole = 'farmer'
}) => {
  const { 
    loginWithEmail, 
    registerWithEmail, 
    loginAsDemo, 
    signInWithGoogle 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const emailInput = email.trim() || 'farmer@agriride.farm';
      const passwordInput = password || 'password123';

      if (mode === 'login') {
        await loginWithEmail(emailInput, passwordInput);
      } else {
        await registerWithEmail({
          email: emailInput,
          password: passwordInput,
          displayName: displayName.trim() || emailInput.split('@')[0],
          role: selectedRole,
          phone: phone.trim() || '+91 98765 00000',
          village: village.trim() || 'Central Tehsil',
          district: district.trim() || 'Agriland',
        });
      }
      onClose();
    } catch (err: any) {
      console.error('Auth error', err);
      const msg = err.message || 'Authentication encountered an issue. Please try Google Sign-In or Demo login.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle(selectedRole);
      onClose();
    } catch (err: any) {
      console.error('Google Sign In error', err);
      setError(err.message || 'Google sign-in failed. Please try again or use the demo login.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (role: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      await loginAsDemo(role);
      onClose();
    } catch (err: any) {
      console.error('Demo auth error', err);
      setError(err.message || 'Demo sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {mode === 'login' ? 'Sign In to AgriRide' : 'Create an AgriRide Account'}
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                {mode === 'login' 
                  ? 'Access your equipment rentals & machinery listings' 
                  : 'Join the community of farmers and machinery owners'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
            aria-label="Close auth modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Login / Register */}
        <div className="grid grid-cols-2 p-1.5 bg-stone-100 border-b border-stone-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Register New Account
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Role selector for Google or Registration */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              Choose Your Role:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('farmer')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  selectedRole === 'farmer'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Tractor className="w-4 h-4 text-emerald-700" />
                  <span>Farmer</span>
                </div>
                <p className="text-[11px] text-stone-500 font-normal leading-tight">
                  Rent farm machinery
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('owner')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  selectedRole === 'owner'
                    ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold ring-1 ring-amber-600'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Wheat className="w-4 h-4 text-amber-700" />
                  <span>Equipment Owner</span>
                </div>
                <p className="text-[11px] text-stone-500 font-normal leading-tight">
                  Rent out machinery
                </p>
              </button>
            </div>
          </div>

          {/* Primary Action: Google Sign In */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded-lg text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google as {selectedRole === 'farmer' ? 'Farmer' : 'Equipment Owner'}</span>
          </button>

          {/* Quick Demo Sign-In Buttons */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
            <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Or 1-Click Instant Demo Login:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDemoSignIn('farmer')}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-left text-xs transition-colors flex flex-col justify-between cursor-pointer"
              >
                <div className="font-bold text-emerald-900 flex items-center gap-1">
                  <Tractor className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Farmer</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium mt-0.5">Ramesh Patel</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleDemoSignIn('owner')}
                className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-left text-xs transition-colors flex flex-col justify-between cursor-pointer"
              >
                <div className="font-bold text-amber-900 flex items-center gap-1">
                  <Wheat className="w-3.5 h-3.5 text-amber-700" />
                  <span>Equipment Owner</span>
                </div>
                <span className="text-[11px] text-amber-700 font-medium mt-0.5">Harpreet Brar</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-3 text-[11px] text-stone-400 font-medium">
              or continue with email & password
            </span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name field (Register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Location & Phone (Register only) */}
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Village / District
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Rampur, Sangrur"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
                  />
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs text-white transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                loading
                  ? 'bg-stone-400 cursor-not-allowed'
                  : selectedRole === 'farmer' || mode === 'login'
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {loading ? (
                <span>Please wait...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In with Email</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Register with Email as {selectedRole === 'farmer' ? 'Farmer' : 'Equipment Owner'}</span>
                  <Check className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Database note */}
          <div className="pt-2 flex items-center gap-2 text-[11px] text-stone-500 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Role stored securely in Firebase Firestore</span>
          </div>
        </div>
      </div>
    </div>
  );
};
