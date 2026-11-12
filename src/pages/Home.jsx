import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Award,
  Users2,
  FileCheck
} from 'lucide-react';

export default function Home() {
  const portalFeatures = [
    {
      icon: Sparkles,
      title: 'Google Gemini AI Triage',
      description: 'Intelligent natural language classification recommending appropriate government departments, categories, and priority scores.',
    },
    {
      icon: ShieldCheck,
      title: 'Four-Eyes ATR Oversight',
      description: 'Strict administrative checks prevent field officers from self-approving Action Taken Reports; approval is held by CMO executives.',
    },
    {
      icon: Clock,
      title: 'Real-time Citizen Tracking',
      description: 'Transparent grievance tracking with reference numbers without exposing personal citizen credentials.',
    },
    {
      icon: CheckCircle2,
      title: 'Post-Resolution Feedback',
      description: 'Citizen satisfaction ratings between 1 and 5 stars with remarks enabled exclusively after verified grievance resolution.',
    },
  ];

  const highlights = [
    { label: 'Kerala Districts Covered', value: '14 Districts' },
    { label: 'Average Response Time', value: '48 Hours' },
    { label: 'Triage Accuracy Target', value: '98.5%' },
    { label: 'Resolution Oversight', value: 'CMO Direct' },
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f2b48] via-[#13385e] to-[#0f2b48] text-white pt-16 pb-24 px-4 sm:px-8">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-semibold tracking-wide uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>Official Redressal Architecture • Government of Kerala</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Direct, Transparent Redressal from the <span className="text-teal-400">Chief Minister’s Office</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            A state-of-the-art public grievance portal connecting citizens across Kerala’s 14 districts to all government departments with AI-assisted triage and verified officer accountability.
          </p>

          {/* Call to Actions */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/track"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-900/30 transition-all hover:scale-[1.02]"
            >
              <Search className="w-5 h-5" />
              <span>Track Existing Grievance</span>
            </Link>

            <Link
              to="/how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-xs transition-all"
            >
              <span>Learn How It Works</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="max-w-6xl mx-auto mt-16 pt-10 border-t border-slate-700/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {highlights.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl sm:text-3xl font-bold text-teal-400 tracking-tight">{item.value}</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Tracking Search Card */}
      <section className="max-w-4xl mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/80 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#0f2b48]">Fast Grievance Status Search</h2>
              <p className="text-sm text-slate-500">Enter your assigned human-readable reference number (e.g. CMK-20261112-XXXXXXXX)</p>
            </div>
            <Link
              to="/track"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Detailed Tracking View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.refNumber.value.trim();
              if (input) {
                window.location.href = `/track?ref=${encodeURIComponent(input)}`;
              }
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="refNumber"
                placeholder="Enter Complaint Reference Number..."
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#0f2b48] hover:bg-[#1b3d63] text-white font-semibold text-sm rounded-xl transition-colors shadow-xs"
            >
              Search Status
            </button>
          </form>
        </div>
      </section>

      {/* Key Architectural Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-md border border-teal-200">
            Engineered For Kerala Citizens
          </span>
          <h2 className="text-3xl font-extrabold text-[#0f2b48] tracking-tight">
            Transparent, Multilevel Public Grievance Resolution
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Combining robust Django REST service architecture with modern responsive UI and Gemini natural language intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portalFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#0f2b48]">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Direct Department Directory Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-[#0f2b48] to-slate-900 text-white rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              Explore Active Kerala Government Departments
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Find jurisdictional contacts, nodal officer affiliations, and open grievance metrics directly from the live PostgreSQL database.
            </p>
          </div>
          <Link
            to="/departments"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition-transform hover:scale-105"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}

