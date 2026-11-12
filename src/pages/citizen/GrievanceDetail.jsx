import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  citizenGrievanceAPI,
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
  User,
  Calendar,
  Paperclip,
  Download,
  Star,
  Send,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';

export default function GrievanceDetail() {
  const { id } = useParams();
  const location = useLocation();
  const newReference = location.state?.newReference;

  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Feedback State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(null);
  const [feedbackError, setFeedbackError] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await citizenGrievanceAPI.getDetail(id);
      setGrievance(res.data);
    } catch (err) {
      setError(err.message || 'Unable to retrieve grievance details.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackError(null);
    setSubmittingFeedback(true);

    try {
      const res = await citizenGrievanceAPI.submitFeedback(id, {
        rating,
        comments: comments.trim(),
      });
      setFeedbackSuccess('Thank you! Your feedback has been recorded by the Chief Minister\'s Office.');
      // Refresh to update feedback object on grievance
      fetchDetail();
    } catch (err) {
      setFeedbackError(err.message || 'Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving grievance dossier..." />;
  }

  if (error || !grievance) {
    return <ErrorState message={error || 'Grievance not found.'} onRetry={fetchDetail} />;
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

  // Lifecycle stage milestones
  const steps = [
    { label: 'Submitted', key: 'SUBMITTED' },
    { label: 'CMO Review', key: 'UNDER_REVIEW' },
    { label: 'In Progress', key: 'IN_PROGRESS' },
    { label: 'Resolved', key: 'RESOLVED' },
  ];

  const statusOrder = ['SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED'];
  const currentIndex = statusOrder.indexOf(grievance.status);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/citizen/grievances"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0f2b48]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Grievances
        </Link>
        <span className="text-xs text-slate-400 font-mono">ID: {grievance.id}</span>
      </div>

      {/* New Submission Toast Alert */}
      {newReference && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Grievance Successfully Lodged!</div>
            <div className="text-xs text-emerald-700 mt-0.5">
              Your official tracking reference is{' '}
              <span className="font-mono font-bold">{newReference}</span>. The CMO secretariat will triage and allocate this matter to the relevant department.
            </div>
          </div>
        </div>
      )}

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

          <div className="text-left md:text-right text-xs text-slate-500 shrink-0">
            <div>Filed on: <span className="font-semibold text-slate-700">
              {new Date(grievance.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span></div>
            {grievance.due_date && (
              <div className="mt-1">
                Target SLA: <span className="font-semibold text-slate-700">{grievance.due_date}</span>
              </div>
            )}
          </div>
        </div>

        {/* Milestone Timeline Bar */}
        <div className="py-6 border-b border-slate-100">
          <div className="grid grid-cols-4 gap-2 text-center">
            {steps.map((st, i) => {
              const isPastOrCurrent = currentIndex >= i;
              const isCurrent = grievance.status === st.key;

              return (
                <div key={st.key} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-colors ${
                      isPastOrCurrent
                        ? 'bg-[#0d9488] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isPastOrCurrent ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold ${
                      isCurrent ? 'text-[#0d9488]' : isPastOrCurrent ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Essential Metadata Grid */}
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
            <span className="text-slate-400 uppercase font-semibold text-[10px] block">Assigned Dept</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block truncate">
              {grievance.assigned_department ? 'Department Allocated' : 'CMO Triage Pending'}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 uppercase font-semibold text-[10px] block">Escalation Status</span>
            <span className={`font-bold text-sm mt-0.5 block ${grievance.is_escalated ? 'text-rose-600' : 'text-emerald-600'}`}>
              {grievance.is_escalated ? 'Escalated to CMO' : 'Standard SLA'}
            </span>
          </div>
        </div>
      </div>

      {/* Complaint Narrative & Attachments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Detailed Narrative */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
            <h3 className="text-base font-bold text-[#0f2b48] mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              Complaint Description
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {grievance.description}
            </div>

            {/* AI Triage Record (if captured) */}
            {grievance.ai_suggestions && Object.keys(grievance.ai_suggestions).length > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-teal-50/50 border border-teal-200 text-xs">
                <div className="flex items-center gap-2 text-teal-900 font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Gemini AI Advisory Record
                </div>
                <div className="text-slate-600 space-y-1">
                  <div>
                    <span className="font-semibold text-slate-700">Triage Summary:</span> {grievance.ai_suggestions.summary}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Model Recommendation:</span> {grievance.ai_suggestions.suggested_department || 'General Administration'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Taken Reports (ATRs) */}
          {grievance.action_reports && grievance.action_reports.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
              <h3 className="text-base font-bold text-[#0f2b48] mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Department Action Taken Reports (ATR)
              </h3>
              <div className="space-y-4">
                {grievance.action_reports.map((report) => (
                  <div key={report.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="font-bold text-slate-800">
                        Investigating Officer: {report.officer_name || 'Designated Field Officer'}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-semibold ${
                        report.review_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        report.review_status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        CMO Review: {report.review_status}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 block">Investigation Findings:</span>
                      <p className="text-slate-600 mt-0.5">{report.investigation_description}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 block">Resolution Implemented:</span>
                      <p className="text-slate-600 mt-0.5">{report.resolution_details}</p>
                    </div>

                    {report.review_remarks && (
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700">
                        <span className="font-semibold text-slate-900 block text-[11px]">CMO Review Remarks:</span>
                        {report.review_remarks}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Citizen Feedback Form (After Resolution) */}
          {grievance.status === 'RESOLVED' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
              <h3 className="text-base font-bold text-[#0f2b48] mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Citizen Redressal Feedback
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Please rate your satisfaction with the resolution provided by the department and CMO.
              </p>

              {grievance.feedback ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1 text-amber-500 font-bold mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= grievance.feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                    <span className="ml-2 text-slate-700">Rating: {grievance.feedback.rating} / 5</span>
                  </div>
                  <div className="text-slate-700">
                    <span className="font-semibold">Comments:</span> {grievance.feedback.comments || 'No written remarks provided.'}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  {feedbackError && (
                    <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                      {feedbackError}
                    </div>
                  )}
                  {feedbackSuccess && (
                    <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
                      {feedbackSuccess}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Satisfaction Rating (1 to 5 Stars)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              star <= (hoverRating || rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 hover:text-amber-200'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-semibold text-slate-600 ml-2">
                        {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Very Poor'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Feedback Comments (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Share your experience regarding resolution promptness, officer conduct, or remaining issues..."
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d9488] text-white text-xs font-semibold hover:bg-teal-700 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Satisfaction Rating
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Sidebar: Attachments & Audit Log */}
        <div className="space-y-6">
          {/* Attachments Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#0f2b48] mb-3 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-teal-600" />
              Attached Files ({grievance.attachments?.length || 0})
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
              <p className="text-xs text-slate-400 italic">No attachments submitted.</p>
            )}
          </div>

          {/* Audit History Log */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#0f2b48] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              Status Audit History
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
                      {log.remarks || 'Administrative action logged'}
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

