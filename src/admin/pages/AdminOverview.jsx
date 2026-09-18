import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { notifyContentUpdated, subscribeToContentUpdates } from '../../services/eventBus';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

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

  useEffect(() => {
    fetchStats();
    fetchFleet();

    const unsubscribe = subscribeToContentUpdates(() => {
      fetchFleet();
    });
    return () => unsubscribe();
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
        notifyContentUpdated({ entity: 'content_blocks' });
        setIsFleetModalOpen(false);
      }
    } catch (err) {
      alert('Failed to update fleet vignette: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingFleet(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setFetchError('');
      const res = await api.get('/admin/dashboard/stats');
      if (res.success) {
        setStats(res.data);
        setFetchError('');
      } else {
        setFetchError('Failed to load dashboard statistics.');
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      setFetchError('Unable to connect to backend server. Server is offline.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Products Sales Revenue',
      count: `KES ${Number(stats?.counts?.productRevenue || 0).toLocaleString()}`,
      icon: 'point_of_sale',
      to: '/admin/products/sales',
      color: 'text-primary bg-surface-tinted border-border-accent',
      desc: `${stats?.counts?.products ?? 0} Catalog Products`,
    },
    {
      title: 'Insurance Premium Volume',
      count: `KES ${Number(stats?.counts?.insuranceRevenue || 0).toLocaleString()}`,
      icon: 'health_and_safety',
      to: '/admin/insurance',
      color: 'text-secondary bg-secondary-container/40 border-secondary/20',
      desc: `${stats?.counts?.activePolicies ?? 0} Active Enrolled Policies`,
    },
    {
      title: 'Enrolled Animal Patients',
      count: stats?.counts?.animals ?? 0,
      icon: 'pets',
      to: '/admin/animals',
      color: 'text-primary bg-surface-tinted border-border-accent',
      desc: 'Insured Herds & Pets',
    },
    {
      title: "Today's Clinical Cases",
      count: stats?.counts?.todayVetCases ?? 0,
      icon: 'stethoscope',
      to: '/admin/vet/dashboard',
      color: 'text-secondary bg-secondary-container/40 border-secondary/20',
      desc: 'Daily Field Cases Logged',
    },
    {
      title: 'Clinical Services',
      count: stats?.counts?.services ?? 6,
      icon: 'medical_services',
      to: '/admin/services',
      color: 'text-primary bg-surface-container border-border-hairline',
      desc: 'Dynamic Public Protocols',
    },
    {
      title: 'Collaborations & Stories',
      count: stats?.counts?.collaborations ?? 4,
      icon: 'handshake',
      to: '/admin/collaborations',
      color: 'text-secondary bg-secondary-container/40 border-secondary/20',
      desc: 'One Health Partnerships',
    },
    {
      title: 'Open Triage Tickets',
      count: stats?.counts?.pendingAppointments ?? 0,
      icon: 'crisis_alert',
      to: '/admin/appointments',
      color: 'text-error bg-error-container/40 border-error/20',
      desc: 'Pending Dispatch',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-primary to-secondary text-on-primary shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-on-primary/15 text-on-primary font-label-sm text-label-sm font-semibold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>AniHeal One Health System</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl font-bold">
            Administrative Operations Console
          </h1>
          <p className="font-body-md text-body-md text-on-primary/90 max-w-2xl">
            Manage public website copy, clinical services, team profiles, regional ambulatory hubs, and live farmer triage appointments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/admin/content/home"
            className="px-5 py-2.5 rounded-full bg-surface-clinical text-primary font-label-md text-label-md font-bold hover:bg-surface-tinted transition-colors shadow-sm"
          >
            Edit Homepage
          </Link>
          <Link
            to="/admin/appointments"
            className="px-5 py-2.5 rounded-full bg-on-primary/20 text-on-primary font-label-md text-label-md font-semibold hover:bg-on-primary/30 transition-colors"
          >
            Review Triage
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <Link
            key={i}
            to={card.to}
            className="p-5 rounded-2xl bg-surface-clinical shadow-sm border border-border-hairline hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                {card.title}
              </span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.color}`}>
                <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="font-display-lg text-display-lg font-bold text-on-surface leading-none block">
                {loading ? '...' : card.count}
              </span>
              <span className="font-body-sm text-body-sm text-outline mt-1 block">
                {card.desc}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Grid: Recent Triage Tickets + Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Recent Triage Bookings */}
        <div className="lg:col-span-8 bg-surface-clinical rounded-2xl shadow-sm border border-border-hairline p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                Recent Farmer Triage Submissions
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Live field ambulatory dispatch requests
              </p>
            </div>
            <Link
              to="/admin/appointments"
              className="text-primary hover:underline font-label-md text-label-md font-bold flex items-center gap-1"
            >
              <span>View All</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="bg-surface-subtle border-y border-border-hairline text-on-surface-variant font-label-sm text-label-sm uppercase">
                <tr>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Farmer / Farm</th>
                  <th className="py-3 px-4">County</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline">
                {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
                  stats.recentAppointments.map((app) => (
                    <tr key={app._id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary text-xs">
                        {app.ticketRef}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-on-surface">{app.farmerName}</div>
                        <div className="text-xs text-outline">{app.phone}</div>
                      </td>
                      <td className="py-3 px-4 capitalize text-on-surface-variant">
                        {app.county}
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant max-w-[140px] truncate">
                        {app.clinicalService}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                            app.status === 'pending'
                              ? 'bg-error-container text-error'
                              : app.status === 'dispatched'
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-surface-tinted text-primary'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : fetchError ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-error">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[26px]">cloud_off</span>
                        <span className="font-semibold">{fetchError}</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-on-surface-variant">
                      No triage tickets submitted yet. Try booking a visit from the public website!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Quick Actions & Audit Feed */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Management Shortcuts */}
          <div className="bg-surface-clinical rounded-2xl shadow-sm border border-border-hairline p-6">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-3">
              Quick Content Editors
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/admin/services"
                className="p-3 rounded-xl bg-surface-subtle hover:bg-surface-tinted hover:text-primary transition-colors text-center border border-border-hairline"
              >
                <span className="material-symbols-outlined text-[24px] text-primary block mb-1">
                  vaccines
                </span>
                <span className="font-label-sm text-label-sm font-semibold block">
                  Add Service
                </span>
              </Link>
              <Link
                to="/admin/team"
                className="p-3 rounded-xl bg-surface-subtle hover:bg-surface-tinted hover:text-primary transition-colors text-center border border-border-hairline"
              >
                <span className="material-symbols-outlined text-[24px] text-secondary block mb-1">
                  person_add
                </span>
                <span className="font-label-sm text-label-sm font-semibold block">
                  Add Specialist
                </span>
              </Link>
              <Link
                to="/admin/media"
                className="p-3 rounded-xl bg-surface-subtle hover:bg-surface-tinted hover:text-primary transition-colors text-center border border-border-hairline"
              >
                <span className="material-symbols-outlined text-[24px] text-primary block mb-1">
                  upload_file
                </span>
                <span className="font-label-sm text-label-sm font-semibold block">
                  Upload Media
                </span>
              </Link>
              <Link
                to="/admin/settings"
                className="p-3 rounded-xl bg-surface-subtle hover:bg-surface-tinted hover:text-primary transition-colors text-center border border-border-hairline"
              >
                <span className="material-symbols-outlined text-[24px] text-kvb-gold block mb-1">
                  tune
                </span>
                <span className="font-label-sm text-label-sm font-semibold block">
                  Site Hotline
                </span>
              </Link>
            </div>
          </div>

          {/* Recent Administrative Activity */}
          <div className="bg-surface-clinical rounded-2xl shadow-sm border border-border-hairline p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Recent Activity
              </h3>
              <span className="font-label-sm text-label-sm text-outline">Audit Trail</span>
            </div>
            <div className="space-y-3">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.slice(0, 5).map((act, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-body-sm pb-2 border-b border-border-hairline last:border-0 last:pb-0">
                    <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                      history
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-on-surface text-xs truncate">
                        {act.action.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[11px] text-outline">
                        By {act.userEmail} • {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-body-sm text-on-surface-variant py-2">
                  No recorded activity yet. Modifications will appear here automatically.
                </p>
              )}
            </div>
          </div>

          {/* Field Diagnostic Fleet Vignette */}
          <div className="bg-surface-clinical rounded-2xl shadow-sm border border-border-hairline p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                {fleetVignette.title || 'Ambulatory Fleet In Action'}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm text-primary font-semibold text-xs hidden sm:inline">
                  {fleetVignette.badge || 'Cold Chain + Ultrasound'}
                </span>
                <button
                  onClick={handleOpenFleetEdit}
                  className="p-1 rounded-md text-primary hover:bg-surface-tinted transition-colors"
                  title="Edit Fleet Vignette"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fleetVignette.items?.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="relative rounded-lg overflow-hidden h-32 bg-surface-container border border-border-hairline group"
                >
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={item.name}
                    src={item.image}
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-surface-clinical/90 text-on-surface font-label-sm text-xs font-semibold">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 text-right">
              <Link
                to="/admin/hubs"
                className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>Manage Ambulatory Hubs</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
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
    </div>
  );
}
