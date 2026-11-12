import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Inbox,
  FileSearch,
  Clock,
  FileCheck2,
  Building2,
  UserCheck,
  LogOut,
  Menu,
  X,
  Shield,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export default function CMOLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { label: 'Executive Overview', to: '/cmo/dashboard', icon: LayoutDashboard },
    { label: 'All Grievances', to: '/cmo/grievances', icon: Inbox },
    { label: 'New Submissions', to: '/cmo/grievances?status=SUBMITTED', icon: FileSearch },
    { label: 'Under Review Queue', to: '/cmo/grievances?status=UNDER_REVIEW', icon: Clock },
    { label: 'Action Taken Reports', to: '/cmo/reports', icon: FileCheck2 },
    { label: 'Departments', to: '/cmo/departments', icon: Building2 },
    { label: 'CMO Profile', to: '/cmo/profile', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0a192f] text-white shrink-0 select-none border-r border-slate-800">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0d9488] to-teal-400 text-[#0a192f] flex items-center justify-center font-black text-lg shadow-md">
              CMO
            </div>
            <div>
              <div className="font-black text-sm tracking-tight text-white leading-tight">
                CM KERALA
              </div>
              <div className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">
                Secretariat Desk
              </div>
            </div>
          </Link>
        </div>

        {/* CMO User Card */}
        <div className="px-5 py-4 bg-slate-900/60 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
              CMO Administrator
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-sm font-bold text-white truncate mt-0.5">{user?.full_name || 'CMO Secretariat'}</div>
          <div className="text-[11px] text-slate-400 truncate mt-0.5">
            {user?.email}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/cmo/dashboard' || item.to === '/cmo/departments' || item.to === '/cmo/profile'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#0d9488] text-white shadow-sm font-semibold'
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
        <div className="p-4 border-t border-slate-800 space-y-2">
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
      <div className="md:hidden bg-[#0a192f] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0d9488] text-[#0a192f] flex items-center justify-center font-black text-xs">
            CMO
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight block">CMO Secretariat</span>
            <span className="text-[10px] text-teal-400">Chief Minister's Redressal Cell</span>
          </div>
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
        <div className="md:hidden bg-[#0a192f] border-b border-slate-800 px-4 py-3 space-y-1">
          <div className="pb-3 mb-2 border-b border-slate-800">
            <div className="text-xs text-teal-400 font-bold">CMO Administrator</div>
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
          <div className="pt-2 border-t border-slate-800">
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
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <Shield className="w-4 h-4 text-[#0d9488]" />
            <span className="font-bold text-[#0f2b48]">Chief Minister's Office Grievance Oversight Console</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Four-Eyes Verification Cell</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-800">{user?.full_name}</div>
              <div className="text-[11px] text-teal-600 font-semibold">CMO_ADMIN</div>
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

