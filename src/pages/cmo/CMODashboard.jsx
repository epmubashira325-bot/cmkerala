import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cmoAPI, GRIEVANCE_STATUSES, GRIEVANCE_PRIORITIES } from '../../api/services';
import { LoadingSpinner, ErrorState } from '../../components/StateFeedback';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function CMODashboard() {
  const [stats, setStats] = useState(null);
  const [recentGrievances, setRecentGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardAnalytics();
  }, []);

  const fetchDashboardAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Concurrent fetch: aggregated stats + recent grievance queue
      const [statsRes, grievancesRes] = await Promise.all([
        cmoAPI.getStats(),
        cmoAPI.getGrievances({ page_size: 5, ordering: '-created_at' })
      ]);

      setStats(statsRes.data);
      const items = grievancesRes.data?.results ? grievancesRes.data.results : (Array.isArray(grievancesRes.data) ? grievancesRes.data : []);
      setRecentGrievances(items);
    } catch (err) {
      setError(err.message || 'Unable to retrieve CMO dashboard analytics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Generating real-time CMO executive analytics..." />;
  }

  if (error || !stats) {
    return <ErrorState message={error || 'Failed to load executive statistics.'} onRetry={fetchDashboardAnalytics} />;
  }

  const { overview, priority_distribution, district_distribution, department_distribution } = stats;

  // Chart data mappings
  const priorityChartData = Object.entries(priority_distribution || {}).map(([key, val]) => ({
    name: key,
    count: val,
  }));

  const statusChartData = [
    { name: 'Submitted', count: overview.submitted, color: '#3b82f6' },
    { name: 'Under Review', count: overview.under_review, color: '#f59e0b' },
    { name: 'In Progress', count: overview.in_progress, color: '#6366f1' },
    { name: 'Resolved', count: overview.resolved, color: '#10b981' },
    { name: 'Reopened', count: overview.reopened, color: '#a855f7' },
  ].filter((item) => item.count > 0);

  // Top 7 districts with grievances
  const districtChartData = (district_distribution || []).slice(0, 8);

  // Department distribution
  const deptChartData = (department_distribution || []).slice(0, 6).map((d) => ({
    name: d.code || d.name,
    total: d.total_grievances,
    pending: d.pending_grievances,
    resolved: d.resolved_grievances,
  }));

  const PRIORITY_COLORS = {
    LOW: '#94a3b8',
    MEDIUM: '#f59e0b',
    HIGH: '#f43f5e',
  };

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
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#0f2b48] text-teal-300 uppercase tracking-wide">
              CMO Executive Redressal Cell
            </span>
            <span className="text-xs text-slate-400">Live Secretariat Data</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f2b48]">State Grievance Analytics</h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time multi-tier administrative surveillance across all 14 revenue districts and government ministries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardAnalytics}
            className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0"
            title="Refresh statistics"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Refresh
          </button>
          <Link
            to="/cmo/grievances"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0d9488] hover:bg-teal-700 text-white font-medium shadow-sm transition-all shrink-0 text-xs"
          >
            <Inbox className="w-4 h-4" />
            Registry ({overview.total_grievances})
          </Link>
        </div>
      </div>

      {/* SLA Alert Banners (if overdue/escalated exist) */}
      {(overview.overdue > 0 || overview.escalated > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overview.overdue > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <div className="font-bold text-sm">{overview.overdue} Overdue Grievance(s)</div>
                  <div className="text-xs text-rose-700">Resolution SLA breached. Department intervention required.</div>
                </div>
              </div>
              <Link
                to="/cmo/grievances"
                className="text-xs font-bold text-rose-800 hover:underline px-3 py-1.5 bg-rose-100 rounded-lg shrink-0"
              >
                Review
              </Link>
            </div>
          )}
          {overview.escalated > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <div className="font-bold text-sm">{overview.escalated} Escalated Matter(s)</div>
                  <div className="text-xs text-amber-700">Flagged for direct Chief Minister's secretariat review.</div>
                </div>
              </div>
              <Link
                to="/cmo/grievances"
                className="text-xs font-bold text-amber-800 hover:underline px-3 py-1.5 bg-amber-100 rounded-lg shrink-0"
              >
                Inspect
              </Link>
            </div>
          )}
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Total Lodged</div>
          <div className="text-2xl font-black text-[#0f2b48]">{overview.total_grievances}</div>
          <div className="text-[10px] text-slate-400 mt-1">Statewide records</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 mb-1">New Submissions</div>
          <div className="text-2xl font-black text-blue-700">{overview.submitted}</div>
          <div className="text-[10px] text-slate-400 mt-1">Awaiting triage</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 mb-1">Under Review</div>
          <div className="text-2xl font-black text-amber-700">{overview.under_review}</div>
          <div className="text-[10px] text-slate-400 mt-1">Dept allocated</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 mb-1">In Progress</div>
          <div className="text-2xl font-black text-indigo-700">{overview.in_progress}</div>
          <div className="text-[10px] text-slate-400 mt-1">Officer inquiry</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 mb-1">Resolved</div>
          <div className="text-2xl font-black text-emerald-700">{overview.resolved}</div>
          <div className="text-[10px] text-slate-400 mt-1">CMO approved</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-purple-600 mb-1">Reopened</div>
          <div className="text-2xl font-black text-purple-700">{overview.reopened}</div>
          <div className="text-[10px] text-slate-400 mt-1">Citizen appeal</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District Distribution Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#0f2b48]">District Workload Distribution</h2>
              <p className="text-xs text-slate-500">Grievances filed per revenue district</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">14 Districts</span>
          </div>

          <div className="h-64 w-full">
            {districtChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="district"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', borderColor: '#e2e8f0' }}
                  />
                  <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} name="Complaints" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No district filings recorded.
              </div>
            )}
          </div>
        </div>

        {/* Status Breakdown Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#0f2b48]">Status Lifecycle Composition</h2>
              <p className="text-xs text-slate-500">Live proportion of grievance stages</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">Real-time</span>
          </div>

          <div className="h-64 w-full">
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', borderColor: '#e2e8f0' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No status lifecycle data recorded.
              </div>
            )}
          </div>
        </div>

        {/* Department Distribution Stacked Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#0f2b48]">Department Caseload Breakdown</h2>
              <p className="text-xs text-slate-500">Pending vs. Resolved cases by government ministry</p>
            </div>
            <Link to="/cmo/departments" className="text-xs font-semibold text-[#0d9488] hover:underline">
              All Depts →
            </Link>
          </div>

          <div className="h-64 w-full">
            {deptChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', borderColor: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
                  <Bar dataKey="resolved" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No department caseloads registered.
              </div>
            )}
          </div>
        </div>

        {/* Priority Urgency Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#0f2b48]">Priority Severity Breakdown</h2>
              <p className="text-xs text-slate-500">Complaints stratified by urgency level</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">Triage</span>
          </div>

          <div className="h-64 w-full">
            {priorityChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', borderColor: '#e2e8f0' }}
                  />
                  <Bar dataKey="count" name="Grievances" radius={[4, 4, 0, 0]}>
                    {priorityChartData.map((entry, index) => (
                      <Cell key={`p-${index}`} fill={PRIORITY_COLORS[entry.name] || '#0f2b48'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No priority records available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Submissions Triage Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0f2b48]">Recent Grievance Submissions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Complaints filed by citizens requiring triage and department allocation.</p>
          </div>
          <Link
            to="/cmo/grievances"
            className="text-xs font-semibold text-[#0d9488] hover:text-teal-700 flex items-center gap-1"
          >
            Open Registry ({overview.total_grievances}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentGrievances.length === 0 ? (
          <div className="py-12 px-4 text-center text-xs text-slate-400">
            No grievance records currently available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="py-3.5 px-4">Ref Number</th>
                  <th className="py-3.5 px-4">Citizen</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">District</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Dept</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentGrievances.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-[#0f2b48]">
                      {item.reference_number}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-800">
                      {item.citizen_name || 'Citizen'}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate text-xs">
                      {item.subject}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      {item.district}
                    </td>
                    <td className="py-3.5 px-4">{getPriorityBadge(item.priority)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {item.assigned_department_name ? (
                        <span className="font-semibold text-slate-800">{item.assigned_department_name}</span>
                      ) : (
                        <span className="text-amber-600 font-semibold italic">Triage Pending</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/cmo/grievances/${item.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0d9488] hover:text-teal-700 hover:underline"
                      >
                        Triage <ChevronRight className="w-3.5 h-3.5" />
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

