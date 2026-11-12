import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  citizenGrievanceAPI,
  KERALA_DISTRICTS,
  GRIEVANCE_STATUSES,
  GRIEVANCE_PRIORITIES,
} from '../../api/services';
import { LoadingSpinner, ErrorState, EmptyState } from '../../components/StateFeedback';
import {
  Search,
  Filter,
  FilePlus,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Building,
  RotateCcw
} from 'lucide-react';

export default function MyGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchGrievances();
  }, [currentPage, statusFilter, districtFilter, priorityFilter]);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        page_size: pageSize,
      };
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      if (districtFilter) params.district = districtFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const res = await citizenGrievanceAPI.getList(params);

      if (res.data?.results) {
        setGrievances(res.data.results);
        setTotalCount(res.data.count || 0);
      } else if (Array.isArray(res.data)) {
        setGrievances(res.data);
        setTotalCount(res.data.length);
      } else {
        setGrievances([]);
        setTotalCount(0);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve grievances.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchGrievances();
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDistrictFilter('');
    setPriorityFilter('');
    setCurrentPage(1);
    setTimeout(() => {
      fetchGrievances();
    }, 50);
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f2b48]">My Grievances</h1>
          <p className="text-sm text-slate-600 mt-1">
            Complete record of your submitted grievances, department assignments, and resolution progress.
          </p>
        </div>
        <Link
          to="/citizen/submit"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d9488] hover:bg-teal-700 text-white font-medium shadow-sm transition-all text-sm shrink-0"
        >
          <FilePlus className="w-4 h-4" />
          Submit Grievance
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ref, subject, desc..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
              >
                <option value="">All Statuses</option>
                {GRIEVANCE_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <select
                value={districtFilter}
                onChange={(e) => {
                  setDistrictFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
              >
                <option value="">All Districts</option>
                {KERALA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter & Actions */}
            <div className="flex items-center gap-2">
              <select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
              >
                <option value="">All Priorities</option>
                {GRIEVANCE_PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-3 py-2 bg-[#0f2b48] text-white rounded-xl text-xs font-semibold hover:bg-[#1b3d63] shrink-0"
              >
                Filter
              </button>

              <button
                type="button"
                onClick={resetFilters}
                title="Reset filters"
                className="p-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Grievance Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner message="Filtering grievance filings..." />
          </div>
        ) : error ? (
          <div className="p-6">
            <ErrorState message={error} onRetry={fetchGrievances} />
          </div>
        ) : grievances.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No grievances found"
              message="No records match your selected criteria or search term."
            />
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="py-3.5 px-4">Ref Number</th>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">District</th>
                    <th className="py-3.5 px-4">Assigned Department</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Filed On</th>
                    <th className="py-3.5 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {grievances.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-[#0f2b48]">
                        {item.reference_number}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate">
                        {item.subject}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {item.district}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {item.assigned_department_name ? (
                          <span className="font-semibold text-slate-800">{item.assigned_department_name}</span>
                        ) : (
                          <span className="italic text-slate-400">CMO Allocation</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">{getPriorityBadge(item.priority)}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/citizen/grievances/${item.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0d9488] hover:text-teal-700 hover:underline"
                        >
                          View <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div>
                  Showing Page <span className="font-bold text-slate-800">{currentPage}</span> of{' '}
                  <span className="font-bold text-slate-800">{totalPages}</span> ({totalCount} total entries)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 font-mono font-semibold">{currentPage}</span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

