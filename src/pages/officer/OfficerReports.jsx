import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { officerGrievanceAPI } from '../../api/services';
import { LoadingSpinner, ErrorState, EmptyState } from '../../components/StateFeedback';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function OfficerReports() {
  const [grievancesWithReports, setGrievancesWithReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportsQueue();
  }, []);

  const fetchReportsQueue = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch officer's grievances (DRF pagination)
      const res = await officerGrievanceAPI.getList({ page_size: 100 });
      const items = res.data?.results ? res.data.results : (Array.isArray(res.data) ? res.data : []);

      // Detail fetch each grievance to get action_reports
      // Parallel fetch up to 20 recent
      const detailed = await Promise.all(
        items.slice(0, 20).map(async (g) => {
          try {
            const detailRes = await officerGrievanceAPI.getDetail(g.id);
            return detailRes.data;
          } catch {
            return g;
          }
        })
      );

      // Collect all reports
      const reports = [];
      detailed.forEach((g) => {
        if (g.action_reports && g.action_reports.length > 0) {
          g.action_reports.forEach((r) => {
            reports.push({
              ...r,
              grievance_ref: g.reference_number,
              grievance_subject: g.subject,
              grievance_id: g.id,
              grievance_status: g.status,
            });
          });
        }
      });

      // Sort by submitted_at desc
      reports.sort((a, b) => new Date(b.submitted_at || 0) - new Date(a.submitted_at || 0));
      setGrievancesWithReports(reports);
    } catch (err) {
      setError(err.message || 'Failed to load submitted action reports.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading submitted Action Taken Reports..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchReportsQueue} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f2b48]">Action Taken Reports (ATR)</h1>
        <p className="text-sm text-slate-600 mt-1">
          Historical record of all remediation reports submitted for CMO review and four-eyes verification.
        </p>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {grievancesWithReports.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No Action Taken Reports filed yet"
              message="When you conduct field investigations and submit an ATR on an assigned grievance, it will appear here."
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {grievancesWithReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0d9488] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {report.grievance_ref}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      report.review_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      report.review_status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      CMO Review: {report.review_status}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    Submitted: {new Date(report.submitted_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#0f2b48] mb-2">
                  {report.grievance_subject}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 mb-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-800 block mb-0.5">Investigation Description:</span>
                    <p className="line-clamp-2">{report.investigation_description}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-800 block mb-0.5">Remedial Resolution:</span>
                    <p className="line-clamp-2">{report.resolution_details}</p>
                  </div>
                </div>

                {report.review_remarks && (
                  <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-900 mb-3">
                    <span className="font-bold block text-[11px]">CMO Secretariat Review Remarks:</span>
                    {report.review_remarks}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div>
                    {report.report_attachment ? (
                      <a
                        href={report.report_attachment}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#0d9488] font-semibold hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Attached ATR Document
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">No file attachment</span>
                    )}
                  </div>

                  <Link
                    to={`/officer/grievances/${report.grievance_id}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#0f2b48] hover:text-[#0d9488]"
                  >
                    View Dossier <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

