import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Status update modal state
  const [newStatus, setNewStatus] = useState('pending');
  const [assignedOfficer, setAssignedOfficer] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [filterStatus]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setFetchError('');
      const url = filterStatus === 'all' ? '/appointments' : `/appointments?status=${filterStatus}`;
      const res = await api.get(url);
      if (res.success && res.data?.appointments) {
        setAppointments(res.data.appointments);
        setFetchError('');
      } else {
        setFetchError('Failed to load appointments from server.');
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
      setFetchError('Unable to connect to the backend server. Please verify the API is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status || 'pending');
    setAssignedOfficer(ticket.assignedOfficer || '');
    setClinicalNotes(ticket.clinicalNotes || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setUpdating(true);

    try {
      const res = await api.patch(`/appointments/${selectedTicket._id}/status`, {
        status: newStatus,
        assignedOfficer,
        clinicalNotes,
      });

      if (res.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === selectedTicket._id ? res.data : a))
        );
        setSelectedTicket(null);
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id, ref) => {
    if (!window.confirm(`Delete triage ticket #${ref}?`)) return;
    try {
      const res = await api.delete(`/appointments/${id}`);
      if (res.success) {
        setAppointments((prev) => prev.filter((a) => a._id !== id));
      }
    } catch (err) {
      alert('Failed to delete ticket: ' + err.message);
    }
  };

  const filterTabs = [
    { id: 'all', label: 'All Tickets' },
    { id: 'pending', label: 'Pending Triage' },
    { id: 'contacted', label: 'Farmer Contacted' },
    { id: 'dispatched', label: 'Unit Dispatched' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">
            Farmer Triage &amp; Appointment Desk
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Live queue of on-farm clinical requests, emergency triage alerts, and mobile unit dispatch.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
              filterStatus === tab.id
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'bg-surface-clinical text-on-surface-variant hover:bg-surface-tinted hover:text-primary border border-border-hairline'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tickets Table */}
      <div className="bg-surface-clinical rounded-2xl shadow-sm border border-border-hairline overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-subtle border-b border-border-hairline text-on-surface-variant font-label-sm text-label-sm uppercase">
              <tr>
                <th className="py-3.5 px-4">Ticket Ref</th>
                <th className="py-3.5 px-4">Date / Urgency</th>
                <th className="py-3.5 px-4">Farmer / Farm</th>
                <th className="py-3.5 px-4">County / Location</th>
                <th className="py-3.5 px-4">Species / Cases</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-on-surface-variant">
                    Loading triage tickets...
                  </td>
                </tr>
              ) : fetchError ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-error">
                      <span className="material-symbols-outlined text-[32px]">cloud_off</span>
                      <span className="font-bold text-body-md">{fetchError}</span>
                      <button
                        type="button"
                        onClick={fetchAppointments}
                        className="mt-2 px-5 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-secondary transition-colors cursor-pointer"
                      >
                        Retry Connection
                      </button>
                    </div>
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-on-surface-variant">
                    No triage tickets in this category.
                  </td>
                </tr>
              ) : (
                appointments.map((app) => (
                  <tr key={app._id} className="hover:bg-surface-subtle/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-primary text-xs">
                      {app.ticketRef}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-on-surface">
                        {app.preferredDate || new Date(app.createdAt).toLocaleDateString()}
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          app.dispatchTier === 'emergency'
                            ? 'bg-error text-on-error'
                            : 'bg-surface-tinted text-primary'
                        }`}
                      >
                        {app.dispatchTier}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-on-surface">{app.farmerName}</div>
                      <div className="text-xs text-outline">{app.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="capitalize font-semibold text-on-surface">{app.county}</div>
                      <div className="text-xs text-outline truncate max-w-[120px]">{app.farmName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="capitalize font-semibold">{app.speciesType}</div>
                      <div className="text-xs text-error font-bold">{app.affectedCount} symptomatic</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-on-surface-variant max-w-[120px] truncate">
                      {app.clinicalService}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                          app.status === 'pending'
                            ? 'bg-error-container text-error'
                            : app.status === 'dispatched'
                            ? 'bg-secondary-container text-on-secondary-container'
                            : app.status === 'contacted'
                            ? 'bg-surface-container text-primary font-bold'
                            : 'bg-surface-tinted text-primary'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenDetails(app)}
                          className="px-3 py-1 rounded-lg bg-surface-tinted text-primary hover:bg-secondary-container font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Review &amp; Update
                        </button>
                        <button
                          onClick={() => handleDelete(app._id, app.ticketRef)}
                          className="p-1 rounded text-error hover:bg-error-container/40 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details & Action Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface-clinical rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-border-hairline max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border-hairline mb-4">
              <div>
                <span className="font-label-sm text-label-sm text-primary font-bold uppercase">
                  Triage Case File
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  Ticket #{selectedTicket.ticketRef}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded text-on-surface-variant hover:bg-surface-tinted"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <div className="space-y-4 text-body-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-surface-subtle border border-border-hairline">
                <div>
                  <span className="text-outline text-xs block">Farmer:</span>
                  <span className="font-bold text-on-surface">{selectedTicket.farmerName}</span>
                </div>
                <div>
                  <span className="text-outline text-xs block">Phone:</span>
                  <a href={`tel:${selectedTicket.phone}`} className="font-bold text-primary underline">
                    {selectedTicket.phone}
                  </a>
                </div>
                <div>
                  <span className="text-outline text-xs block">County:</span>
                  <span className="font-bold text-on-surface capitalize">{selectedTicket.county}</span>
                </div>
                <div>
                  <span className="text-outline text-xs block">Farm Name:</span>
                  <span className="font-semibold text-on-surface">{selectedTicket.farmName}</span>
                </div>
                <div>
                  <span className="text-outline text-xs block">Species &amp; Count:</span>
                  <span className="font-semibold text-on-surface capitalize">
                    {selectedTicket.speciesType} ({selectedTicket.totalHeadcount} total)
                  </span>
                </div>
                <div>
                  <span className="text-outline text-xs block">Urgency Tier:</span>
                  <span className="font-bold text-error uppercase">{selectedTicket.dispatchTier}</span>
                </div>
              </div>

              {selectedTicket.landmarks && (
                <div className="p-3 bg-surface-tinted rounded-lg border border-border-accent text-xs">
                  <strong>Navigational Landmarks / GPS:</strong> {selectedTicket.landmarks}
                </div>
              )}

              <div>
                <label className="font-bold text-on-surface block mb-1">
                  Reported Clinical Symptoms:
                </label>
                <div className="p-3 rounded-xl bg-surface-subtle border border-border-hairline whitespace-pre-wrap leading-relaxed">
                  {selectedTicket.symptomsDescription}
                </div>
              </div>

              {/* Direct WhatsApp Callout Button */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${selectedTicket.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                    selectedTicket.farmerName
                  )},%20this%20is%20AniHeal%20Veterinary%20Ambulatory%20Dispatch%20regarding%20ticket%20%23${
                    selectedTicket.ticketRef
                  }.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 rounded-full bg-[#25D366] text-white font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-sm hover:brightness-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>Contact Farmer on WhatsApp Directly</span>
                </a>
              </div>

              {/* Action Form */}
              <form onSubmit={handleUpdateStatus} className="pt-4 border-t border-border-hairline space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                      Update Ticket Status *
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="contacted">Farmer Contacted</option>
                      <option value="dispatched">Ambulatory Unit Dispatched</option>
                      <option value="completed">Field Case Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                      Assigned Veterinary Officer
                    </label>
                    <input
                      type="text"
                      value={assignedOfficer}
                      onChange={(e) => setAssignedOfficer(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                      placeholder="e.g. Dr. Dennis Kipchumba"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Internal Clinical Triage Notes
                  </label>
                  <textarea
                    rows="2"
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="w-full p-3 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                    placeholder="Diagnosis, assigned medicines, follow-up schedule..."
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="px-5 py-2.5 rounded-full text-on-surface-variant font-semibold"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-7 py-2.5 rounded-full bg-primary text-on-primary font-bold shadow-sm hover:bg-primary-container cursor-pointer"
                  >
                    {updating ? 'Updating...' : 'Save & Update Ticket'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
