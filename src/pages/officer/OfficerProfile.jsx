import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Shield, Building2, Calendar, Clock, CheckCircle } from 'lucide-react';

export default function OfficerProfile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[#0f2b48]">Department Officer Profile</h1>
        <p className="text-sm text-slate-600 mt-1">
          Government civil officer credentials provisioned for grievance investigation and resolution.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-[#0a192f] to-[#0f2b48] p-6 flex items-end">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg translate-y-8 flex items-center justify-center text-[#0f2b48] font-bold text-2xl border-2 border-white">
            <Building2 className="w-8 h-8 text-[#0d9488]" />
          </div>
        </div>

        <div className="pt-12 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-[#0f2b48]">{user?.full_name}</h2>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-center">
              <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
              Verified Department Officer
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                Assigned Department
              </div>
              <div className="text-sm font-semibold text-slate-800">
                {user?.department_name || 'Revenue & Land Records'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-teal-600" />
                Department Code
              </div>
              <div className="text-sm font-semibold text-slate-800 font-mono">
                {user?.department_code || 'DEPT'}
              </div>
            </div>

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
                Official Email
              </div>
              <div className="text-sm font-semibold text-slate-800">{user?.email || 'N/A'}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                Contact Mobile
              </div>
              <div className="text-sm font-semibold text-slate-800">{user?.mobile_number || 'Official Desk Line'}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                Portal Role Level
              </div>
              <div className="text-sm font-semibold text-emerald-700">FIELD_OFFICER (Assigned)</div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 leading-relaxed">
            <span className="font-bold">Administrative Rule Notice: </span>
            Department officers can record investigation notes and file Action Taken Reports (ATRs) for assigned cases. Official resolution closure is subject to verification by the Chief Minister's Office.
          </div>
        </div>
      </div>
    </div>
  );
}

