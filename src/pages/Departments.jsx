import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';
import { departmentAPI } from '../api/services';
import { LoadingSpinner, ErrorState, EmptyState } from '../components/StateFeedback';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentAPI.getAll();
      setDepartments(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message || 'Unable to load government departments from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filteredDepartments = departments.filter((dept) => {
    const q = searchQuery.toLowerCase();
    return (
      dept.name.toLowerCase().includes(q) ||
      dept.code.toLowerCase().includes(q) ||
      (dept.description && dept.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-md border border-teal-200">
          Government of Kerala
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f2b48] tracking-tight">
          Participating Departments & Portfolios
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Active administrative departments integrated with the CM Public Grievance Redressal System for complaint investigation and resolution.
        </p>
      </div>

      {/* Search Input Filter */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by department name or code (e.g., PWD, REV)..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-600 shadow-xs transition-all"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner message="Querying active departments from PostgreSQL..." />}

      {/* Error State */}
      {error && (
        <ErrorState
          title="Departments Feed Unavailable"
          message={error}
          onRetry={fetchDepartments}
        />
      )}

      {/* Department Cards Grid */}
      {!loading && !error && (
        <>
          {filteredDepartments.length === 0 ? (
            <EmptyState
              title="No Matching Departments"
              message={`No active departments matched "${searchQuery}". Please check your search term.`}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDepartments.map((dept) => (
                <div
                  key={dept.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-slate-100 text-[#0f2b48] border border-slate-200">
                        {dept.code}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#0f2b48] mb-1.5">{dept.name}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {dept.description || 'Responsible for departmental public grievances, citizen charter commitments, and field grievance investigation.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 font-medium text-slate-600">
                      <Users className="w-4 h-4 text-teal-600" />
                      <span>{dept.officer_count ?? 1} Designated Officers</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-teal-700 font-semibold">
                      <span>Active</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}

