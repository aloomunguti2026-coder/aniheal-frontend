import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [filterAction, setFilterAction] = useState('ALL');

  const loadLogs = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await api.get('/admin/audit-logs');
      if (res.success) {
        // Backend returns { logs: [...], total, page, pages } or [...]
        const records = res.data?.logs || (Array.isArray(res.data) ? res.data : []);
        setLogs(records);
      } else {
        setErrorMsg(res.message || 'Failed to retrieve audit records.');
        setLogs([]);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
      setErrorMsg(err.message || 'Network error fetching audit logs.');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const logList = Array.isArray(logs) ? logs : [];
  const filteredLogs = logList.filter((log) => {
    if (!log || !log.action) return false;
    if (filterAction === 'ALL') return true;
    return log.action.toUpperCase().includes(filterAction);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-clinical p-6 rounded-2xl border border-border-hairline shadow-sm">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">
            Security &amp; Activity Audit Logs
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Immutable tracking of administrative actions, logins, content changes, and record deletions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle font-label-md text-label-md text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="ALL">All Actions</option>
            <option value="LOGIN">Logins</option>
            <option value="UPDATE">Updates</option>
            <option value="CREATE">Creations</option>
            <option value="DELETE">Deletions</option>
          </select>
          <button
            onClick={loadLogs}
            className="p-2.5 rounded-xl border border-border-hairline hover:bg-surface-tinted transition-colors text-primary cursor-pointer"
            title="Refresh Logs"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-surface-clinical rounded-2xl border border-border-hairline overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border-hairline flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm text-primary font-bold">
            Audit Activity Trail ({filteredLogs.length})
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-on-surface-variant font-body-md">
            <span className="material-symbols-outlined animate-spin text-[32px] text-primary mb-2">
              sync
            </span>
            <p>Loading activity logs...</p>
          </div>
        ) : errorMsg ? (
          <div className="p-12 text-center text-error font-body-md space-y-3">
            <span className="material-symbols-outlined text-[36px] text-error">
              cloud_off
            </span>
            <p className="font-bold">{errorMsg}</p>
            <button
              onClick={loadLogs}
              className="px-5 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-secondary transition-colors cursor-pointer"
            >
              Retry Loading Logs
            </button>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant font-body-md">
            No audit log records found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-md">
              <thead className="bg-surface-subtle text-outline font-label-sm uppercase tracking-wider text-label-sm border-b border-border-hairline">
                <tr>
                  <th className="py-3.5 px-6">Timestamp</th>
                  <th className="py-3.5 px-6">User / Actor</th>
                  <th className="py-3.5 px-6">Action</th>
                  <th className="py-3.5 px-6">Resource</th>
                  <th className="py-3.5 px-6">IP Address</th>
                  <th className="py-3.5 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline font-body-sm">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-surface-tinted/50 transition-colors">
                    <td className="py-4 px-6 text-on-surface-variant whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-bold text-on-surface">
                      <div className="flex flex-col">
                        <span>{log.user?.name || log.userEmail || 'System / Anonymous'}</span>
                        {log.user?.email && (
                          <span className="text-[11px] font-normal text-outline">
                            {log.user.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                          log.action.includes('DELETE')
                            ? 'bg-error-container text-error'
                            : log.action.includes('CREATE') || log.action.includes('LOGIN')
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-surface-tinted text-primary border border-border-accent'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-outline">{log.resource}</td>
                    <td className="py-4 px-6 font-mono text-outline text-[12px]">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {log.details && Object.keys(log.details).length > 0 ? (
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-3 py-1 text-[12px] rounded-lg bg-surface-subtle border border-border-hairline text-primary hover:bg-surface-tinted font-bold transition-colors cursor-pointer"
                        >
                          View Payload
                        </button>
                      ) : (
                        <span className="text-outline text-[12px] italic">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payload Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-clinical rounded-2xl border border-border-hairline shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border-hairline pb-3">
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Audit Payload Details
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 text-on-surface-variant hover:text-primary rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <div className="space-y-2 text-body-sm">
              <div className="grid grid-cols-2 gap-2 p-3 bg-surface-subtle rounded-xl border border-border-hairline text-[13px]">
                <div>
                  <span className="text-outline block text-[11px] uppercase">Action:</span>
                  <span className="font-bold">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="text-outline block text-[11px] uppercase">Resource:</span>
                  <span className="font-bold">{selectedLog.resource}</span>
                </div>
                <div>
                  <span className="text-outline block text-[11px] uppercase">Actor:</span>
                  <span className="font-bold">
                    {selectedLog.user?.name || selectedLog.userEmail || 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-outline block text-[11px] uppercase">Timestamp:</span>
                  <span>{new Date(selectedLog.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span className="block font-label-md text-label-md font-bold text-on-surface mb-1">
                  Metadata &amp; Parameters:
                </span>
                <pre className="p-4 bg-gray-900 text-green-400 font-mono text-xs rounded-xl overflow-x-auto max-h-64 border border-gray-800">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-secondary transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
