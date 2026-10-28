import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectToast, clearToast } from '../../store/slices/uiSlice';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const dispatch = useDispatch();
  const toast = useSelector(selectToast);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      dispatch(clearToast());
    }, 3200);

    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
  };

  return (
    <div className="fixed bottom-28 right-6 z-50 animate-slide-up flex items-center gap-3 px-4 py-3 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl text-white max-w-md">
      {icons[toast.type] || icons.info}
      <p className="text-sm font-medium pr-2 text-slate-100">{toast.message}</p>
      <button
        onClick={() => dispatch(clearToast())}
        className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors ml-auto"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;

