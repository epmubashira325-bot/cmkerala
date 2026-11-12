import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Shield, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[#0f2b48]">Citizen Profile</h1>
        <p className="text-sm text-slate-600 mt-1">
          Your verified citizen identity registered with the Chief Minister's Public Grievance Redressal Portal.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-[#0f2b48] to-[#1b3d63] p-6 flex items-end">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg translate-y-8 flex items-center justify-center text-[#0f2b48] font-bold text-2xl border-2 border-white">
            {user?.full_name?.charAt(0) || 'C'}
          </div>
        </div>

        <div className="pt-12 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-[#0f2b48]">{user?.full_name}</h2>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-center">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified Citizen Account
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-teal-600" />
                Full Legal Name
              </div>
              <div className="text-sm font-semibold text-slate-800">{user?.full_name || 'N/A'}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                Email Address
              </div>
              <div className="text-sm font-semibold text-slate-800">{user?.email || 'N/A'}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                Mobile Number
              </div>
              <div className="text-sm font-semibold text-slate-800">{user?.mobile_number || 'Not provided'}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-teal-600" />
                System Role & Permissions
              </div>
              <div className="text-sm font-semibold text-slate-800">{user?.role || 'CITIZEN'}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                Account Created Date
              </div>
              <div className="text-sm font-semibold text-slate-800">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }) : 'N/A'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                Portal Access Status
              </div>
              <div className="text-sm font-semibold text-emerald-700">Active & Enrolled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
