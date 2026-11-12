import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  User, 
  LogIn,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Track Grievance', path: '/track' },
    { name: 'Departments', path: '/departments' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Kerala Gov Identity Bar */}
      <div className="bg-[#0f2b48] text-white text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wide">GOVERNMENT OF KERALA</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300 hidden sm:inline">Chief Minister's Public Grievance Redressal Cell</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden md:inline">Toll Free Helpdesk: <strong className="text-white">1076</strong></span>
            <span className="bg-emerald-600/30 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-500/30">
              Live Portal
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Portal Identity */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0f2b48] to-[#0d9488] flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-[#0f2b48]">CM KERALA</span>
                <span className="text-xs font-semibold uppercase px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  PGRS
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Public Grievance Redressal System</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-slate-100 text-[#0f2b48] font-semibold'
                    : 'text-slate-600 hover:text-[#0f2b48] hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons: Sign In / Citizen Portal & Track */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/track"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              <Search className="w-3.5 h-3.5 text-teal-600" />
              <span>Track</span>
            </Link>

            {isAuthenticated ? (
              <Link
                to="/citizen/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#0d9488] hover:bg-teal-700 shadow-xs transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Citizen Desk</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#0f2b48] hover:bg-slate-100 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0f2b48] hover:bg-[#1b3d63] shadow-xs transition-all"
                >
                  <User className="w-3.5 h-3.5 text-teal-300" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'bg-slate-100 text-[#0f2b48] font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 space-y-2">
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              <Search className="w-4 h-4 text-teal-600" />
              Track Grievance Status
            </Link>
            {isAuthenticated ? (
              <Link
                to="/citizen/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#0d9488]"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Citizen Dashboard
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 border border-slate-300"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#0f2b48]"
                >
                  <User className="w-4 h-4" /> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
