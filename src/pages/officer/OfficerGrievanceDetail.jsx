import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  officerGrievanceAPI,
  GRIEVANCE_STATUSES,
  GRIEVANCE_PRIORITIES,
} from '../../api/services';
import { LoadingSpinner, ErrorState } from '../../components/StateFeedback';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  Calendar,
  Paperclip,
  Download,
  Send,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  User
} from 'lucide-react';

export default function OfficerGrievanceDetail() {
  const { id } = useParams();

  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Investigation Remark Form State
  const [remarkText, setRemarkText] = useState('');
  const [submittingRemark, setSubmittingRemark] = useState(false);
  const [remarkSuccess, setRemarkSuccess] = useState(null);
  const [remarkError, setRemarkError] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await officerGrievanceAPI.getDetail(id);
      setGrievance(res.data);
    } catch (err) {
      setError(err.message || 'Unable to retrieve assigned grievance dossier.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemarkSubmit = async (e) => {
    e.preventDefault();
    setRemarkError(null);
    setRemarkSuccess(null);

    if (!remarkText.trim() || remarkText.trim().length < 3) {
      setRemarkError('Remark must be at least 3 characters.');
      return;
    }

    setSubmittingRemark(true);

    try {
      await officerGrievanceAPI.addRemark(id, {
        remarks: remarkText.trim(),
      });
      setRemarkText('');
      setRemarkSuccess('Investigation note recorded. If this grievance was under review, it has now transitioned to In Progress.');
      // Refresh grievance data to update timeline and status
      fetchDetail();
    } catch (err) {
      setRemarkError(err.message || 'Failed to record investigation remark.');
    } finally {
      setSubmittingRemark(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving authorized grievance dossier..." />;
  }

  if (error || !grievance) {
    return <ErrorState message={error || 'Grievance not found or unauthorized.'} onRetry={fetchDetail} />;
  }

  const getStatusBadge = (status) => {
    const config = GRIEVANCE_STATUSES.find((s) => s.value === status) || {
      label: status,
      color: 'bg-slate-100 text-slate-700',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const config = GRIEVANCE_PRIORITIES.find((p) => p.value === priority) || {
      label: priority,
      color: 'bg-slate-100 text-slate-700',
    };
    return (
      <span className={`px-2.5 py-1 rounded text-xs font-bold ${config.color}`}>
        {config.label} Priority
      </span>
    );
  };

  // Has approved report
  const hasApprovedReport = grievance.action_reports?.some((r) => r.review_status === 'APPROVED');
  const hasPendingReport = grievance.action_reports?.some((r) => r.review_status === 'PENDING');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/officer/grievances"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0f2b48]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Assigned Queue
        </Link>
        <span className="text-xs text-slate-400 font-mono">Assignment ID: {grievance.id}</span>
      </div>

      {/* Main Dossier Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-sm font-extrabold text-[#0d9488] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                {grievance.reference_number}
              </span>
              {getStatusBadge(grievance.status)}
              {getPriorityBadge(grievance.priority)}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#0f2b48]">
              {grievance.subject}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/officer/grievances/${grievance.id}/report`}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                grievance.status === 'RESOLVED'
                  ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                  : 'bg-[#0d9488] hover:bg-teal-700 text-white'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              {hasPendingReport ? 'Manage Submitted ATR' : 'Draft Action Taken Report'}
            </Link>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 uppercase font-semibold text-[10px] block">Revenue District</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">{grievance.district}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 uppercase font-semibold text-[10px] block">Category</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block truncate">{grievance.category}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 uppercase font-semibold text-[10px] block">Resolution SLA</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {grievance.due_date || 'Standard SLA'}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 uppercase font-semibold text-[10px] block">Escalation Status</span>
            <span className={`font-bold text-sm mt-0.5 block ${grievance.is_escalated ? 'text-rose-600' : 'text-emerald-600'}`}>
              {grievance.is_escalated ? 'Escalated to CMO' : 'Normal'}
            </span>
          </div>
        </div>
      </div>

      {/* Narrative & Remarks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Complaint Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
            <h3 className="text-base font-bold text-[#0f2b48] mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              Citizen Allegation Narrative
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {grievance.description}
            </div>
          </div>

          {/* Record Investigation Remark Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
            <h3 className="text-base font-bold text-[#0f2b48] mb-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              Post Investigation Progress Note
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Recording an investigation remark updates the grievance to <strong className="text-indigo-700">In Progress</strong> and appends to the immutable audit timeline.
            </p>

            {remarkSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {remarkSuccess}
              </div>
            )}
            {remarkError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {remarkError}
              </div>
            )}

            <form onSubmit={handleRemarkSubmit} className="space-y-3">
              <textarea
                rows={3}
                required
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                placeholder="Enter field inspection details, coordination with local village/taluk office, or current inquiry status..."
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingRemark || grievance.status === 'RESOLVED'}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f2b48] hover:bg-[#1b3d63] text-white text-xs font-semibold shadow-xs disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submittingRemark ? 'Recording Note...' : 'Record Investigation Note'}
                </button>
              </div>
            </form>
          </div>

          {/* Action Taken Reports (ATRs) History */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#0f2b48] flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                Action Taken Reports (ATR) History
              </h3>
              <Link
                to={`/officer/grievances/${grievance.id}/report`}
                className="text-xs font-semibold text-[#0d9488] hover:underline"
              >
                + New Submission
              </Link>
            </div>

            {grievance.action_reports && grievance.action_reports.length > 0 ? (
              <div className="space-y-4">
                {grievance.action_reports.map((report) => (
                  <div key={report.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="font-bold text-slate-800">
                        Reporting Officer: {report.officer_name || 'Designated Field Officer'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                        report.review_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        report.review_status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        CMO Status: {report.review_status}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 block">Investigation Description:</span>
                      <p className="text-slate-600 mt-0.5">{report.investigation_description}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 block">Resolution Implemented:</span>
                      <p className="text-slate-600 mt-0.5">{report.resolution_details}</p>
                    </div>

                    {report.report_attachment && (
                      <div className="pt-1">
                        <a
                          href={report.report_attachment}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] text-[#0d9488] font-semibold hover:underline"
                        >
                          <Download className="w-3.5 h-3.5" /> Download Attached ATR Proof
                        </a>
                      </div>
                    )}

                    {report.review_remarks && (
                      <div className="p-3 rounded-lg bg-white border border-slate-200 text-slate-700 mt-2">
                        <span className="font-semibold text-slate-900 block text-[11px]">
                          CMO Review Remarks ({report.reviewed_by_name || 'CMO Secretariat'}):
                        </span>
                        {report.review_remarks}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No Action Taken Report filed yet. Once field remediation is completed, submit an official ATR for CMO verification.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar: Attachments & Audit History */}
        <div className="space-y-6">
          {/* Citizen Attachments */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#0f2b48] mb-3 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-teal-600" />
              Citizen Evidence Files ({grievance.attachments?.length || 0})
            </h3>
            {grievance.attachments && grievance.attachments.length > 0 ? (
              <div className="space-y-2">
                {grievance.attachments.map((att) => (
                  <a
                    key={att.id}
                    href={att.file}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-[#0d9488] bg-slate-50/50 hover:bg-white text-xs transition-colors group"
                  >
                    <div className="truncate pr-2">
                      <div className="font-semibold text-slate-800 truncate group-hover:text-[#0d9488]">
                        {att.original_filename || 'Evidence File'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {(att.file_size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0d9488] shrink-0" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No attachments submitted by citizen.</p>
            )}
          </div>

          {/* Audit History Log */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#0f2b48] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              Grievance Audit History
            </h3>
            {grievance.history_logs && grievance.history_logs.length > 0 ? (
              <div className="relative pl-4 space-y-4 before:content-[''] before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {grievance.history_logs.map((log) => (
                  <div key={log.id} className="relative">
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#0d9488] border-2 border-white shadow-xs" />
                    <div className="text-[11px] font-bold text-slate-800">
                      {log.new_status}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {log.remarks || 'Audit entry recorded'}
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5">
                      {new Date(log.created_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No history logs recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

