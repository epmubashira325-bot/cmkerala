import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  ShieldAlert, 
  HeartHandshake, 
  Award 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b1e33] text-slate-300 border-t border-slate-800">
      
      {/* Prototype / Academic Disclaimer Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-3.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold text-amber-300">Recruitment Prototype & Engineering Demonstration:</span>
          <span>
            This portal is an advanced demonstration build showcasing Django REST Framework, PostgreSQL, and Gemini AI. Not affiliated with actual Government of Kerala departments.
          </span>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Identity & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">CM KERALA</span>
                <p className="text-xs text-slate-400 font-medium">Public Grievance Cell</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering citizens of Kerala through swift, transparent, and technology-driven grievance redressal with AI-assisted department dispatch.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Award className="w-4 h-4 text-teal-400" />
              <span>Digital Governance Initiative</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Portal Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-teal-400 transition-colors">Track Complaint Status</Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-teal-400 transition-colors">Participating Departments</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-teal-400 transition-colors">How It Works (Workflow)</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">About CMO Redressal</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-teal-400 transition-colors">Frequently Asked Questions</Link>
              </li>
            </ul>
          </div>

          {/* Participating Sectors */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Key Portfolios</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Revenue & Land Administration</li>
              <li>Public Works (Roads & Bridges)</li>
              <li>Health & Family Welfare</li>
              <li>Local Self Government (Panchayats)</li>
              <li>Water Resources & Irrigation</li>
              <li>Civil Supplies & Consumer Welfare</li>
            </ul>
          </div>

          {/* Official Helpline Contacts */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">CMO Helpdesk</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Government Secretariat, Thiruvananthapuram, Kerala – 695001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>1076 (Toll-Free Helpline)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>chiefminister@kerala.gov.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Legal */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Government of Kerala. CM Public Grievance Redressal System.</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="/how-it-works" className="hover:text-slate-300">Terms of Charter</Link>
            <Link to="/contact" className="hover:text-slate-300">Nodal Contacts</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

