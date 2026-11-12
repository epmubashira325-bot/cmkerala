import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  cmoAPI,
  departmentAPI,
  KERALA_DISTRICTS,
  GRIEVANCE_CATEGORIES,
  GRIEVANCE_STATUSES,
  GRIEVANCE_PRIORITIES,
} from '../../api/services';
import { LoadingSpinner, ErrorState, EmptyState } from '../../components/StateFeedback';
import {
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Building,
  RotateCcw,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';

export default function GrievanceRegistry() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || '';

  const [grievances, setGrievances] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Departments for filter
  const [departments, setDepartments] = useState([]);

  // Filter & Pagination States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [districtFilter, setDistrictFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isEscalatedFilter, setIsEscalatedFilter] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    departmentAPI.getAll().then((res) => {
      setDepartments(res.data || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const paramStatus = searchParams.get('status') || '';
    setStatusFilter(paramStatus);
  }, [searchParams]);

  useEffect(() => {
    fetchRegistryGrievances();
  }, [currentPage, statusFilter, districtFilter, categoryFilter, priorityFilter, departmentFilter, isEscalatedFilter, ordering]);

  const fetchRegistryGrievances = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        page_size: pageSize,
        ordering,
      };
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      if (districtFilter) params.district = districtFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (departmentFilter) params.department = departmentFilter;
      if (isEscalatedFilter !== '') params.is_escalated = isEscalatedFilter;

      const res = await cmoAPI.getGrievances(params);

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
      setError(err.message || 'Failed to retrieve state grievance registry.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRegistryGrievances();
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDistrictFilter('');
    setCategoryFilter('');
    setPriorityFilter('');
    setDepartmentFilter('');
    setIsEscalatedFilter('');
    setOrdering('-created_at');
    setCurrentPage(1);
    setSearchParams({});
    setTimeout(() => {
      fetchRegistryGrievances();
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
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f2b48]">State Grievance Registry</h1>
          <p className="text-sm text-slate-600 mt-1">
            Complete database of all citizen grievances filed across Kerala. Search, filter, allocate departments, and inspect audit histories.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
          Total Filings: <span className="font-bold text-[#0f2b48]">{totalCount}</span>
        </div>
      </div>

      {/* Comprehensive Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ref, subject, citizen..."
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
                  if (e.target.value) setSearchParams({ status: e.target.value });
                  else setSearchParams({});
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
                <option value="">All 14 Districts</option>
                {KERALA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.code} - {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
              >
                <option value="">All Categories</option>
                {GRIEVANCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
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
            </div>

            {/* Escalation Filter */}
            <div>
              <select
                value={isEscalatedFilter}
                onChange={(e) => {
                  setIsEscalatedFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
              >
                <option value="">Escalation: All</option>
                <option value="true">Escalated Only</option>
                <option value="false">Standard Only</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-[#0f2b48] text-white rounded-xl text-xs font-semibold hover:bg-[#1b3d63]"
              >
                Apply Filters
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

      {/* Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12">
            <LoadingSpinner message="Filtering state grievance registry..." />
          </div>
        ) : error ? (
          <div className="p-6">
            <ErrorState message={error} onRetry={fetchRegistryGrievances} />
          </div>
        ) : grievances.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No grievances match the filter criteria"
              message="Try widening your search terms, status filters, or district options."
            />
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="py-3.5 px-4">Ref Number</th>
                    <th className="py-3.5 px-4">Citizen</th>
                    <th className="py-3.5 px-4">District</th>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Filed On</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {grievances.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-[#0f2b48]">
                        <div className="flex items-center gap-1.5">
                          {item.reference_number}
                          {item.is_escalated && (
                            <span title="Escalated matter" className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-800">
                        {item.citizen_name || 'Citizen'}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {item.district}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate text-xs">
                        {item.subject}
                      </td>
                      <td className="py-3.5 px-4">{getPriorityBadge(item.priority)}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {item.assigned_department_code ? (
                          <span className="font-semibold text-slate-800">{item.assigned_department_code}</span>
                        ) : (
                          <span className="text-amber-600 font-medium italic">Unallocated</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/cmo/grievances/${item.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0d9488] hover:text-teal-700 hover:underline"
                        >
                          Manage <ChevronRight className="w-3.5 h-3.5" />
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

