import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { officerGrievanceAPI } from '../../api/services';
import { LoadingSpinner, ErrorState } from '../../components/StateFeedback';
import {
  FileCheck2,
  Upload,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  X,
  FileText,
  Send,
  Loader2,
  ShieldAlert,
  Info
} from 'lucide-react';

export default function SubmitActionReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [grievance, setGrievance] = useState(null);
  const [loadingGrievance, setLoadingGrievance] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Form State
  const [investigationDescription, setInvestigationDescription] = useState('');
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [reportFile, setReportFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchGrievanceHeader();
  }, [id]);

  const fetchGrievanceHeader = async () => {
    try {
      setLoadingGrievance(true);
      setLoadError(null);
      const res = await officerGrievanceAPI.getDetail(id);
      setGrievance(res.data);
    } catch (err) {
      setLoadError(err.message || 'Unable to access assigned grievance details.');
    } finally {
      setLoadingGrievance(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit.');
        return;
      }
      setReportFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (investigationDescription.trim().length < 10) {
      setSubmitError('Investigation description must be at least 10 characters.');
      return;
    }
    if (resolutionDetails.trim().length < 10) {
      setSubmitError('Resolution details must be at least 10 characters.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('investigation_description', investigationDescription.trim());
      formData.append('resolution_details', resolutionDetails.trim());
      if (reportFile) {
        formData.append('report_attachment', reportFile);
      }

      const res = await officerGrievanceAPI.submitReport(id, formData);
      setSubmitSuccess('Action Taken Report submitted successfully. It is now awaiting review by the Chief Minister\'s Office.');
      setTimeout(() => {
        navigate(`/officer/grievances/${id}`);
      }, 1500);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit Action Taken Report.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingGrievance) {
    return <LoadingSpinner message="Loading grievance assignment..." />;
  }

  if (loadError || !grievance) {
    return <ErrorState message={loadError || 'Grievance not found.'} onRetry={fetchGrievanceHeader} />;
  }

  // Check if an ATR is already PENDING review
  const pendingReport = grievance.action_reports?.find((r) => r.review_status === 'PENDING');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to={`/officer/grievances/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0f2b48]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Grievance Dossier
        </Link>
        <span className="text-xs text-slate-400 font-mono">Ref: {grievance.reference_number}</span>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs font-bold text-[#0d9488] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
            {grievance.reference_number}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {grievance.district}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {grievance.category}
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-[#0f2b48]">
          File Action Taken Report (ATR)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Subject: <span className="text-slate-800 font-medium">{grievance.subject}</span>
        </p>
      </div>

      {/* Notice if an ATR is already pending CMO review */}
      {pendingReport && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm">Action Taken Report Currently Under CMO Review</div>
            <p className="mt-1 leading-relaxed">
              An Action Taken Report was submitted on{' '}
              <strong>{new Date(pendingReport.submitted_at).toLocaleDateString('en-IN')}</strong> and is pending evaluation by the Chief Minister's Office.
              Submitting another report will create a subsequent review filing for the secretariat.
            </p>
          </div>
        </div>
      )}

      {submitSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>{submitSuccess}</div>
        </div>
      )}

      {submitError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>{submitError}</div>
        </div>
      )}

      {/* ATR Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
          {/* Section 1: Investigation Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Field Investigation Findings & Inquiries * (min 10 chars)
            </label>
            <textarea
              required
              rows={5}
              value={investigationDescription}
              onChange={(e) => setInvestigationDescription(e.target.value)}
              placeholder="Detail the field visits, site verification dates, findings, responsible parties identified, and physical assessments conducted..."
              className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              {investigationDescription.length} characters entered
            </span>
          </div>

          {/* Section 2: Resolution Details */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Action Taken & Remediation Details * (min 10 chars)
            </label>
            <textarea
              required
              rows={4}
              value={resolutionDetails}
              onChange={(e) => setResolutionDetails(e.target.value)}
              placeholder="Specify the exact remedial measures implemented (e.g. pipe repaired, sanctioned grant released, revenue records mutated, notice served)..."
              className="w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              {resolutionDetails.length} characters entered
            </span>
          </div>

          {/* Section 3: Supporting ATR Document */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Official ATR Document / Site Photographs (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-[#0d9488] rounded-2xl p-6 text-center transition-colors">
              <input
                type="file"
                id="atr-file-upload"
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
              />
              <label htmlFor="atr-file-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-sm font-semibold text-[#0d9488] hover:underline">
                  {reportFile ? reportFile.name : 'Click to select supporting PDF or photo'}
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  Upload signed inspection report, completion certificate, or photographs (Max 10MB)
                </span>
              </label>
            </div>

            {reportFile && (
              <div className="mt-3 flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="truncate font-medium text-slate-800">{reportFile.name}</span>
                  <span className="text-slate-400 shrink-0">({(reportFile.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setReportFile(null)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Advisory and Submit Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700 block mb-0.5">Four-Eyes Verification Protocol:</span>
            Officers cannot unilaterally mark grievances as Resolved. Your ATR will be verified by the Chief Minister's Office.
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium bg-[#0f2b48] hover:bg-[#1b3d63] transition-all shadow-sm disabled:opacity-50 text-sm shrink-0"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting ATR...
              </>
            ) : (
              <>
                <FileCheck2 className="w-4 h-4 text-teal-300" /> Submit ATR for CMO Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

