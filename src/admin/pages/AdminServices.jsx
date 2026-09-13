import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { notifyContentUpdated } from '../../services/eventBus';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    protocolNumber: 'Service Protocol 01',
    title: '',
    slug: '',
    badgeText: 'Zoonoses & Bio-Risk',
    badgeIcon: 'public',
    statusTag: 'KVB Standard Audit',
    category: 'one-health',
    image: '',
    description: '',
    compliance: 'Formal WHO & WOAH One Health Guidelines Adherent',
    features: [
      { icon: 'coronavirus', title: 'Feature 1', desc: 'Description of protocol step' },
      { icon: 'sanitizer', title: 'Feature 2', desc: 'Description of protocol step' },
      { icon: 'water_drop', title: 'Feature 3', desc: 'Description of protocol step' },
    ],
    isPublished: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/services');
      if (res.success) {
        setServices(res.data);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      protocolNumber: `Service Protocol 0${services.length + 1}`,
      title: '',
      slug: '',
      badgeText: 'Clinical Protocol',
      badgeIcon: 'biotech',
      statusTag: 'KVB Accredited',
      category: 'one-health',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8GMqS-s8oinLCAa3VcL8Xl7AQBM1TSOEF9XkmOobmDNuBcrYO1BnJzDYY41T8p8D9N9DXAJZ5xXcXs62AY48PxF50eFEK4mvnrlAmyiiDgMPdtr-U4_r1YfvJTd93s_r1lRgit73FS86IaEBFaO558hGseYNlXJUuDUeHj2wgYr0-fWtJ7mG4UE5sfCVkqHFhtPTMjJYKvI4veFlKgjAORdXijb34IbWE4OAS4B7gmYQXrKE4mb-6',
      description: '',
      compliance: 'Kenya Veterinary Board Standard Compliance',
      features: [
        { icon: 'check_circle', title: 'Diagnostic Step 1', desc: 'Field diagnostic validation' },
        { icon: 'check_circle', title: 'Diagnostic Step 2', desc: 'Therapeutic intervention' },
        { icon: 'check_circle', title: 'Diagnostic Step 3', desc: 'Post-treatment herd audit' },
      ],
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    setFormData({
      protocolNumber: srv.protocolNumber || '',
      title: srv.title || '',
      slug: srv.slug || '',
      badgeText: srv.badgeText || '',
      badgeIcon: srv.badgeIcon || 'biotech',
      statusTag: srv.statusTag || '',
      category: Array.isArray(srv.category) ? srv.category[0] || 'one-health' : 'one-health',
      image: srv.image || '',
      description: srv.description || '',
      compliance: srv.compliance || '',
      features: srv.features && srv.features.length > 0 ? srv.features : [
        { icon: 'check_circle', title: '', desc: '' }
      ],
      isPublished: srv.isPublished !== false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the clinical service "${title}"?`)) return;
    try {
      const res = await api.delete(`/admin/services/${id}`);
      if (res.success) {
        setServices((prev) => prev.filter((s) => s._id !== id));
        notifyContentUpdated();
      }
    } catch (err) {
      alert('Failed to delete service: ' + err.message);
    }
  };

  const handleFeatureChange = (index, field, value) => {
    const updated = [...formData.features];
    updated[index][field] = value;
    setFormData({ ...formData, features: updated });
  };

  const addFeatureRow = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { icon: 'check_circle', title: '', desc: '' }],
    });
  };

  const removeFeatureRow = (index) => {
    if (formData.features.length <= 1) return;
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      category: [formData.category],
    };

    try {
      if (editingService) {
        const res = await api.put(`/admin/services/${editingService._id}`, payload);
        if (res.success) {
          setServices((prev) =>
            prev.map((s) => (s._id === editingService._id ? res.data : s))
          );
          setIsModalOpen(false);
          notifyContentUpdated();
        }
      } else {
        const res = await api.post('/admin/services', payload);
        if (res.success) {
          setServices((prev) => [res.data, ...prev]);
          setIsModalOpen(false);
          notifyContentUpdated();
        }
      }
    } catch (err) {
      alert('Failed to save service: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">
            Clinical Services Manager
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Create, edit, and organize public agro-veterinary clinical protocols and diagnostic scopes.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-sm hover:bg-primary-container transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Add New Service Protocol</span>
        </button>
      </div>

      {/* Services Grid / Cards */}
      <div className="bg-surface-clinical rounded-2xl shadow-sm border border-border-hairline overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="bg-surface-subtle border-b border-border-hairline text-on-surface-variant font-label-sm text-label-sm uppercase">
              <tr>
                <th className="py-3.5 px-4">Protocol</th>
                <th className="py-3.5 px-4">Service Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status Tag</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-on-surface-variant">
                    Loading clinical services...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-on-surface-variant">
                    No clinical services found. Click "Add New Service Protocol" to create one.
                  </td>
                </tr>
              ) : (
                services.map((srv) => (
                  <tr key={srv._id} className="hover:bg-surface-subtle/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-primary font-bold">
                      {srv.protocolNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-on-surface">{srv.title}</div>
                      <div className="text-xs text-outline line-clamp-1 max-w-xs">{srv.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm font-semibold capitalize">
                        {Array.isArray(srv.category) ? srv.category.join(', ') : srv.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-on-surface-variant">
                      {srv.statusTag}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={`/services/${srv.slug || srv._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-secondary hover:bg-surface-tinted transition-colors cursor-pointer"
                          title="View Live Public Page"
                        >
                          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                        </a>
                        <button
                          onClick={() => handleOpenEdit(srv)}
                          className="p-1.5 rounded-lg text-primary hover:bg-surface-tinted transition-colors cursor-pointer"
                          title="Edit Service"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(srv._id, srv.title)}
                          className="p-1.5 rounded-lg text-error hover:bg-error-container/40 transition-colors cursor-pointer"
                          title="Delete Service"
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

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface-clinical rounded-2xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 border border-border-hairline max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border-hairline mb-6">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                {editingService ? 'Edit Clinical Service Protocol' : 'Create New Clinical Protocol'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-tinted"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Protocol Tag / Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.protocolNumber}
                    onChange={(e) => setFormData({ ...formData, protocolNumber: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                    placeholder="Service Protocol 01"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Category Filter *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                  >
                    <option value="one-health">One Health &amp; Bio-Security</option>
                    <option value="therapeutic">Therapeutic &amp; Diagnostics</option>
                    <option value="reproductive">Reproductive Tech &amp; Breeding</option>
                    <option value="insurance">Insurance &amp; Feeds</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary"
                    placeholder="e.g. Disease Control & Prophylactic Treatment"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Badge Pill Text
                  </label>
                  <input
                    type="text"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                    placeholder="Prophylaxis & Isolation"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Status Tag (Right Header)
                  </label>
                  <input
                    type="text"
                    value={formData.statusTag}
                    onChange={(e) => setFormData({ ...formData, statusTag: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                    placeholder="Certified Cold-Chain Biologics"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                    placeholder="https://..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Protocol Description *
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                    placeholder="Detail the veterinary scope, procedures, and disease targets..."
                  ></textarea>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Compliance &amp; Statutory Note
                  </label>
                  <input
                    type="text"
                    value={formData.compliance}
                    onChange={(e) => setFormData({ ...formData, compliance: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                    placeholder="Full Veterinary Movement Permits (VMP) Documentation"
                  />
                </div>
              </div>

              {/* 3 Sub-Features Manager */}
              <div className="pt-4 border-t border-border-hairline space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Sub-Protocol Features &amp; Diagnostic Steps
                  </label>
                  <button
                    type="button"
                    onClick={addFeatureRow}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span> Add Feature
                  </button>
                </div>

                {formData.features.map((feat, idx) => (
                  <div key={idx} className="p-3 bg-surface-subtle rounded-xl border border-border-hairline grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        value={feat.icon}
                        onChange={(e) => handleFeatureChange(idx, 'icon', e.target.value)}
                        placeholder="Icon Name (Material)"
                        className="w-full h-9 px-2.5 rounded-lg bg-surface-clinical border border-border-hairline text-xs font-mono"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                        placeholder="Feature Title"
                        className="w-full h-9 px-2.5 rounded-lg bg-surface-clinical border border-border-hairline text-xs font-semibold"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={feat.desc}
                        onChange={(e) => handleFeatureChange(idx, 'desc', e.target.value)}
                        placeholder="Short summary"
                        className="w-full h-9 px-2.5 rounded-lg bg-surface-clinical border border-border-hairline text-xs"
                      />
                    </div>
                    <div className="sm:col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => removeFeatureRow(idx)}
                        className="text-error hover:text-red-700 p-1"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border-hairline">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-on-surface-variant font-label-md text-label-md font-semibold hover:bg-surface-tinted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-sm hover:bg-primary-container flex items-center gap-2 cursor-pointer"
                >
                  {saving ? 'Saving Protocol...' : 'Save & Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
