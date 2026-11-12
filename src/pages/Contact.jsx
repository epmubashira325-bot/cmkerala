import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Building2,
  Clock,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { contactAPI } from '../api/services';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await contactAPI.submitEnquiry(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to submit contact enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-md border border-teal-200">
          Citizen Helpdesk
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f2b48] tracking-tight">
          Contact the Chief Minister's Grievance Cell
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          For technical enquiries, portal feedback, or administrative support regarding your grievance submissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0f2b48] text-white rounded-2xl p-8 space-y-8 shadow-md">
            <div>
              <h2 className="text-xl font-bold mb-2">Central Secretariat Helpdesk</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Nodal officers are available during state government working hours to assist citizens with registration and escalation.
              </p>
            </div>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-teal-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Physical Secretariat Address</h3>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Chief Minister's Grievance Redressal Cell, 3rd Floor, North Block, Government Secretariat, Thiruvananthapuram, Kerala – 695001.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-teal-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Toll-Free Helpline</h3>
                  <p className="text-xs text-slate-300 mt-0.5">1076 (Statewide Toll-Free)</p>
                  <p className="text-xs text-slate-400">Direct Secretariat EPABX: 0471-2518387</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-teal-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Official Secretariat Email</h3>
                  <p className="text-xs text-slate-300 mt-0.5">chiefminister@kerala.gov.in</p>
                  <p className="text-xs text-slate-400">helpdesk.pgrs@kerala.gov.in</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-teal-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Operating Working Hours</h3>
                  <p className="text-xs text-slate-300 mt-0.5">Monday to Saturday: 10:00 AM – 5:00 PM</p>
                  <p className="text-xs text-slate-400">Closed on Sundays and State Gazetted Holidays</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-teal-300">
              <ShieldCheck className="w-4 h-4" />
              <span>All communications recorded in official PostgreSQL registry.</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-[#0f2b48] mb-2">Send an Enquiry or Feedback</h2>
            <p className="text-sm text-slate-500 mb-6">
              Messages submitted here are routed directly to the backend <code className="text-teal-700 bg-teal-50 px-1 py-0.5 rounded font-mono text-xs">/api/v1/public/contact/</code> API.
            </p>

            {success && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">Enquiry Submitted Successfully!</h4>
                  <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                    Thank you. Your message has been saved in the PostgreSQL database. Our grievance cell helpdesk will review it.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-900">Failed to Submit</h4>
                  <p className="text-xs text-red-700 mt-0.5 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                    placeholder="e.g. Anand Varma"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="e.g. anand@example.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  minLength={3}
                  placeholder="Summary topic of your enquiry..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message Details *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  minLength={10}
                  placeholder="Provide clear details regarding your query or feedback..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#0f2b48] hover:bg-[#1b3d63] disabled:opacity-70 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs"
              >
                <Send className="w-4 h-4 text-teal-300" />
                <span>{submitting ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}

