import React from 'react';
import { ShieldCheck, Award, Eye, FileText, Cpu, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
            Public Redressal Charter
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f2b48] tracking-tight">
            About the Chief Minister's Public Grievance Redressal Cell
          </h1>
          <p className="mt-4 text-slate-600 leading-relaxed text-base md:text-lg">
            Dedicated to swift, transparent, and technology-empowered governance for the citizens of Kerala.
            The portal serves as a direct bridge between citizens and government departments under the direct oversight of the Chief Minister's Office.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-teal-50 text-[#0d9488] rounded-xl flex items-center justify-center mb-6">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#0f2b48] mb-3">Vision</h2>
            <p className="text-slate-600 leading-relaxed">
              To institutionalize an equitable, prompt, and accountable grievance redressal ecosystem across all
              14 districts of Kerala, ensuring that every citizen's voice is heard, analyzed objectively, and addressed
              with definitive administrative outcomes within time-bound SLAs.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-blue-50 text-[#0f2b48] rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#0f2b48] mb-3">Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              Leverage artificial intelligence and rigorous multi-tier bureaucratic governance to eliminate paperwork delays,
              automate department triage, prevent jurisdictional disputes, and provide citizens complete real-time transparency
              from submission through field inquiry to resolution.
            </p>
          </div>
        </div>

        {/* Core Administrative Pillars */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200 mb-16">
          <h2 className="text-2xl font-bold text-[#0f2b48] text-center mb-10">
            Core Pillars of Grievance Governance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-slate-100 rounded-xl p-6 bg-slate-50">
              <div className="text-[#0d9488] font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                Zero Administrative Drift
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Automated assignment and strict time-based Service Level Agreements (SLAs) ensure complaints do not stagnate between inter-departmental desks.
              </p>
            </div>

            <div className="border border-slate-100 rounded-xl p-6 bg-slate-50">
              <div className="text-[#0d9488] font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                Four-Eyes CMO Oversight
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Department officers cannot unilaterally close grievances. Every Action Taken Report (ATR) requires review and verification by the Chief Minister's Office.
              </p>
            </div>

            <div className="border border-slate-100 rounded-xl p-6 bg-slate-50">
              <div className="text-[#0d9488] font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                Algorithmic Integrity
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Google Gemini AI assists with classification and urgent priority detection, but administrative discretion remains firmly in the hands of authorized civil officers.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Architecture Overview */}
        <div className="bg-gradient-to-r from-[#0f2b48] to-[#1b3d63] rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-400/20 text-teal-300 text-xs font-semibold rounded-full uppercase tracking-wider mb-4 border border-teal-400/30">
              <Cpu className="w-3.5 h-3.5" /> Engineered for Resilience
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Enterprise Engineering & AI Integration</h2>
            <p className="text-slate-200 leading-relaxed mb-6">
              The platform is powered by a rock-solid Python 3.10 and Django 5.2 REST Framework backend on PostgreSQL 18,
              paired with Google Gemini 3.6 Flash structured JSON inference for grievance triage. The React frontend guarantees fast, accessible citizen interaction across all devices.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-600/50">
              <div>
                <div className="text-teal-300 font-bold text-lg">Django 5.2</div>
                <div className="text-xs text-slate-300">Robust REST APIs</div>
              </div>
              <div>
                <div className="text-teal-300 font-bold text-lg">PostgreSQL 18</div>
                <div className="text-xs text-slate-300">Relational DB with ACID</div>
              </div>
              <div>
                <div className="text-teal-300 font-bold text-lg">Gemini 3.6</div>
                <div className="text-xs text-slate-300">Intelligent Classification</div>
              </div>
              <div>
                <div className="text-teal-300 font-bold text-lg">React + Vite</div>
                <div className="text-xs text-slate-300">Responsive UI Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

