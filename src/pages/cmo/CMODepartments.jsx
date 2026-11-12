import React, { useState, useEffect } from 'react';
import { cmoAPI } from '../../api/services';
import { LoadingSpinner, ErrorState } from '../../components/StateFeedback';
import {
  Building2,
  Plus,
  Edit2,
  Users,
  Inbox,
  CheckCircle2,
  XCircle,
  Search,
  X,
  AlertCircle
} from 'lucide-react';

export default function CMODepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Department Modal State (Create or Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await cmoAPI.getDepartments();
      const items = res.data?.results ? res.data.results : (Array.isArray(res.data) ? res.data : []);
      setDepartments(items);
    } catch (err) {
      setError(err.message || 'Unable to load government departments.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingDept(null);
    setFormData({ name: '', code: '', description: '', is_active: true });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      is_active: dept.is_active,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);

    try {
      if (editingDept) {
        await cmoAPI.updateDepartment(editingDept.id, formData);
      } else {
        await cmoAPI.createDepartment(formData);
      }
      setModalOpen(false);
      fetchDepartments();
    } catch (err) {
      setFormError(err.message || 'Failed to save department details.');
    } finally {
      setSaving(false);
    }
  };

  const filteredDepts = departments.filter((d) => {
    const q = search.toLowerCase();
    return d.name?.toLowerCase().includes(q) || d.code?.toLowerCase().includes(q);
  });

  if (loading) {
    return <LoadingSpinner message="Loading government departments..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDepartments} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f2b48]">Department Administration</h1>
          <p className="text-sm text-slate-600 mt-1">
            Maintain government departments, ministries, jurisdiction codes, and officer deployment quotas.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0d9488] hover:bg-teal-700 text-white font-medium text-xs shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by name or code..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDepts.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-black text-[#0d9488] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                  {dept.code}
                </span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  dept.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {dept.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {dept.is_active ? 'Active' : 'Archived'}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#0f2b48] mb-1.5">{dept.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                {dept.description || 'No detailed ministerial description provided.'}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                  <strong>{dept.officer_count || 0}</strong> Officers
                </span>
                <span className="flex items-center gap-1">
                  <Inbox className="w-3.5 h-3.5 text-slate-400" />
                  <strong>{dept.active_grievance_count || 0}</strong> Active Cases
                </span>
              </div>

              <button
                onClick={() => openEditModal(dept)}
                className="p-1.5 text-slate-400 hover:text-[#0f2b48] rounded-lg hover:bg-slate-50"
                title="Edit Department"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Department Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0f2b48]">
                {editingDept ? 'Edit Government Department' : 'Create New Department'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>{formError}</div>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Revenue & Land Records Department"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Unique Code * (e.g. REV, PWD, HFW)
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="REV"
                  maxLength={10}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Description / Jurisdiction Scope
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly state administrative scope, services, or mandates..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="dept-active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-slate-300 text-[#0d9488] focus:ring-[#0d9488]"
                />
                <label htmlFor="dept-active" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Active (Receives Grievance Allocations)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#0f2b48] hover:bg-[#1b3d63] text-white font-bold shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

