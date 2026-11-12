import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  citizenGrievanceAPI,
  aiAPI,
  departmentAPI,
  KERALA_DISTRICTS,
  GRIEVANCE_CATEGORIES,
} from '../../api/services';
import {
  Sparkles,
  Upload,
  AlertCircle,
  CheckCircle2,
  FileText,
  X,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Info
} from 'lucide-react';

export default function SubmitGrievance() {
  const navigate = useNavigate();

  // Form State
  const [district, setDistrict] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [includeAiTriage, setIncludeAiTriage] = useState(true);

  // Departments List (for reference)
  const [departments, setDepartments] = useState([]);

  // AI Triage State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [aiMetadata, setAiMetadata] = useState(null);
  const [aiError, setAiError] = useState(null);

  // Form Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    departmentAPI.getAll().then((res) => {
      setDepartments(res.data || []);
    }).catch(() => {});
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Max 5 attachments, 10MB each
    const validFiles = selectedFiles.filter((f) => f.size <= 10 * 1024 * 1024);
    if (validFiles.length < selectedFiles.length) {
      alert('Some files were ignored because they exceed the 10MB size limit.');
    }
    setAttachments((prev) => [...prev, ...validFiles].slice(0, 5));
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Trigger Gemini AI Live Analysis
  const handleAIAnalyze = async () => {
    setAiError(null);
    setValidationErrors({});

    const errors = {};
    if (!subject || subject.trim().length < 5) {
      errors.subject = 'Subject must be at least 5 characters long for AI analysis.';
    }
    if (!description || description.trim().length < 15) {
      errors.description = 'Please provide a detailed description (minimum 15 characters) so Gemini AI can analyze it.';
    }
    if (!district) {
      errors.district = 'Please select a district.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setAiLoading(true);
    try {
      const res = await aiAPI.analyzeDraft({
        subject: subject.trim(),
        description: description.trim(),
        district,
      });

      if (res.data?.suggestions) {
        setAiSuggestions(res.data.suggestions);
        setAiMetadata(res.data.metadata);

        // Auto-suggest category if not set or if citizen wants to adopt it
        if (!category && res.data.suggestions.suggested_category) {
          setCategory(res.data.suggestions.suggested_category);
        }
      } else {
        setAiError('No triage recommendations could be generated for this description.');
      }
    } catch (err) {
      // Graceful fallback: Never block manual submission
      setAiError(err.message || 'Gemini AI assistant is temporarily unavailable. You may proceed with manual submission without delay.');
    } finally {
      setAiLoading(false);
    }
  };

  // Apply AI Suggested Category
  const applySuggestedCategory = () => {
    if (aiSuggestions?.suggested_category) {
      setCategory(aiSuggestions.suggested_category);
    }
  };

  // Submit Grievance
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setValidationErrors({});

    // Client validation
    const errors = {};
    if (!district) errors.district = 'District is required.';
    if (!category) errors.category = 'Category is required.';
    if (!subject || subject.trim().length < 5) errors.subject = 'Subject must be at least 5 characters.';
    if (!description || description.trim().length < 15) errors.description = 'Description must be at least 15 characters.';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('district', district);
      formData.append('category', category);
      formData.append('subject', subject.trim());
      formData.append('description', description.trim());
      formData.append('include_ai_triage', includeAiTriage ? 'true' : 'false');

      // Append files with exact backend key: 'attachments'
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });

      const res = await citizenGrievanceAPI.create(formData);
      const created = res.data;

      // Navigate to detail view of created grievance
      navigate(`/citizen/grievances/${created.id}`, {
        state: { newReference: created.reference_number }
      });
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit grievance. Please verify all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f2b48]">Lodge a Public Grievance</h1>
        <p className="text-sm text-slate-600 mt-1">
          Submit your complaint directly to the Chief Minister's Grievance Redressal Cell.
          Our integrated Google Gemini AI assistant can analyze your draft to suggest the ideal department and urgency priority.
        </p>
      </div>

      {submitError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>{submitError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Location & Category */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-[#0f2b48] mb-1 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-[#0d9488] text-xs font-mono font-bold flex items-center justify-center">1</span>
            Jurisdiction & Classification
          </h2>
          <p className="text-xs text-slate-500 mb-6">Specify the revenue district and primary nature of the incident.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Revenue District *
              </label>
              <select
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488] ${
                  validationErrors.district ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              >
                <option value="">-- Select District (14 Revenue Districts) --</option>
                {KERALA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {validationErrors.district && (
                <p className="text-xs text-rose-600 mt-1">{validationErrors.district}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Grievance Category *
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488] ${
                  validationErrors.category ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              >
                <option value="">-- Select Category --</option>
                {GRIEVANCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {validationErrors.category && (
                <p className="text-xs text-rose-600 mt-1">{validationErrors.category}</p>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Subject & Detailed Description */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
            <h2 className="text-lg font-bold text-[#0f2b48] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-[#0d9488] text-xs font-mono font-bold flex items-center justify-center">2</span>
              Complaint Details
            </h2>
            {/* AI Analyze Action Button */}
            <button
              type="button"
              onClick={handleAIAnalyze}
              disabled={aiLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-[#0d9488] border border-teal-200 hover:bg-teal-100 transition-colors self-start sm:self-auto disabled:opacity-50"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Analyzing with Gemini 3.6...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Analyze with Gemini AI
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Enter a clear, factual description of the issue. Minimum 15 characters required.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Subject / Title * (min 5 chars)
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Unrepaired drinking water pipeline breach in Ward 4"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#0d9488] ${
                  validationErrors.subject ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {validationErrors.subject && (
                <p className="text-xs text-rose-600 mt-1">{validationErrors.subject}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Detailed Description * (min 15 chars)
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the grievance thoroughly: location, dates, responsible office if known, and impact on the public..."
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#0d9488] ${
                  validationErrors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
                <span>{description.length} characters entered</span>
                {validationErrors.description && (
                  <span className="text-rose-600 font-medium">{validationErrors.description}</span>
                )}
              </div>
            </div>
          </div>

          {/* AI Analysis Result Card */}
          {aiSuggestions && (
            <div className="mt-6 p-5 rounded-2xl bg-teal-50/60 border border-teal-200">
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-teal-100">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0f2b48]">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  Gemini 3.6 Flash Intelligent Recommendations
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-mono">
                  {aiMetadata?.actual_model || 'gemini-3.6-flash'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-teal-100 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Recommended Dept</span>
                  <span className="font-bold text-[#0f2b48]">
                    {aiSuggestions.suggested_department || 'General Administration'}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-teal-100 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Suggested Category</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0f2b48] truncate">{aiSuggestions.suggested_category}</span>
                    {category !== aiSuggestions.suggested_category && (
                      <button
                        type="button"
                        onClick={applySuggestedCategory}
                        className="text-[10px] text-teal-700 font-semibold hover:underline shrink-0 ml-1"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-teal-100 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Assessed Priority</span>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-bold ${
                    aiSuggestions.suggested_priority === 'HIGH' ? 'bg-rose-100 text-rose-800' :
                    aiSuggestions.suggested_priority === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {aiSuggestions.suggested_priority}
                  </span>
                </div>
              </div>

              {aiSuggestions.summary && (
                <div className="bg-white p-3 rounded-xl border border-teal-100 text-xs text-slate-700 mb-2">
                  <span className="font-semibold text-slate-900 block mb-0.5">CMO Triage Summary:</span>
                  {aiSuggestions.summary}
                </div>
              )}

              {aiSuggestions.duplicate_warning && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Similar grievances have been submitted recently in this district. Your filing will be cross-referenced during CMO review.</span>
                </div>
              )}
            </div>
          )}

          {/* AI Failure / Fallback Advisory */}
          {aiError && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">AI Assistant Note: </span>
                {aiError} You can submit your grievance without interruption; human CMO administrators will conduct manual triage.
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Supporting Attachments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-[#0f2b48] mb-1 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-[#0d9488] text-xs font-mono font-bold flex items-center justify-center">3</span>
            Supporting Attachments (Optional)
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Upload photographs, official petitions, or scanned documents supporting your claim (Max 5 files, 10MB each).
          </p>

          <div className="border-2 border-dashed border-slate-300 hover:border-[#0d9488] rounded-2xl p-6 text-center transition-colors">
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm font-semibold text-[#0d9488] hover:underline">
                Click to browse files
              </span>
              <span className="text-xs text-slate-400 mt-1">
                Images (PNG, JPG) or Documents (PDF, DOCX) up to 10MB
              </span>
            </label>
          </div>

          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-xs font-semibold text-slate-700">Attached files ({attachments.length}/5):</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="truncate text-slate-800 font-medium">{file.name}</span>
                      <span className="text-slate-400 shrink-0">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Submission Confirmation */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeAiTriage}
              onChange={(e) => setIncludeAiTriage(e.target.checked)}
              className="mt-1 h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] rounded border-slate-300"
            />
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Enable Automated Gemini AI Triage
              </span>
              <span className="text-[11px] text-slate-500">
                Helps the Chief Minister's Office route your grievance to the correct department faster.
              </span>
            </div>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium bg-[#0f2b48] hover:bg-[#1b3d63] transition-all shadow-sm disabled:opacity-50 text-sm shrink-0"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting Grievance...
              </>
            ) : (
              <>
                Confirm & Submit Grievance <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

