import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { notifyContentUpdated } from '../../services/eventBus';

export default function AdminHubs() {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHub, setEditingHub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    stationType: 'hub',
    subtitle: '',
    address: '',
    phone: '+254 700 ANIHEAL',
    leadOfficer: '',
    coverageAreasText: '',
    responseRadiusKm: 100,
    fleetEquipmentText: '',
    zone: 'Zone 1: Rift Valley Cluster',
  });

  useEffect(() => {
    fetchHubs();
  }, []);

  const fetchHubs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/hubs');
      if (res.success) {
        setHubs(res.data);
      }
    } catch (err) {
      console.error('Failed to load hubs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingHub(null);
    setFormData({
      name: '',
      stationType: 'station',
      subtitle: 'Ambulatory Dispatch Unit',
      address: '',
      phone: '+254 700 ANIHEAL',
      leadOfficer: 'Dr. Officer',
      coverageAreasText: 'County Central, County North',
      responseRadiusKm: 90,
      fleetEquipmentText: '4x4 Treatment Rig, Mobile Sonar, Cryo-Box',
      zone: 'Zone 2: Central Highlands',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (hub) => {
    setEditingHub(hub);
    setFormData({
      name: hub.name || '',
      stationType: hub.stationType || 'hub',
      subtitle: hub.subtitle || '',
      address: hub.address || '',
      phone: hub.phone || '',
      leadOfficer: hub.leadOfficer || '',
      coverageAreasText: Array.isArray(hub.coverageAreas) ? hub.coverageAreas.join(', ') : '',
      responseRadiusKm: hub.responseRadiusKm || 100,
      fleetEquipmentText: Array.isArray(hub.fleetEquipment) ? hub.fleetEquipment.join(', ') : '',
      zone: hub.zone || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete station "${name}"?`)) return;
    try {
      const res = await api.delete(`/admin/hubs/${id}`);
      if (res.success) {
        setHubs((prev) => prev.filter((h) => h._id !== id));
        notifyContentUpdated();
      }
    } catch (err) {
      alert('Failed to delete hub: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      responseRadiusKm: Number(formData.responseRadiusKm),
      coverageAreas: formData.coverageAreasText.split(',').map((s) => s.trim()).filter(Boolean),
      fleetEquipment: formData.fleetEquipmentText.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingHub) {
        const res = await api.put(`/admin/hubs/${editingHub._id}`, payload);
        if (res.success) {
          setHubs((prev) =>
            prev.map((h) => (h._id === editingHub._id ? res.data : h))
          );
          setIsModalOpen(false);
          notifyContentUpdated();
        }
      } else {
        const res = await api.post('/admin/hubs', payload);
        if (res.success) {
          setHubs((prev) => [...prev, res.data]);
          setIsModalOpen(false);
          notifyContentUpdated();
        }
      }
    } catch (err) {
      alert('Failed to save hub: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">
            Regional Ambulatory Stations &amp; Hubs
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage dispatch depots, response radii, station leads, and mobile medical equipment.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-sm hover:bg-primary-container transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">add_location_alt</span>
          <span>Add Regional Hub</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-on-surface-variant">
            Loading stations...
          </div>
        ) : hubs.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-on-surface-variant">
            No regional stations found.
          </div>
        ) : (
          hubs.map((hub) => (
            <div
              key={hub._id}
              className="bg-surface-clinical rounded-2xl p-5 shadow-sm border border-border-hairline flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-tinted text-primary font-label-sm text-xs font-bold uppercase">
                    {hub.stationType}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(hub)}
                      className="p-1 rounded text-primary hover:bg-surface-tinted"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(hub._id, hub.name)}
                      className="p-1 rounded text-error hover:bg-error-container/40"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {hub.name}
                </h3>
                <p className="text-xs text-secondary font-semibold mb-3">
                  {hub.subtitle}
                </p>

                <p className="text-body-sm text-on-surface-variant flex items-start gap-1.5 mb-3">
                  <span className="material-symbols-outlined text-primary text-[18px] shrink-0">pin_drop</span>
                  <span>{hub.address}</span>
                </p>

                <div className="space-y-1.5 text-xs bg-surface-subtle p-3 rounded-xl border border-border-hairline mb-3">
                  <div className="flex justify-between">
                    <span className="text-outline">Lead Officer:</span>
                    <span className="font-semibold text-on-surface">{hub.leadOfficer || 'Dispatch Officer'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Response Radius:</span>
                    <span className="font-semibold text-primary">{hub.responseRadiusKm} KM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Phone:</span>
                    <span className="font-semibold text-on-surface">{hub.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-outline flex items-center justify-between border-t border-border-hairline">
                <span>{hub.zone}</span>
                <span>{hub.coverageAreas?.length || 0} Areas</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-clinical rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-border-hairline max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border-hairline mb-4">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                {editingHub ? 'Edit Ambulatory Station' : 'Add Ambulatory Station'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-on-surface-variant hover:bg-surface-tinted"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  Hub / Station Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary"
                  placeholder="e.g. Nakuru & Rift Valley Ambulatory Hub"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Station Type
                  </label>
                  <select
                    value={formData.stationType}
                    onChange={(e) => setFormData({ ...formData, stationType: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                  >
                    <option value="headquarters">Headquarters</option>
                    <option value="hub">Ambulatory Hub</option>
                    <option value="station">Regional Station</option>
                    <option value="outpost">Field Outpost</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Max Radius (KM)
                  </label>
                  <input
                    type="number"
                    value={formData.responseRadiusKm}
                    onChange={(e) => setFormData({ ...formData, responseRadiusKm: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  Physical Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                  placeholder="Street / Facility / City"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Lead Officer
                  </label>
                  <input
                    type="text"
                    value={formData.leadOfficer}
                    onChange={(e) => setFormData({ ...formData, leadOfficer: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  Coverage Areas (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.coverageAreasText}
                  onChange={(e) => setFormData({ ...formData, coverageAreasText: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                  placeholder="Naivasha, Rongai, Njoro, Gilgil"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-hairline">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-on-surface-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-2.5 rounded-full bg-primary text-on-primary font-bold shadow-sm hover:bg-primary-container"
                >
                  {saving ? 'Saving...' : 'Save Station'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
