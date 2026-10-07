import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { UserAccount } from '../../types/cricket';
import { useToast } from '../ui/Toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [tab, setTab] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (tab === 'forgot') {
        showToast('Password Reset Sent', `Check inbox for ${email || 'your email'}.`, 'info');
        setTab('login');
        return;
      }

      const newUser: UserAccount = {
        id: `usr-${Date.now()}`,
        name: tab === 'signup' ? (name || 'Arijit Sinha') : 'Arijit Sinha',
        email: email || 'arijit.sinha@cricklytics.ai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        tier: 'Pro Athlete',
        isLoggedIn: true
      };

      onLoginSuccess(newUser);
      showToast(
        tab === 'signup' ? 'Account Created!' : 'Welcome back, Arijit!',
        'Your cricket performance dashboard is ready.',
        'success'
      );
      onClose();
    }, 600);
  };

  const handleDemoLogin = () => {
    const demoUser: UserAccount = {
      id: 'demo-user',
      name: 'Arijit Sinha',
      email: 'arijitsinha2003@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      tier: 'Pro Athlete',
      isLoggedIn: true
    };
    onLoginSuccess(demoUser);
    showToast('Demo Account Loaded', 'Viewing Arjun Sharma (Bengal Strikers) data.', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-xl">
            🏏
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Cricklytics <span className="text-emerald-400">AI</span></h3>
            <p className="text-xs text-slate-400">Sports Performance Intelligence</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-slate-950/60 p-1 border border-slate-800 mb-6">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'login' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'signup' ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="athlete@cricklytics.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-950/80 border border-slate-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {tab !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                {tab === 'login' && (
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
            ) : (
              <>
                <span>{tab === 'login' ? 'Sign In to Dashboard' : tab === 'signup' ? 'Create Pro Athlete Account' : 'Send Reset Link'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Instant Demo Account (1-Click)</span>
          </button>
          <p className="text-[11px] text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-400" /> Secure athlete telemetry & encrypted statistics.
          </p>
        </div>
      </div>
    </div>
  );
};
