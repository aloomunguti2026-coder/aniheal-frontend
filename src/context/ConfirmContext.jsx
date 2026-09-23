import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const ConfirmContext = createContext({
  confirm: async () => false,
  alert: async () => {},
});

export function ConfirmProvider({ children }) {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'danger', // 'danger' | 'warning' | 'info' | 'success'
    icon: '',
    isAlert: false,
  });

  const resolverRef = useRef(null);

  const confirm = useCallback(
    ({
      title = 'Confirm Action',
      message = 'Are you sure you want to proceed?',
      confirmText = 'Yes, Proceed',
      cancelText = 'Cancel',
      type = 'danger',
      icon = '',
    }) => {
      return new Promise((resolve) => {
        resolverRef.current = resolve;
        setDialogState({
          isOpen: true,
          title,
          message,
          confirmText,
          cancelText,
          type,
          icon: icon || (type === 'danger' ? 'delete_forever' : type === 'warning' ? 'warning' : 'help'),
          isAlert: false,
        });
      });
    },
    []
  );

  const alert = useCallback(
    ({
      title = 'Notice',
      message = '',
      buttonText = 'OK',
      type = 'info',
      icon = '',
    }) => {
      return new Promise((resolve) => {
        resolverRef.current = resolve;
        setDialogState({
          isOpen: true,
          title,
          message,
          confirmText: buttonText,
          cancelText: '',
          type,
          icon: icon || (type === 'error' || type === 'danger' ? 'error' : type === 'success' ? 'check_circle' : 'info'),
          isAlert: true,
        });
      });
    },
    []
  );

  const handleConfirm = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
  };

  const handleCancel = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm, alert }}>
      {children}

      {/* Modern UI Modal Overlay */}
      {dialogState.isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={dialogState.isAlert ? handleConfirm : handleCancel}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-md bg-surface rounded-2xl p-6 shadow-2xl border border-border-hairline flex flex-col gap-4 text-on-surface select-none transform transition-all animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Icon & Title */}
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  dialogState.type === 'danger'
                    ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:bg-rose-950/40 dark:text-rose-400'
                    : dialogState.type === 'warning'
                    ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:bg-amber-950/40 dark:text-amber-400'
                    : dialogState.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20'
                }`}
              >
                <span className="material-symbols-outlined text-[28px]">
                  {dialogState.icon || (dialogState.type === 'danger' ? 'delete_forever' : 'info')}
                </span>
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="font-headline-md text-lg font-bold text-on-surface leading-snug">
                  {dialogState.title}
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant mt-1.5 leading-relaxed break-words">
                  {dialogState.message}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-border-hairline">
              {!dialogState.isAlert && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2.5 rounded-xl border border-border-hairline bg-surface hover:bg-surface-tinted font-label-md text-sm font-semibold text-on-surface transition-colors cursor-pointer"
                >
                  {dialogState.cancelText}
                </button>
              )}

              <button
                type="button"
                autoFocus
                onClick={handleConfirm}
                className={`px-5 py-2.5 rounded-xl font-label-md text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                  dialogState.type === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                    : dialogState.type === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                    : 'bg-primary hover:bg-primary/90 text-on-primary shadow-primary/20'
                }`}
              >
                <span>{dialogState.confirmText}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}
