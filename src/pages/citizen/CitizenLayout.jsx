import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FilePlus,
  ListFilter,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  ExternalLink,
  ChevronRight,
  Bell
} from 'lucide-react';

export default function CitizenLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { label: 'Dashboard', to: '/citizen/dashboard', icon: LayoutDashboard },
    { label: 'Submit Grievance', to: '/citizen/submit', icon: FilePlus },
    { label: 'My Grievances', to: '/citizen/grievances', icon: ListFilter },
    { label: 'My Profile', to: '/citizen/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0f2b48] text-white shrink-0 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-700/60">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-lg">
              CM
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-white leading-tight">
                CM KERALA
              </div>
              <div className="text-[10px] text-teal-400 font-medium uppercase tracking-wider">
                Citizen Desk
              </div>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className="px-5 py-4 bg-slate-800/40 border-b border-slate-700/60">
          <div className="text-xs text-slate-400 font-medium">Logged in Citizen</div>
          <div className="text-sm font-bold text-white truncate">{user?.full_name || 'Citizen'}</div>
          <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#0d9488] text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Public Portal Link & Logout */}
        <div className="p-4 border-t border-slate-700/60 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-teal-400" /> Public Portal Home
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#0f2b48] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-700">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
            CM
          </div>
          <span className="font-bold text-sm tracking-tight">Citizen Desk</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f2b48] border-b border-slate-700 px-4 py-3 space-y-1">
          <div className="pb-3 mb-2 border-b border-slate-700/60">
            <div className="text-xs text-slate-400">Citizen</div>
            <div className="text-sm font-bold text-white">{user?.full_name}</div>
            <div className="text-xs text-slate-400">{user?.email}</div>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive ? 'bg-[#0d9488] text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          <div className="pt-2 border-t border-slate-700">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-950/40"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-4 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Shield className="w-4 h-4 text-[#0d9488]" />
            <span>Government of Kerala • Chief Minister's Public Grievance Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-800">{user?.full_name}</div>
              <div className="text-[11px] text-emerald-600 font-semibold">Active Session</div>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

