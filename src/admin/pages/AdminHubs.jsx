import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { notifyContentUpdated } from '../../services/eventBus';
import { useConfirm } from '../../context/ConfirmContext';

export default function AdminHubs() {
  const { confirm, alert: showAlert } = useConfirm();
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [editingHub, setEditingHub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [formError, setFormError] = useState(null);

  const defaultFleet = {
    title: 'Ambulatory Fleet In Action',
    badge: 'Cold Chain + Ultrasound Equipped',
    items: [
      {
        name: 'Mobile Lab Fleet #3',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdMipf_wHgAU1jJHBgzZ-6Av_FOWhaYTe_R9-pUVcedYopdfsqz05h2pLUvunESqUTs5qQ7PE4qFASeBGVWfVSZvspJFb4JPAt5kk3WO0D9tu2HlST18cJ3ygPKcaYjKN3hJrJ8lyFMrr5ozKgdT1YM4lsEa7ZpWUMDO1_Y_AY42lHfrKIfvOn6JZx30CnGUq2rCrWC_AYy4ozTsbtvRFnM5Bb1gl2r4BcFoGaHWLvSF3AtJW7KU2B',
      },
      {
        name: 'Rift Valley Herd Triage',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuKHTURKZQOaYcfibAeMONBddKmwPREFD5iGH_CqqzH9tQiNalVh80yYdaD0v6ZSKMqKPTXd_0lYTdqHA5_Cwdky_5a9BRoHxuJSzbVZM74updOwNHCc1AXfrfkW8MxahBdJocfbPQmqZzW6CoJQiaYRUeQWT0LznnWguWv_dvn3UzlMalVH4Xa9Iag7GOCQmDzydia2FrRZvqduy8IrpPc0j6sLiA3Lp11DHLJ1WDkXDuT04mMW0v',
      },
    ],
  };

  const [fleetVignette, setFleetVignette] = useState(defaultFleet);
  const [fleetFormData, setFleetFormData] = useState(defaultFleet);
  const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);
  const [savingFleet, setSavingFleet] = useState(false);

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
    fetchFleet();
  }, []);

  const fetchFleet = async () => {
    try {
      const res = await api.get('/public/content/contact');
      if (res && res.data) {
        const block = res.data.byKey?.fleet_vignette || (Array.isArray(res.data.blocks) ? res.data.blocks.find(b => b.key === 'fleet_vignette') : null);
        if (block) {
          const loaded = {
            title: block.title || defaultFleet.title,
            badge: block.badge || defaultFleet.badge,
            items: Array.isArray(block.metadata?.items) && block.metadata.items.length > 0 ? block.metadata.items : defaultFleet.items,
          };
          setFleetVignette(loaded);
          setFleetFormData(loaded);
        }
      }
    } catch (err) {
      console.warn('Could not fetch fleet vignette content:', err);
    }
  };

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

  const handleOpenFleetEdit = () => {
    setFleetFormData({ ...fleetVignette, items: fleetVignette.items.map(it => ({ ...it })) });
    setIsFleetModalOpen(true);
  };

  const handleSaveFleet = async (e) => {
    e.preventDefault();
    try {
      setSavingFleet(true);
      const res = await api.put('/admin/content-blocks/fleet_vignette', {
        section: 'contact',
        title: fleetFormData.title,
        badge: fleetFormData.badge,
        metadata: { items: fleetFormData.items },
      });
      if (res && res.data) {
        const updated = {
          title: res.data.title || fleetFormData.title,
          badge: res.data.badge || fleetFormData.badge,
          items: res.data.metadata?.items || fleetFormData.items,
        };
        setFleetVignette(updated);
        setActionSuccess('Ambulatory Fleet Vignette updated successfully.');
        notifyContentUpdated({ entity: 'content_blocks' });
        setIsFleetModalOpen(false);
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      await showAlert({
        title: 'Update Failed',
        message: 'Failed to update fleet vignette: ' + (err.response?.data?.message || err.message),
        type: 'error',
      });
    } finally {
      setSavingFleet(false);
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
    const isConfirmed = await confirm({
      title: 'Delete Station / Hub',
      message: `Are you sure you want to permanently delete office/station "${name}"?`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (!isConfirmed) return;

    try {
      const res = await api.delete(`/admin/hubs/${id}`);
      if (res && (res.success || res.status === 200)) {
        setHubs((prev) => prev.filter((h) => h._id !== id));
        setActionSuccess(`Station "${name}" was removed successfully.`);
        notifyContentUpdated({ entity: 'hubs' });
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      await showAlert({
        title: 'Action Failed',
        message: 'Failed to delete hub: ' + (err.response?.data?.message || err.message),
        type: 'error',
      });
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

      {/* Field Diagnostic Fleet Vignette */}
      <div className="bg-surface-subtle rounded-2xl p-6 border border-border-hairline shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-hairline">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">local_shipping</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
              {fleetVignette.title || 'Ambulatory Fleet In Action'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-label-sm text-label-sm text-primary font-semibold">
              {fleetVignette.badge || 'Cold Chain + Ultrasound Equipped'}
            </span>
            <button
              onClick={handleOpenFleetEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-clinical hover:bg-surface-tinted text-primary font-bold text-xs border border-border-hairline transition-colors shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>Edit Fleet Vignette</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fleetVignette.items?.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-xl overflow-hidden h-44 bg-surface-container border border-border-hairline group"
            >
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                alt={item.name}
                src={item.image}
              />
              <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-lg bg-surface-clinical/95 text-on-surface font-label-sm text-xs font-semibold shadow-sm">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fleet Vignette Edit Modal */}
      {isFleetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-clinical rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-border-hairline max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border-hairline mb-5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">local_shipping</span>
                <h2 className="font-headline-sm font-bold text-on-surface">
                  Edit Ambulatory Fleet Vignette
                </h2>
              </div>
              <button
                onClick={() => setIsFleetModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-tinted"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveFleet} className="space-y-5 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-on-surface mb-1">
                    Section Header Title
                  </label>
                  <input
                    type="text"
                    required
                    value={fleetFormData.title}
                    onChange={(e) =>
                      setFleetFormData({ ...fleetFormData, title: e.target.value })
                    }
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline font-bold focus:bg-surface-clinical focus:border-primary"
                    placeholder="Ambulatory Fleet In Action"
                  />
                </div>

                <div>
                  <label className="block font-bold text-on-surface mb-1">
                    Badge / Equipment Subtitle
                  </label>
                  <input
                    type="text"
                    required
                    value={fleetFormData.badge}
                    onChange={(e) =>
                      setFleetFormData({ ...fleetFormData, badge: e.target.value })
                    }
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline font-semibold focus:bg-surface-clinical focus:border-primary"
                    placeholder="Cold Chain + Ultrasound Equipped"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-on-surface block">
                    Fleet Cards &amp; Images ({fleetFormData.items.length})
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFleetFormData({
                        ...fleetFormData,
                        items: [
                          ...fleetFormData.items,
                          {
                            name: `Fleet Unit #${fleetFormData.items.length + 1}`,
                            image:
                              'https://lh3.googleusercontent.com/aida-public/AB6AXuCdMipf_wHgAU1jJHBgzZ-6Av_FOWhaYTe_R9-pUVcedYopdfsqz05h2pLUvunESqUTs5qQ7PE4qFASeBGVWfVSZvspJFb4JPAt5kk3WO0D9tu2HlST18cJ3ygPKcaYjKN3hJrJ8lyFMrr5ozKgdT1YM4lsEa7ZpWUMDO1_Y_AY42lHfrKIfvOn6JZx30CnGUq2rCrWC_AYy4ozTsbtvRFnM5Bb1gl2r4BcFoGaHWLvSF3AtJW7KU2B',
                          },
                        ],
                      })
                    }
                    className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    <span>Add Fleet Card</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {fleetFormData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-surface-subtle border border-border-hairline flex flex-col sm:flex-row items-start gap-4"
                    >
                      <div className="w-24 h-20 rounded-lg overflow-hidden shrink-0 border border-border-hairline bg-surface-container">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/logo.png';
                          }}
                        />
                      </div>

                      <div className="flex-1 space-y-3 w-full">
                        <div>
                          <label className="block text-xs font-bold text-outline uppercase mb-0.5">
                            Card Label / Vehicle Name
                          </label>
                          <input
                            type="text"
                            required
                            value={item.name}
                            onChange={(e) => {
                              const newItems = [...fleetFormData.items];
                              newItems[idx].name = e.target.value;
                              setFleetFormData({ ...fleetFormData, items: newItems });
                            }}
                            className="w-full h-9 px-3 rounded-lg bg-surface-clinical border border-border-hairline font-semibold text-xs focus:border-primary"
                            placeholder="e.g., Mobile Lab Fleet #3"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-outline uppercase mb-0.5">
                            Image URL
                          </label>
                          <input
                            type="text"
                            required
                            value={item.image}
                            onChange={(e) => {
                              const newItems = [...fleetFormData.items];
                              newItems[idx].image = e.target.value;
                              setFleetFormData({ ...fleetFormData, items: newItems });
                            }}
                            className="w-full h-9 px-3 rounded-lg bg-surface-clinical border border-border-hairline text-xs focus:border-primary font-mono"
                            placeholder="https://... or /logo.png"
                          />
                        </div>
                      </div>

                      {fleetFormData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = fleetFormData.items.filter((_, i) => i !== idx);
                            setFleetFormData({ ...fleetFormData, items: newItems });
                          }}
                          className="p-2 rounded-lg text-error hover:bg-error/10 shrink-0 self-center"
                          title="Remove card"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-hairline">
                <button
                  type="button"
                  onClick={() => setIsFleetModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-border-hairline text-on-surface font-semibold hover:bg-surface-tinted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingFleet}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold shadow-sm hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  {savingFleet ? 'Saving Fleet...' : 'Save Fleet Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
