import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Shield, Building2, Calendar, Clock, CheckCircle } from 'lucide-react';

export default function CMOProfile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[#0f2b48]">CMO Administrator Profile</h1>
        <p className="text-sm text-slate-600 mt-1">
          Chief Minister's Public Grievance Redressal Secretariat executive credential.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-[#0a192f] via-[#0f2b48] to-[#0d9488] p-6 flex items-end">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg translate-y-8 flex items-center justify-center text-[#0f2b48] font-bold text-2xl border-2 border-white">
            <Shield className="w-8 h-8 text-[#0d9488]" />
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
              Verified CMO Secretariat Executive
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                Administrative Cell
              </div>
              <div className="text-sm font-semibold text-slate-800">
                Chief Minister's Public Grievance Redressal Cell (Secretariat)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-teal-600" />
                System Clearance
              </div>
              <div className="text-sm font-semibold text-slate-800 font-mono">
                CMO_ADMIN (Tier 1 State Surveillance)
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
                Secretariat Email
              </div>
              <div className="text-sm font-semibold text-slate-800">{user?.email || 'N/A'}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                Secretariat Intercom / Contact
              </div>
              <div className="text-sm font-semibold text-slate-800">{user?.mobile_number || 'Secretariat Desk 1076'}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                Jurisdiction Mandate
              </div>
              <div className="text-sm font-semibold text-emerald-700">Four-Eyes Verification & Statewide Allocation</div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900 leading-relaxed">
            <span className="font-bold">CMO Oversight Charter: </span>
            The Chief Minister's Office holds exclusive authority over department allocation, SLA escalation enforcement, and final approval of Action Taken Reports (ATRs) for public grievances.
          </div>
        </div>
      </div>
    </div>
  );
}

