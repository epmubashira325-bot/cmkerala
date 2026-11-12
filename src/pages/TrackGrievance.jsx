import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  MapPin, 
  Calendar, 
  Tag, 
  ShieldCheck,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { grievanceAPI } from '../api/services';
import { LoadingSpinner, ErrorState } from '../components/StateFeedback';

export default function TrackGrievance() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [refInput, setRefInput] = useState(searchParams.get('ref') || '');
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTracking = async (referenceNumber) => {
    if (!referenceNumber) return;
    setLoading(true);
    setError(null);
    setGrievance(null);
    try {
      const data = await grievanceAPI.trackByRef(referenceNumber);
      setGrievance(data);
    } catch (err) {
      setError(err.message || 'No grievance record found with this reference number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setRefInput(ref);
      fetchTracking(ref);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanRef = refInput.trim();
    if (cleanRef) {
      setSearchParams({ ref: cleanRef });
      fetchTracking(cleanRef);
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'Submitted' };
      case 'UNDER_REVIEW':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'Under CMO Review' };
      case 'IN_PROGRESS':
        return { bg: 'bg-purple-50 text-purple-700 border-purple-200', text: 'In Progress (Field Investigation)' };
      case 'RESOLVED':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'Resolved & Closed' };
      case 'REOPENED':
        return { bg: 'bg-red-50 text-red-700 border-red-200', text: 'Reopened by Citizen' };
      default:
        return { bg: 'bg-slate-100 text-slate-700 border-slate-200', text: status };
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[#0f2b48] tracking-tight">
          Track Grievance Status
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Verify the real-time processing status of your registered grievance without exposing personal credentials.
        </p>
      </div>

      {/* Tracking Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              placeholder="e.g. CMK-20261112-XXXXXXXX"
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:bg-white uppercase transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#0f2b48] hover:bg-[#1b3d63] disabled:opacity-70 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Track Progress</span>
          </button>
        </form>
      </div>

      {/* Loading state */}
      {loading && <LoadingSpinner message="Querying PostgreSQL grievance tracking registry..." />}

      {/* Error state */}
      {error && (
        <ErrorState
          title="Reference Number Not Found"
          message={error}
          onRetry={() => fetchTracking(refInput)}
        />
      )}

      {/* Active Grievance Details Card */}
      {grievance && !loading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden animate-in fade-in duration-300">
          
          {/* Card Header */}
          <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tracking Reference</span>
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#0f2b48]">
                {grievance.reference_number}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusBadge(grievance.status).bg}`}>
                {getStatusBadge(grievance.status).text}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border ${getPriorityBadge(grievance.priority)}`}>
                {grievance.priority} Priority
              </span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 font-medium">Assigned Department</span>
                  <p className="text-sm font-semibold text-slate-800">
                    {grievance.department_name || 'Pending CMO Triage'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 font-medium">Kerala District</span>
                  <p className="text-sm font-semibold text-slate-800">{grievance.district}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 font-medium">Category</span>
                  <p className="text-sm font-semibold text-slate-800">{grievance.category}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 font-medium">Submission Date</span>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date(grievance.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 font-medium">Target SLA Due Date</span>
                  <p className="text-sm font-semibold text-slate-800">
                    {grievance.due_date ? new Date(grievance.due_date).toLocaleDateString('en-IN') : 'Scheduled during triage'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 font-medium">Last Modified</span>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date(grievance.updated_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

            </div>

            {/* Redressal Workflow Milestone Indicator */}
            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Redressal Lifecycle Milestones
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                  <span className="text-xs font-bold block">1. Submitted</span>
                  <span className="text-[10px] text-emerald-700">Citizen Filed</span>
                </div>

                <div className={`p-3 rounded-lg border ${
                  ['UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED'].includes(grievance.status)
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-bold block">2. Triage & Assign</span>
                  <span className="text-[10px]">CMO Review</span>
                </div>

                <div className={`p-3 rounded-lg border ${
                  ['IN_PROGRESS', 'RESOLVED'].includes(grievance.status)
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-bold block">3. Field Investigation</span>
                  <span className="text-[10px]">Action Report</span>
                </div>

                <div className={`p-3 rounded-lg border ${
                  grievance.status === 'RESOLVED'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-bold block">4. Resolved</span>
                  <span className="text-[10px]">Four-Eyes Approved</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

