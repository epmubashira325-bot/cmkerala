import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { citizenGrievanceAPI, GRIEVANCE_STATUSES, GRIEVANCE_PRIORITIES } from '../../api/services';
import { LoadingSpinner, ErrorState } from '../../components/StateFeedback';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  FilePlus,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function CitizenDashboard() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch citizen's grievances (DRF pagination returns { count, results, ... } or array)
      const res = await citizenGrievanceAPI.getList({ page_size: 100 });
      const items = res.data?.results ? res.data.results : (Array.isArray(res.data) ? res.data : []);
      setGrievances(items);
    } catch (err) {
      setError(err.message || 'Failed to load citizen grievance data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your grievance dashboard..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  // Compute live summary stats
  const total = grievances.length;
  const submitted = grievances.filter((g) => g.status === 'SUBMITTED').length;
  const underReview = grievances.filter((g) => g.status === 'UNDER_REVIEW').length;
  const inProgress = grievances.filter((g) => g.status === 'IN_PROGRESS').length;
  const resolved = grievances.filter((g) => g.status === 'RESOLVED').length;
  const reopened = grievances.filter((g) => g.status === 'REOPENED').length;

  const recentGrievances = grievances.slice(0, 5);

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
      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f2b48]">Citizen Grievance Desk</h1>
          <p className="text-sm text-slate-600 mt-1">
            Track real-time status, department assignment, and investigation outcomes of your complaints.
          </p>
        </div>
        <Link
          to="/citizen/submit"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d9488] hover:bg-teal-700 text-white font-medium shadow-sm transition-all shrink-0 text-sm"
        >
          <FilePlus className="w-4 h-4" />
          Submit New Grievance
        </Link>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Filed</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-[#0f2b48]">{total}</div>
          <div className="text-[11px] text-slate-400 mt-1">All time complaints</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Submitted</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-700">{submitted}</div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting CMO triage</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">Under Review</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-700">{underReview}</div>
          <div className="text-[11px] text-slate-400 mt-1">Department assigned</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">In Progress</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-700">{inProgress}</div>
          <div className="text-[11px] text-slate-400 mt-1">Officer investigating</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{resolved}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {reopened > 0 ? `${reopened} Reopened` : 'Final closure approved'}
          </div>
        </div>
      </div>

      {/* Recent Grievances Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0f2b48]">Recent Grievances</h2>
            <p className="text-xs text-slate-500 mt-0.5">Your 5 most recently updated grievance filings.</p>
          </div>
          <Link
            to="/citizen/grievances"
            className="text-xs font-semibold text-[#0d9488] hover:text-teal-700 flex items-center gap-1"
          >
            View All ({total}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentGrievances.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">No grievances filed yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              If you have any civic, land, health, or administrative grievances, you can submit them directly to the Chief Minister's Office.
            </p>
            <Link
              to="/citizen/submit"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d9488] text-white text-xs font-semibold hover:bg-teal-700"
            >
              <FilePlus className="w-4 h-4" /> Submit First Grievance
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="py-3 px-4">Reference No.</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date Filed</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentGrievances.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#0f2b48] text-xs">
                      {item.reference_number}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate">
                      {item.subject}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      {item.assigned_department_name ? (
                        <span className="font-medium text-slate-700">{item.assigned_department_name}</span>
                      ) : (
                        <span className="italic text-slate-400">CMO Triage Pending</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">{getPriorityBadge(item.priority)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/citizen/grievances/${item.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0d9488] hover:text-teal-700 hover:underline"
                      >
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

