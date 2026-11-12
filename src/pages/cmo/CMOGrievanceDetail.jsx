import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  cmoAPI,
  departmentAPI,
  GRIEVANCE_STATUSES,
  GRIEVANCE_PRIORITIES,
} from '../../api/services';
import { LoadingSpinner, ErrorState } from '../../components/StateFeedback';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Calendar,
  Paperclip,
  Download,
  Send,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  Flame,
  UserCheck,
  Check,
  X
} from 'lucide-react';

export default function CMOGrievanceDetail() {
  const { id } = useParams();

  const [grievance, setGrievance] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Assignment Modal / Form State
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignRemarks, setAssignRemarks] = useState('');
  const [submittingAssign, setSubmittingAssign] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(null);
  const [assignError, setAssignError] = useState(null);

  // Internal CMO Remark State
  const [internalRemark, setInternalRemark] = useState('');
  const [submittingRemark, setSubmittingRemark] = useState(false);
  const [remarkSuccess, setRemarkSuccess] = useState(null);
  const [remarkError, setRemarkError] = useState(null);

  // Escalation State
  const [escalateRemarks, setEscalateRemarks] = useState('');
  const [submittingEscalate, setSubmittingEscalate] = useState(false);
  const [escalateSuccess, setEscalateSuccess] = useState(null);
  const [escalateError, setEscalateError] = useState(null);
  const [showEscalateDialog, setShowEscalateDialog] = useState(false);

  // Review ATR State
  const [reviewingReportId, setReviewingReportId] = useState(null);
  const [reviewDecision, setReviewDecision] = useState('APPROVED');
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    fetchDossier();
    loadDepartments();
  }, [id]);

  // When selected department changes, load its active officers
  useEffect(() => {
    if (selectedDept) {
      cmoAPI.getDepartmentOfficers(selectedDept)
        .then((res) => {
          setOfficers(res.data || []);
        })
        .catch(() => {
          setOfficers([]);
        });
    } else {
      setOfficers([]);
    }
  }, [selectedDept]);

  const loadDepartments = async () => {
    try {
      const res = await departmentAPI.getAll();
      setDepartments(res.data || []);
    } catch {}
  };

  const fetchDossier = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await cmoAPI.getGrievanceDetail(id);
      setGrievance(res.data);
      if (res.data?.assigned_department) {
        setSelectedDept(res.data.assigned_department);
      }
      if (res.data?.due_date) {
        setDueDate(res.data.due_date);
      }
    } catch (err) {
      setError(err.message || 'Unable to retrieve grievance case dossier.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Department & Officer Assignment
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setAssignError(null);
    setAssignSuccess(null);

    if (!selectedDept) {
      setAssignError('Please select a department for assignment.');
      return;
    }

    setSubmittingAssign(true);

    try {
      const payload = {
        department_id: selectedDept,
        officer_id: selectedOfficer || null,
        due_date: dueDate || null,
        remarks: assignRemarks.trim(),
      };

      await cmoAPI.assignGrievance(id, payload);
      setAssignSuccess('Department & Officer allocation saved successfully.');
      setAssignRemarks('');
      fetchDossier();
    } catch (err) {
      setAssignError(err.message || 'Failed to complete assignment.');
    } finally {
      setSubmittingAssign(false);
    }
  };

  // Handle Internal Remark Submission
  const handleRemarkSubmit = async (e) => {
    e.preventDefault();
    setRemarkError(null);
    setRemarkSuccess(null);

    if (!internalRemark.trim() || internalRemark.trim().length < 3) {
      setRemarkError('Remark must be at least 3 characters.');
      return;
    }

    setSubmittingRemark(true);

    try {
      await cmoAPI.addInternalRemark(id, {
        remarks: internalRemark.trim(),
      });
      setInternalRemark('');
      setRemarkSuccess('Confidential CMO observation recorded.');
      fetchDossier();
    } catch (err) {
      setRemarkError(err.message || 'Failed to record internal remark.');
    } finally {
      setSubmittingRemark(false);
    }
  };

  // Handle Escalation
  const handleEscalateSubmit = async (e) => {
    e.preventDefault();
    setEscalateError(null);
    setEscalateSuccess(null);
    setSubmittingEscalate(true);

    try {
      await cmoAPI.escalateGrievance(id, {
        remarks: escalateRemarks.trim() || 'Escalated by CMO Administrator.',
      });
      setEscalateSuccess('Grievance has been flagged as escalated to Chief Minister\'s Office.');
      setShowEscalateDialog(false);
      setEscalateRemarks('');
      fetchDossier();
    } catch (err) {
      setEscalateError(err.message || 'Failed to escalate grievance.');
    } finally {
      setSubmittingEscalate(false);
    }
  };

  // Handle ATR Review (Four-Eyes Approval / Rejection)
  const handleReviewReport = async (reportId) => {
    setReviewError(null);
    setReviewSuccess(null);

    if (reviewDecision === 'REJECTED' && (!reviewRemarks || reviewRemarks.trim().length < 5)) {
      setReviewError('Detailed remarks are required when rejecting an Action Taken Report.');
      return;
    }

    setSubmittingReview(true);

    try {
      await cmoAPI.reviewReport(reportId, {
        decision: reviewDecision,
        remarks: reviewRemarks.trim(),
      });
      setReviewSuccess(
        reviewDecision === 'APPROVED'
          ? 'ATR Approved! Grievance has officially transitioned to RESOLVED.'
          : 'ATR has been Rejected and returned to the department officer for remediation.'
      );
      setReviewingReportId(null);
      setReviewRemarks('');
      fetchDossier();
    } catch (err) {
      setReviewError(err.message || 'Failed to submit ATR review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Apply AI Suggestion to Allocation Form
  const applyAiDept = () => {
    if (grievance?.ai_suggestions?.suggested_department_id) {
      setSelectedDept(grievance.ai_suggestions.suggested_department_id);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving grievance dossier..." />;
  }

  if (error || !grievance) {
    return <ErrorState message={error || 'Grievance not found.'} onRetry={fetchDossier} />;
  }

  const getStatusBadge = (status) => {
    const config = GRIEVANCE_STATUSES.find((s) => s.value === status) || {
      label: status,
      color: 'bg-slate-100 text-slate-700',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
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
      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${config.color}`}>
        {config.label} Priority
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/cmo/grievances"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0f2b48]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to State Registry
        </Link>
        <span className="text-xs text-slate-400 font-mono">Dossier UUID: {grievance.id}</span>
      </div>

      {/* Main Dossier Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-sm font-extrabold text-[#0d9488] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                {grievance.reference_number}
              </span>
              {getStatusBadge(grievance.status)}
              {getPriorityBadge(grievance.priority)}
              {grievance.is_escalated && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Escalated to CMO
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#0f2b48]">
              {grievance.subject}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!grievance.is_escalated && grievance.status !== 'RESOLVED' && (
              <button
                onClick={() => setShowEscalateDialog(true)}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Escalate Matter
              </button>
            )}
            <a
              href="#assignment-section"
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0f2b48] hover:bg-[#1b3d63] text-white transition-colors shadow-xs"
            >
              <Building2 className="w-3.5 h-3.5 text-teal-300" /> Allocate Department
            </a>
          </div>
        </div>

        {/* Essential Information Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 uppercase font-semibold text-[10px] block">Citizen Submitter</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block truncate">
              {grievance.citizen_name || 'Registered Citizen'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 uppercase font-semibold text-[10px] block">Revenue District</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">{grievance.district}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 uppercase font-semibold text-[10px] block">Category</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block truncate">{grievance.category}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 uppercase font-semibold text-[10px] block">Target SLA Due Date</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {grievance.due_date || 'Standard SLA'}
            </span>
          </div>
        </div>
      </div>

      {/* Escalation Dialog */}
      {showEscalateDialog && (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Flame className="w-4 h-4 text-rose-600" /> Confirm Administrative Escalation
            </div>
            <button onClick={() => setShowEscalateDialog(false)} className="text-rose-500 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p>
            Escalating this grievance marks it with elevated priority across all departmental monitoring screens and flags it directly on the Chief Minister's surveillance dashboard.
          </p>
          <form onSubmit={handleEscalateSubmit} className="space-y-3">
            <textarea
              rows={2}
              value={escalateRemarks}
              onChange={(e) => setEscalateRemarks(e.target.value)}
              placeholder="Reason for escalation (e.g. repeated public hazard, SLA breach, sensitive civic dispute)..."
              className="w-full p-2.5 rounded-xl border border-rose-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEscalateDialog(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingEscalate}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                {submittingEscalate ? 'Escalating...' : 'Confirm Escalation'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Narrative & AI Triage Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Narrative */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
            <h3 className="text-base font-bold text-[#0f2b48] mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              Citizen Grievance Narrative
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {grievance.description}
            </div>
          </div>

          {/* AI Recommendation Audit Panel */}
          <div className="bg-white rounded-2xl border border-teal-200 p-6 shadow-xs bg-gradient-to-br from-white to-teal-50/20">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-teal-100">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0f2b48]">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Google Gemini AI Triage Advisory
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-mono">
                {grievance.ai_metadata?.actual_model || 'gemini-3.6-flash'}
              </span>
            </div>

            {grievance.ai_suggestions && Object.keys(grievance.ai_suggestions).length > 0 ? (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-teal-100 shadow-2xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Suggested Department</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-bold text-[#0f2b48]">
                        {grievance.ai_suggestions.suggested_department || 'General Administration'}
                      </span>
                      {grievance.ai_suggestions.suggested_department_id && (
                        <button
                          type="button"
                          onClick={applyAiDept}
                          className="text-[10px] text-teal-700 font-bold hover:underline"
                        >
                          Adopt
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-teal-100 shadow-2xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Suggested Category</span>
                    <span className="font-bold text-[#0f2b48] mt-0.5 block truncate">
                      {grievance.ai_suggestions.suggested_category}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-teal-100 shadow-2xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Suggested Priority</span>
                    <span className="font-bold text-[#0f2b48] mt-0.5 block">
                      {grievance.ai_suggestions.suggested_priority}
                    </span>
                  </div>
                </div>

                {grievance.ai_suggestions.summary && (
                  <div className="p-3 bg-white rounded-xl border border-teal-100 text-slate-700">
                    <span className="font-bold text-slate-900 block text-[11px] mb-0.5">Executive Summary for CMO:</span>
                    {grievance.ai_suggestions.summary}
                  </div>
                )}

                <div className="text-[11px] text-slate-500 italic">
                  Note: AI recommendations are advisory triage cues. Final administrative jurisdiction is officially allocated by CMO administrators.
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                AI triage was bypassed or was unavailable during citizen submission. Manual allocation required.
              </p>
            )}
          </div>

          {/* Department & Officer Allocation Workspace */}
          <div id="assignment-section" className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
            <h3 className="text-base font-bold text-[#0f2b48] mb-1 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              Department & Officer Jurisdiction Allocation
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Assign or reallocate this grievance to an authorized department ministry and specific field officer.
            </p>

            {assignSuccess && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {assignSuccess}
              </div>
            )}
            {assignError && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {assignError}
              </div>
            )}

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Responsible Department *
                  </label>
                  <select
                    required
                    value={selectedDept}
                    onChange={(e) => {
                      setSelectedDept(e.target.value);
                      setSelectedOfficer('');
                    }}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                  >
                    <option value="">-- Select Active Department --</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.code} - {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specific Officer Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Designated Field Officer (Optional)
                  </label>
                  <select
                    value={selectedOfficer}
                    onChange={(e) => setSelectedOfficer(e.target.value)}
                    disabled={!selectedDept || officers.length === 0}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488] disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">
                      {officers.length === 0
                        ? '-- Department Pool (Auto-Assignment) --'
                        : '-- Select Designated Officer --'}
                    </option>
                    {officers.map((off) => (
                      <option key={off.id} value={off.id}>
                        {off.full_name} ({off.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Due Date */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Resolution Target Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                  />
                </div>

                {/* Allocation Remarks */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                    Allocation Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={assignRemarks}
                    onChange={(e) => setAssignRemarks(e.target.value)}
                    placeholder="e.g. Conduct joint site verification with ward councillor"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submittingAssign}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0f2b48] hover:bg-[#1b3d63] text-white text-xs font-semibold shadow-xs disabled:opacity-40"
                >
                  <Building2 className="w-3.5 h-3.5 text-teal-300" />
                  {submittingAssign ? 'Saving Allocation...' : 'Commit Department Assignment'}
                </button>
              </div>
            </form>
          </div>

          {/* Action Taken Reports (ATRs) & Four-Eyes Verification */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
            <h3 className="text-base font-bold text-[#0f2b48] mb-1 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              Four-Eyes Action Taken Report (ATR) Verification
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Officers cannot resolve complaints independently. CMO scrutiny and approval of the ATR is mandatory to mark grievances as RESOLVED.
            </p>

            {reviewSuccess && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {reviewSuccess}
              </div>
            )}
            {reviewError && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {reviewError}
              </div>
            )}

            {grievance.action_reports && grievance.action_reports.length > 0 ? (
              <div className="space-y-4">
                {grievance.action_reports.map((report) => (
                  <div key={report.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <span className="font-bold text-slate-800">
                          Submitted by Officer: {report.officer_name || 'Department Officer'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Filing Timestamp: {new Date(report.submitted_at).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                        report.review_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        report.review_status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        CMO Review: {report.review_status}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 block">Field Investigation Description:</span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{report.investigation_description}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 block">Remediation Executed:</span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{report.resolution_details}</p>
                    </div>

                    {report.report_attachment && (
                      <div className="pt-1">
                        <a
                          href={report.report_attachment}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-[#0d9488] font-bold hover:underline"
                        >
                          <Download className="w-3.5 h-3.5" /> Download Attached Inspection Evidence
                        </a>
                      </div>
                    )}

                    {/* If reviewed, show reviewer details */}
                    {report.reviewed_at && (
                      <div className="p-3 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs">
                        <div className="font-semibold text-slate-900 flex items-center justify-between">
                          <span>Decision: {report.review_status} by {report.reviewed_by_name || 'CMO Administrator'}</span>
                          <span className="text-[10px] text-slate-400">{new Date(report.reviewed_at).toLocaleDateString('en-IN')}</span>
                        </div>
                        {report.review_remarks && (
                          <p className="mt-1 text-slate-600">{report.review_remarks}</p>
                        )}
                      </div>
                    )}

                    {/* If report is PENDING, show CMO Review Controls */}
                    {report.review_status === 'PENDING' && (
                      <div className="pt-3 border-t border-slate-200 space-y-3">
                        <div className="font-bold text-slate-800">Review & Resolve Action</div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`decision-${report.id}`}
                              value="APPROVED"
                              checked={reviewDecision === 'APPROVED'}
                              onChange={() => setReviewDecision('APPROVED')}
                              className="text-[#0d9488] focus:ring-[#0d9488]"
                            />
                            <span className="font-semibold text-emerald-700">Approve & Resolve Grievance</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`decision-${report.id}`}
                              value="REJECTED"
                              checked={reviewDecision === 'REJECTED'}
                              onChange={() => setReviewDecision('REJECTED')}
                              className="text-rose-600 focus:ring-rose-500"
                            />
                            <span className="font-semibold text-rose-700">Reject Report (Request Remediation)</span>
                          </label>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={reviewRemarks}
                            onChange={(e) => setReviewRemarks(e.target.value)}
                            placeholder={reviewDecision === 'REJECTED' ? 'Required: Reason for rejection and mandatory next steps...' : 'Optional: CMO verification remarks...'}
                            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleReviewReport(report.id)}
                            disabled={submittingReview}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs ${
                              reviewDecision === 'APPROVED'
                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                : 'bg-rose-600 hover:bg-rose-700'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            {submittingReview ? 'Processing...' : `Submit ${reviewDecision} Decision`}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No Action Taken Report submitted yet by the assigned department officer.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar: Internal CMO Remarks, Attachments & Audit Log */}
        <div className="space-y-6">
          {/* Post Confidential CMO Remark */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#0f2b48] mb-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              Confidential CMO Note
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              Internal notes are recorded strictly in administrative logs and are never exposed to citizens.
            </p>

            {remarkSuccess && (
              <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px]">
                {remarkSuccess}
              </div>
            )}
            {remarkError && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-50 text-rose-800 text-[11px]">
                {remarkError}
              </div>
            )}

            <form onSubmit={handleRemarkSubmit} className="space-y-3">
              <textarea
                rows={3}
                required
                value={internalRemark}
                onChange={(e) => setInternalRemark(e.target.value)}
                placeholder="Enter internal administrative notes, CMO directives, or cross-department observations..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
              />
              <button
                type="submit"
                disabled={submittingRemark}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0f2b48] text-white text-xs font-semibold hover:bg-[#1b3d63] disabled:opacity-40"
              >
                <Send className="w-3 h-3" />
                {submittingRemark ? 'Recording...' : 'Record CMO Internal Note'}
              </button>
            </form>
          </div>

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
              <p className="text-xs text-slate-400 italic">No attachments submitted.</p>
            )}
          </div>

          {/* Complete Audit History Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#0f2b48] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              Complete Audit History Log
            </h3>
            {grievance.history_logs && grievance.history_logs.length > 0 ? (
              <div className="relative pl-4 space-y-4 before:content-[''] before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {grievance.history_logs.map((log) => (
                  <div key={log.id} className="relative">
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#0d9488] border-2 border-white shadow-xs" />
                    <div className="text-[11px] font-bold text-slate-800">
                      {log.new_status}
                    </div>
                    <div className="text-[10px] text-slate-600 mt-0.5 leading-snug">
                      {log.remarks || 'Status logged'}
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
              <p className="text-xs text-slate-400 italic">No history entries logged.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

