import React from 'react';
import { 
  FileEdit, 
  Sparkles, 
  UserCheck, 
  Search, 
  FileCheck2, 
  CheckCircle, 
  Star, 
  ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Citizen Grievance Submission',
      desc: 'Citizen submits a detailed complaint online with supporting evidence, district details, and specific incident description.',
      icon: FileEdit,
      tag: 'Citizen Action',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      step: '02',
      title: 'Gemini AI Intelligent Triage',
      desc: 'Google Gemini 3.6 Flash analyzes the complaint text in real-time, extracts keywords, normalizes urgency priority, and recommends the appropriate ministry/department.',
      icon: Sparkles,
      tag: 'AI Assistance',
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      step: '03',
      title: 'CMO Allocation & Validation',
      desc: 'CMO Administrators review the AI suggestions, confirm or refine jurisdictional department assignment, and route it to authorized field officers.',
      icon: UserCheck,
      tag: 'Administrative Review',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      step: '04',
      title: 'Field Investigation & Progress Updates',
      desc: 'Designated department officers conduct on-the-ground verifications, coordinate with taluk/village offices, and post regular status updates.',
      icon: Search,
      tag: 'Field Operations',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      step: '05',
      title: 'Action Taken Report (ATR) Filing',
      desc: 'The department officer submits a comprehensive Action Taken Report detailing rectification steps taken, remediation dates, and conclusive proof.',
      icon: FileCheck2,
      tag: 'Redressal Outcome',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      step: '06',
      title: 'CMO Four-Eyes Resolution Approval',
      desc: 'CMO oversight verifies the ATR for genuine compliance. If satisfied, the grievance status transitions to RESOLVED; otherwise, it is returned for further action.',
      icon: CheckCircle,
      tag: 'Final Clearance',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      step: '07',
      title: 'Citizen Verification & Satisfaction Rating',
      desc: 'Citizen receives SMS/Portal notifications, inspects the outcome, and submits a 1-to-5 star satisfaction feedback rating.',
      icon: Star,
      tag: 'Citizen Feedback',
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
            Lifecycle & Process
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f2b48] tracking-tight">
            How Grievance Redressal Works
          </h1>
          <p className="mt-4 text-slate-600 leading-relaxed text-base md:text-lg">
            A transparent 7-stage workflow ensuring maximum accountability, AI-assisted speed,
            and strict four-eyes verification before any grievance is closed.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative mb-16">
          <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-slate-200 -translate-x-1/2" />
          
          <div className="space-y-8">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              const isEven = idx % 2 === 0;

              return (
                <div key={item.step} className="relative flex flex-col lg:flex-row items-center">
                  <div className={`w-full lg:w-1/2 ${isEven ? 'lg:pr-12 lg:text-right' : 'lg:order-2 lg:pl-12 lg:text-left'}`}>
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-slate-300 transition-all">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${item.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {item.tag}
                      </div>
                      <h3 className="text-xl font-bold text-[#0f2b48] mb-2">
                        <span className="text-[#0d9488] font-mono mr-2">{item.step}.</span>
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-[#0d9488] items-center justify-center font-mono font-bold text-xs text-[#0f2b48] shadow-sm z-10">
                    {item.step}
                  </div>

                  <div className={`hidden lg:block w-1/2 ${isEven ? 'order-2' : 'order-1'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 text-center max-w-3xl mx-auto shadow-sm">
          <h3 className="text-2xl font-bold text-[#0f2b48] mb-3">
            Have an existing complaint reference?
          </h3>
          <p className="text-slate-600 text-sm mb-6">
            Track real-time updates and view assigned departments and milestone transitions instantly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/track"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d9488] text-white font-medium rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
            >
              Track Your Grievance <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/departments"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
            >
              Explore Departments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

