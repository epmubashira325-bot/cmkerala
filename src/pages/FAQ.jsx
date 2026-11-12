import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How do I lodge a grievance on the CM Kerala Redressal Portal?',
      a: 'Citizens can register an account using a valid email and mobile number, navigate to the citizen dashboard, fill in the complaint details including district and incident address, attach supporting documents or photographs, and submit. The system will instantly issue a unique tracking reference number (e.g., CMK-2026-ABC123).'
    },
    {
      q: 'Can I track a complaint without logging into the portal?',
      a: 'Yes. Anyone possessing a valid reference number can use the public "Track Grievance" page without signing in. The tracking service displays current status, priority level, administrative milestones, and expected SLA due date while protecting sensitive personal details.'
    },
    {
      q: 'How does Google Gemini AI assist in the grievance handling process?',
      a: 'When a citizen drafts a grievance, our integrated Google Gemini 3.6 Flash engine analyzes the summary text in real-time. It extracts key incident entities, predicts the relevant government department (such as Revenue, Health, or Local Self Government), and flags urgent or critical priorities. This accelerates administrative sorting, though final assignment is always validated by human CMO officers.'
    },
    {
      q: 'What is the standard turnaround time (SLA) for resolving a complaint?',
      a: 'Turnaround times vary based on grievance urgency and category. High and Critical priority matters (e.g., public safety hazards, disaster relief, acute medical assistance) have accelerated SLAs ranging from 48 to 96 hours. General administrative matters typically adhere to a 15 to 30-day resolution guideline.'
    },
    {
      q: 'What happens if I am not satisfied with the Action Taken Report (ATR)?',
      a: 'If a grievance is marked resolved but the ground issue persists, citizens can submit a feedback rating with remarks or request an appeal through the portal. The Chief Minister\'s Grievance Cell regularly audits low-satisfaction closures for re-investigation.'
    },
    {
      q: 'Can public registration create Officer or CMO Admin accounts?',
      a: 'No. The portal strictly enforces role-based access control. Public registration can only create Citizen accounts. Officer accounts (assigned to specific departments) and CMO Admin accounts can only be provisioned by designated secretariat system administrators.'
    },
    {
      q: 'What formats are supported for document and photo attachments?',
      a: 'You can upload PDF documents, scanned copies, and images (JPEG, PNG). All files are scanned for safety and encrypted in storage.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
            Assistance & FAQs
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f2b48] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-slate-600 leading-relaxed text-base">
            Find immediate answers regarding grievance submission, tracking protocols, AI assistance, and resolution SLAs.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-semibold text-slate-800 text-base md:text-lg flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#0d9488] shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-[#0d9488]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0d9488] flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#0f2b48]">Still have questions?</h4>
              <p className="text-slate-600 text-sm">
                Get in touch directly with the Secretariat Grievance Redressal desk.
              </p>
            </div>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0f2b48] text-white text-sm font-medium rounded-xl hover:bg-[#1b3d63] transition-colors shrink-0"
          >
            Contact Secretariat <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

