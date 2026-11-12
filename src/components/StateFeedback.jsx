import React from 'react';
import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react';

export function LoadingSpinner({ message = 'Loading government records...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Loader2 className="w-10 h-10 text-[#0d9488] animate-spin mb-4" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}

export function ErrorState({ title = 'Unable to Load Data', message, onRetry }) {
  return (
    <div className="bg-red-50/80 border border-red-200 rounded-xl p-8 text-center max-w-xl mx-auto my-8">
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-red-900 mb-2">{title}</h3>
      <p className="text-sm text-red-700 leading-relaxed mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}

export function EmptyState({ 
  title = 'No Records Found', 
  message = 'There are no active records available at this moment.',
  action 
}) {
  return (
    <div className="border border-dashed border-slate-300 rounded-xl p-12 text-center max-w-md mx-auto my-8 bg-slate-50/50">
      <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 mb-6">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

