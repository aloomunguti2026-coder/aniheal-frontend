import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { notifyContentUpdated } from '../../services/eventBus';

export default function AdminHubs() {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [editingHub, setEditingHub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [formError, setFormError] = useState(null);

  const initialForm = {
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
    zoneDescription: '',
    sortOrder: 0,
    isPublished: true,
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchHubs();
  }, []);

  const fetchHubs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/hubs');
      if (res && res.data) {
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
    setFormData(initialForm);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (hub) => {
    setEditingHub(hub);
    setFormData({
      name: hub.name || '',
      stationType: hub.stationType || 'hub',
      subtitle: hub.subtitle || '',
      address: hub.address || '',
      phone: hub.phone || '+254 700 ANIHEAL',
      leadOfficer: hub.leadOfficer || '',
      coverageAreasText: Array.isArray(hub.coverageAreas) ? hub.coverageAreas.join(', ') : '',
      responseRadiusKm: hub.responseRadiusKm || 100,
      fleetEquipmentText: Array.isArray(hub.fleetEquipment) ? hub.fleetEquipment.join(', ') : '',
      zone: hub.zone || '',
      zoneDescription: hub.zoneDescription || '',
      sortOrder: hub.sortOrder || 0,
      isPublished: hub.isPublished !== false,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete office/station "${name}"?`)) return;
    try {
      const res = await api.delete(`/admin/hubs/${id}`);
      if (res && (res.success || res.status === 200)) {
        setHubs((prev) => prev.filter((h) => h._id !== id));
        setActionSuccess(`Station "${name}" was removed successfully.`);
        notifyContentUpdated({ entity: 'hubs' });
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      alert('Failed to delete hub: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      setFormError('Office/Hub Name and Physical Address are required.');
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      const payload = {
        ...formData,
        responseRadiusKm: Number(formData.responseRadiusKm) || 0,
        sortOrder: Number(formData.sortOrder) || 0,
        coverageAreas: formData.coverageAreasText
          ? formData.coverageAreasText.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        fleetEquipment: formData.fleetEquipmentText
          ? formData.fleetEquipmentText.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (editingHub) {
        const res = await api.put(`/admin/hubs/${editingHub._id}`, payload);
        if (res && res.data) {
          setHubs((prev) =>
            prev.map((h) => (h._id === editingHub._id ? res.data : h))
          );
          setActionSuccess('Office location details updated successfully.');
        }
      } else {
        const res = await api.post('/admin/hubs', payload);
        if (res && res.data) {
          setHubs((prev) => [...prev, res.data]);
          setActionSuccess('New office location added successfully.');
        }
      }

      setIsModalOpen(false);
      notifyContentUpdated({ entity: 'hubs' });
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save office station.');
    } finally {
      setSaving(false);
    }
  };

  const filteredHubs = hubs.filter((h) => {
    const matchesSearch =
      !search.trim() ||
      (h.name && h.name.toLowerCase().includes(search.toLowerCase())) ||
      (h.address && h.address.toLowerCase().includes(search.toLowerCase())) ||
      (h.zone && h.zone.toLowerCase().includes(search.toLowerCase())) ||
      (h.leadOfficer && h.leadOfficer.toLowerCase().includes(search.toLowerCase()));

    const matchesType =
      selectedType === 'All' || h.stationType === selectedType;

    return matchesSearch && matchesType;
  });

  const metrics = {
    total: hubs.length,
    hq: hubs.filter((h) => h.stationType === 'headquarters').length,
    hubs: hubs.filter((h) => h.stationType === 'hub').length,
    stations: hubs.filter((h) => h.stationType === 'station' || h.stationType === 'outpost').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Office Locations &amp; Regional Ambulatory Squads
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Manage practice headquarters, regional clinical hubs, mobile ambulatory stations, and paravet diagnostic units.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary-dark transition-all shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">add_location_alt</span>
          <span>Add Office / Station</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-clinical p-4 rounded-xl border border-border-hairline shadow-2xs">
          <span className="text-xs font-bold text-outline uppercase tracking-wider block">Total Locations</span>
          <p className="text-2xl font-bold text-on-surface mt-1">{metrics.total}</p>
        </div>
        <div className="bg-surface-clinical p-4 rounded-xl border border-border-hairline shadow-2xs">
          <span className="text-xs font-bold text-outline uppercase tracking-wider block">Headquarters</span>
          <p className="text-2xl font-bold text-primary mt-1">{metrics.hq}</p>
        </div>
        <div className="bg-surface-clinical p-4 rounded-xl border border-border-hairline shadow-2xs">
          <span className="text-xs font-bold text-outline uppercase tracking-wider block">Regional Hubs</span>
          <p className="text-2xl font-bold text-secondary mt-1">{metrics.hubs}</p>
        </div>
        <div className="bg-surface-clinical p-4 rounded-xl border border-border-hairline shadow-2xs">
          <span className="text-xs font-bold text-outline uppercase tracking-wider block">Stations &amp; Outposts</span>
          <p className="text-2xl font-bold text-on-surface-variant mt-1">{metrics.stations}</p>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 dark:text-emerald-300">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-surface-clinical p-3 rounded-xl border border-border-hairline">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name, zone, officer, county..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-subtle border border-border-hairline text-sm focus:bg-surface-clinical focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-outline font-semibold shrink-0">Station Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface-subtle border border-border-hairline text-xs font-bold text-on-surface focus:bg-surface-clinical focus:border-primary"
          >
            <option value="All">All Station Types</option>
            <option value="headquarters">Headquarters</option>
            <option value="hub">Ambulatory Hub</option>
            <option value="station">Regional Station</option>
            <option value="outpost">Field Outpost</option>
          </select>
        </div>
      </div>

      {/* Locations Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-on-surface-variant flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold">Loading office locations and ambulatory squads...</span>
          </div>
        ) : filteredHubs.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-surface-clinical rounded-2xl border border-border-hairline p-8 max-w-md mx-auto">
            <span className="material-symbols-outlined text-[48px] text-outline">location_off</span>
            <h3 className="font-bold text-on-surface mt-2">No Office Locations Found</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              No stations match your current search or filter criteria. Click "Add Office / Station" to create one.
            </p>
          </div>
        ) : (
          filteredHubs.map((hub) => (
            <div
              key={hub._id}
              className="bg-surface-clinical rounded-2xl p-5 shadow-sm border border-border-hairline flex flex-col justify-between hover:border-primary/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-label-sm text-[10px] font-bold uppercase tracking-wider ${
                      hub.stationType === 'headquarters'
                        ? 'bg-primary text-on-primary'
                        : hub.stationType === 'hub'
                        ? 'bg-surface-tinted text-primary'
                        : 'bg-surface-subtle text-secondary border border-border-hairline'
                    }`}
                  >
                    {hub.stationType}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(hub)}
                      title="Edit Office Location"
                      className="p-1.5 rounded-lg text-primary hover:bg-surface-tinted transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(hub._id, hub.name)}
                      title="Delete Office Location"
                      className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
                    {hub.zone || 'Regional Zone'}
                  </span>
                  <h3 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                    {hub.name}
                  </h3>
                  {hub.subtitle && (
                    <p className="text-xs font-semibold text-secondary mt-0.5">{hub.subtitle}</p>
                  )}
                </div>

                {hub.zoneDescription && (
                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                    {hub.zoneDescription}
                  </p>
                )}

                <div className="space-y-2 bg-surface-subtle p-3 rounded-xl border border-border-hairline text-xs">
                  <div className="flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                      pin_drop
                    </span>
                    <span className="text-on-surface font-medium">{hub.address}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-border-hairline text-outline">
                    <span>Helpline:</span>
                    <span className="font-bold text-on-surface">{hub.phone || '+254 700 ANIHEAL'}</span>
                  </div>

                  {hub.leadOfficer && (
                    <div className="flex items-center justify-between text-outline">
                      <span>Lead Clinician:</span>
                      <span className="font-semibold text-on-surface">{hub.leadOfficer}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-outline">
                    <span>Response Radius:</span>
                    <span className="font-bold text-primary">{hub.responseRadiusKm || 100} KM</span>
                  </div>
                </div>

                {Array.isArray(hub.coverageAreas) && hub.coverageAreas.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {hub.coverageAreas.map((area, aIdx) => (
                      <span
                        key={aIdx}
                        className="px-2 py-0.5 rounded bg-surface-tinted/60 text-on-surface-variant text-[10px] font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {Array.isArray(hub.fleetEquipment) && hub.fleetEquipment.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border-hairline flex items-center gap-1.5 text-[11px] text-outline">
                  <span className="material-symbols-outlined text-[16px] text-primary shrink-0">
                    medical_information
                  </span>
                  <span className="truncate">{hub.fleetEquipment.join(' • ')}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-clinical rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 border border-border-hairline max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border-hairline mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">location_city</span>
                <h2 className="font-headline-sm font-bold text-on-surface">
                  {editingHub ? 'Edit Office / Ambulatory Station' : 'Add New Office / Station'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-tinted"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/30 text-error text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-bold text-on-surface mb-1">
                  Office / Hub Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline font-bold focus:bg-surface-clinical focus:border-primary"
                  placeholder="e.g., Nakuru & Rift Valley Ambulatory Hub"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">
                    Station Type
                  </label>
                  <select
                    value={formData.stationType}
                    onChange={(e) => setFormData({ ...formData, stationType: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl bg-surface-subtle border border-border-hairline font-semibold focus:bg-surface-clinical focus:border-primary"
                  >
                    <option value="headquarters">Headquarters</option>
                    <option value="hub">Ambulatory Hub</option>
                    <option value="station">Regional Station</option>
                    <option value="outpost">Field Outpost</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">
                    Station Base / Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline focus:bg-surface-clinical focus:border-primary"
                    placeholder="e.g., Nakuru Ambulatory Depot"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">
                    Regional Zone Tag
                  </label>
                  <input
                    type="text"
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline focus:bg-surface-clinical focus:border-primary"
                    placeholder="e.g., Zone 1: Rift Valley Cluster"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">
                    Response Radius (KM)
                  </label>
                  <input
                    type="number"
                    value={formData.responseRadiusKm}
                    onChange={(e) => setFormData({ ...formData, responseRadiusKm: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline focus:bg-surface-clinical focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">
                  Physical Office Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline focus:bg-surface-clinical focus:border-primary"
                  placeholder="Street / Facility / City (e.g. George Morara Rd, Industrial Area, Nakuru)"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">
                  Zone Description &amp; Paravet Squad Profile
                </label>
                <textarea
                  rows={2}
                  value={formData.zoneDescription}
                  onChange={(e) => setFormData({ ...formData, zoneDescription: e.target.value })}
                  className="w-full p-3 rounded-xl bg-surface-subtle border border-border-hairline focus:bg-surface-clinical focus:border-primary"
                  placeholder="e.g., Coordinated by 6 Lead Paravets and 3 Veterinary Surgeons specializing in intensive dairy cattle..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">
                    Contact Helpline / Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline focus:bg-surface-clinical focus:border-primary"
                    placeholder="+254 700 ANIHEAL"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">
                    Lead Clinician / Officer
                  </label>
                  <input
                    type="text"
                    value={formData.leadOfficer}
                    onChange={(e) => setFormData({ ...formData, leadOfficer: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline focus:bg-surface-clinical focus:border-primary"
                    placeholder="e.g., Dr. Dennis Kipchumba"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">
                  Coverage Counties / Areas (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.coverageAreasText}
                  onChange={(e) => setFormData({ ...formData, coverageAreasText: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline focus:bg-surface-clinical focus:border-primary"
                  placeholder="e.g., Nakuru, Uasin Gishu, Trans-Nzoia"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">
                  Fleet &amp; Diagnostics Equipment (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.fleetEquipmentText}
                  onChange={(e) => setFormData({ ...formData, fleetEquipmentText: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline focus:bg-surface-clinical focus:border-primary"
                  placeholder="e.g., Portable Sonar, Cryo-Tank, 4x4 Treatment Rig"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-hairline">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-border-hairline text-on-surface font-semibold hover:bg-surface-tinted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold shadow-sm hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingHub ? 'Update Location' : 'Save Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
