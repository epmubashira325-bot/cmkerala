import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cmoAPI } from '../../api/services';
import { LoadingSpinner, ErrorState, EmptyState } from '../../components/StateFeedback';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  ChevronRight,
  Filter,
  RotateCcw
} from 'lucide-react';

export default function CMOReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchActionReportsQueue();
  }, []);

  const fetchActionReportsQueue = async () => {
    try {
      setLoading(true);
      setError(null);

      // Query grievances from CMO API
      const res = await cmoAPI.getGrievances({ page_size: 100 });
      const items = res.data?.results ? res.data.results : (Array.isArray(res.data) ? res.data : []);

      // Concurrently fetch detail for grievances that have moved beyond SUBMITTED
      const activeOrResolved = items.filter((g) => g.status !== 'SUBMITTED').slice(0, 30);
      const detailed = await Promise.all(
        activeOrResolved.map(async (g) => {
          try {
            const detailRes = await cmoAPI.getGrievanceDetail(g.id);
            return detailRes.data;
          } catch {
            return g;
          }
        })
      );

      // Collect all reports
      const allReports = [];
      detailed.forEach((g) => {
        if (g.action_reports && g.action_reports.length > 0) {
          g.action_reports.forEach((r) => {
            allReports.push({
              ...r,
              grievance_ref: g.reference_number,
              grievance_subject: g.subject,
              grievance_id: g.id,
              grievance_status: g.status,
              district: g.district,
              category: g.category,
            });
          });
        }
      });

      // Sort newest first
      allReports.sort((a, b) => new Date(b.submitted_at || 0) - new Date(a.submitted_at || 0));
      setReports(allReports);
    } catch (err) {
      setError(err.message || 'Failed to load Action Taken Reports queue.');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = statusFilter
    ? reports.filter((r) => r.review_status === statusFilter)
    : reports;

  if (loading) {
    return <LoadingSpinner message="Loading statewide Action Taken Reports queue..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchActionReportsQueue} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f2b48]">Action Taken Reports (ATR) Review</h1>
          <p className="text-sm text-slate-600 mt-1">
            Four-eyes verification desk. Scrutinize department field inquiry findings and approve resolution outcomes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
          >
            <option value="">All Review Statuses</option>
            <option value="PENDING">Pending Review ({reports.filter(r => r.review_status === 'PENDING').length})</option>
            <option value="APPROVED">Approved ({reports.filter(r => r.review_status === 'APPROVED').length})</option>
            <option value="REJECTED">Rejected ({reports.filter(r => r.review_status === 'REJECTED').length})</option>
          </select>
          <button
            onClick={fetchActionReportsQueue}
            className="p-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 shrink-0"
            title="Refresh queue"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No Action Taken Reports match criteria"
              message="When field officers file reports on active grievances, they will appear here for CMO scrutiny."
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0d9488] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                      {report.grievance_ref}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {report.district}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      report.review_status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      report.review_status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800 animate-pulse'
                    }`}>
                      CMO Status: {report.review_status}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    Filing Date: {new Date(report.submitted_at).toLocaleDateString('en-IN', {
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
                    <span className="font-semibold text-slate-800 block mb-0.5">Field Investigation Findings:</span>
                    <p className="line-clamp-3 leading-relaxed">{report.investigation_description}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-800 block mb-0.5">Remedial Action Implemented:</span>
                    <p className="line-clamp-3 leading-relaxed">{report.resolution_details}</p>
                  </div>
                </div>

                {report.review_remarks && (
                  <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-900 mb-3">
                    <span className="font-bold block text-[11px]">CMO Review Remarks ({report.reviewed_by_name || 'Secretariat'}):</span>
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
                        className="inline-flex items-center gap-1 text-[#0d9488] font-bold hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Attached Field Evidence
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">No file attachment</span>
                    )}
                  </div>

                  <Link
                    to={`/cmo/grievances/${report.grievance_id}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#0f2b48] hover:text-[#0d9488]"
                  >
                    Open Grievance Dossier to Review <ChevronRight className="w-3.5 h-3.5" />
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

