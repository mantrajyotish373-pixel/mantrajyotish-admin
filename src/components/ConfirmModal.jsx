import React from 'react';
import { AlertCircle, CheckCircle2, XCircle, Info, HelpCircle, X } from 'lucide-react';

/**
 * Custom UI-friendly modal popup to replace native browser window.alert and window.confirm
 */
export default function ConfirmModal({
  isOpen,
  title,
  message,
  type = 'confirm', // 'confirm' | 'success' | 'danger' | 'info' | 'warning'
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  showCancel = true,
  isLoading = false
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center mb-4 shadow-sm animate-scaleIn">
            <CheckCircle2 size={30} />
          </div>
        );
      case 'danger':
        return (
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 text-red-500 flex items-center justify-center mb-4 shadow-sm animate-scaleIn">
            <XCircle size={30} />
          </div>
        );
      case 'warning':
        return (
          <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-100 text-amber-500 flex items-center justify-center mb-4 shadow-sm animate-scaleIn">
            <AlertCircle size={30} />
          </div>
        );
      case 'info':
        return (
          <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 text-blue-500 flex items-center justify-center mb-4 shadow-sm animate-scaleIn">
            <Info size={30} />
          </div>
        );
      default:
        return (
          <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-100 text-[#FA5A24] flex items-center justify-center mb-4 shadow-sm animate-scaleIn">
            <HelpCircle size={30} />
          </div>
        );
    }
  };

  const getConfirmButtonStyles = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-red-500/20';
      case 'success':
        return 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white shadow-emerald-500/20';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-amber-500/20';
      default:
        return 'bg-[#FA5A24] hover:bg-orange-600 active:bg-orange-700 text-white shadow-orange-500/20';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 backdrop-blur-[6px] p-4 transition-all duration-300 animate-fadeIn"
      onClick={onCancel || onConfirm}
    >
      <div 
        className="bg-white w-full max-w-[420px] rounded-3xl p-6 shadow-2xl border border-slate-100/80 flex flex-col items-center text-center relative animate-scaleUp overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onCancel || onConfirm}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Dynamic Icon Header */}
        {getIcon()}

        {/* Title */}
        {title && (
          <h3 
            className="text-xl font-bold text-slate-850 tracking-tight" 
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {title}
          </h3>
        )}

        {/* Message */}
        <p className="text-slate-500 text-sm font-medium leading-relaxed mt-2 mb-6 max-w-[320px]">
          {message}
        </p>

        {/* Actions Button Row */}
        <div className="flex items-center gap-3 w-full">
          {showCancel && (
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 py-3 px-4 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-all duration-200 cursor-pointer text-center disabled:opacity-50"
            >
              {cancelText}
            </button>
          )}

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 px-4 text-xs font-bold rounded-xl shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 ${getConfirmButtonStyles()}`}
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
