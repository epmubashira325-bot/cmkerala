import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { officerGrievanceAPI, GRIEVANCE_STATUSES, GRIEVANCE_PRIORITIES } from '../../api/services';
import { LoadingSpinner, ErrorState } from '../../components/StateFeedback';
import { useAuth } from '../../context/AuthContext';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  FileCheck2,
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  Building2
} from 'lucide-react';

export default function OfficerDashboard() {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOfficerData();
  }, []);

  const fetchOfficerData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch up to 100 grievances assigned to this officer or department
      const res = await officerGrievanceAPI.getList({ page_size: 100 });
      const items = res.data?.results ? res.data.results : (Array.isArray(res.data) ? res.data : []);
      setGrievances(items);
    } catch (err) {
      setError(err.message || 'Unable to load assigned officer queue.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading assigned grievance queue..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchOfficerData} />;
  }

  // Dynamic statistics computed directly from authorized assignments
  const totalAssigned = grievances.length;
  const newAssignments = grievances.filter((g) => g.status === 'UNDER_REVIEW').length;
  const inProgress = grievances.filter((g) => g.status === 'IN_PROGRESS').length;
  const resolved = grievances.filter((g) => g.status === 'RESOLVED').length;
  const highPriority = grievances.filter((g) => g.priority === 'HIGH' && g.status !== 'RESOLVED').length;

  const recentAssigned = grievances.slice(0, 5);

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
      {/* Officer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 uppercase tracking-wide">
              {user?.department_code || 'DEPT'} Field Office
            </span>
            <span className="text-xs text-slate-400">Jurisdiction Redressal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f2b48]">Officer Redressal Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">
            {user?.department_name || 'Assigned Department'} • Active grievance investigation queue and ATR workflows.
          </p>
        </div>

        <Link
          to="/officer/grievances"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f2b48] hover:bg-[#1b3d63] text-white font-medium shadow-sm transition-all shrink-0 text-sm"
        >
          <ClipboardList className="w-4 h-4 text-teal-300" />
          View All Assignments
        </Link>
      </div>

      {/* Summary KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Assigned</span>
            <ClipboardList className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-[#0f2b48]">{totalAssigned}</div>
          <div className="text-[11px] text-slate-400 mt-1">Department workload</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">New Assignments</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-700">{newAssignments}</div>
          <div className="text-[11px] text-slate-400 mt-1">Under review / unaccepted</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">In Progress</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-700">{inProgress}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active field inquiries</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">High Urgency</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-700">{highPriority}</div>
          <div className="text-[11px] text-slate-400 mt-1">Critical SLA targets</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{resolved}</div>
          <div className="text-[11px] text-slate-400 mt-1">CMO approved closures</div>
        </div>
      </div>

      {/* Recent Assigned Grievances */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0f2b48]">Recent Field Assignments</h2>
            <p className="text-xs text-slate-500 mt-0.5">Assigned complaints requiring investigation or report submission.</p>
          </div>
          <Link
            to="/officer/grievances"
            className="text-xs font-semibold text-[#0d9488] hover:text-teal-700 flex items-center gap-1"
          >
            Open Queue ({totalAssigned}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentAssigned.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">No grievances currently assigned</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Complaints routed to your department by the Chief Minister's Office will appear here for investigation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Target Due Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentAssigned.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#0f2b48] text-xs">
                      {item.reference_number}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate">
                      {item.subject}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      {item.district}
                    </td>
                    <td className="py-3.5 px-4">{getPriorityBadge(item.priority)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">
                      {item.due_date ? (
                        <span className="font-semibold">{item.due_date}</span>
                      ) : (
                        <span className="italic text-slate-400">Standard SLA</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/officer/grievances/${item.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0d9488] hover:text-teal-700 hover:underline"
                      >
                        Investigate <ChevronRight className="w-3.5 h-3.5" />
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

