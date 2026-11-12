import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      // Role-based redirection
      if (user.role === 'OFFICER') {
        const from = location.state?.from?.pathname?.startsWith('/officer')
          ? location.state.from.pathname
          : '/officer/dashboard';
        navigate(from, { replace: true });
      } else if (user.role === 'CMO_ADMIN') {
        const from = location.state?.from?.pathname?.startsWith('/cmo')
          ? location.state.from.pathname
          : '/cmo/dashboard';
        navigate(from, { replace: true });
      } else {
        // Default: CITIZEN
        const from = location.state?.from?.pathname?.startsWith('/citizen')
          ? location.state.from.pathname
          : '/citizen/dashboard';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0f2b48] text-teal-400 mb-4 shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#0f2b48]">Portal Sign In</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your designated portal (Citizen, Department Officer, or CMO Secretariat).
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Registered Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium bg-[#0f2b48] hover:bg-[#1b3d63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f2b48] transition-all shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>Signing in...</>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Sign In to Portal
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              New citizen user?{' '}
              <Link to="/register" className="font-semibold text-[#0d9488] hover:text-teal-700 inline-flex items-center gap-1">
                Register as a Citizen <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Official Government of Kerala Public Service Portal. Department Officer accounts are provisioned via Department Administrative Cells.
        </p>
      </div>
    </div>
  );
}
