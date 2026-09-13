import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { notifyContentUpdated } from '../../services/eventBus';

export default function AdminTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    roleTag: 'Specialist',
    specialtyTag: 'Field Surgery',
    kvbLicense: 'KVB: 0000-VS',
    image: '',
    bio: '',
    location: 'Nairobi Central HQ',
    experience: '10 Yrs Active',
    actionLabel: 'Schedule Consult',
    isDirector: false,
    email: '',
    category: 'field-surgery',
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/team');
      if (res.success) {
        setTeam(res.data);
      }
    } catch (err) {
      console.error('Failed to load team:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      title: 'BVM, MSc (UoN)',
      roleTag: 'Specialist',
      specialtyTag: 'Field Surgery',
      kvbLicense: 'KVB: 1248-VS',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwEQECb8OurVoi2GFDxSPomx5mCzT1SPE2x6JKkK4uwMPyk36iit-a7RG1-Qt28yyNu-iiQqN-C7zWmf3jnNf0ERgucQupyrUKISH80Ov4HXHZIZ1n_zBZ-92rZqr7TzQ8xM7i9pZ5pwvilXPSndralMnY9aBrtKJpQj5YltnY8A1pq5x4ghVeQtwzFyr516MZ_UDD5uXEpxDhp_g8eq4EK23Ye7UCLLacU8LqbbPAq2La-_VWujuo',
      bio: 'Licensed veterinary surgeon specializing in ambulatory triage and herd healthcare.',
      location: 'Nakuru Mobile Hub',
      experience: '8 Yrs Active',
      actionLabel: 'Request Specialist Consult',
      isDirector: false,
      email: 'specialist@aniheal.co.ke',
      category: 'field-surgery',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      title: member.title || '',
      roleTag: member.roleTag || 'Specialist',
      specialtyTag: member.specialtyTag || '',
      kvbLicense: member.kvbLicense || '',
      image: member.image || '',
      bio: member.bio || '',
      location: member.location || '',
      experience: member.experience || '',
      actionLabel: member.actionLabel || 'Request Consult',
      isDirector: !!member.isDirector,
      email: member.email || '',
      category: Array.isArray(member.category) ? member.category[0] || 'field-surgery' : 'field-surgery',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete specialist profile "${name}"?`)) return;
    try {
      const res = await api.delete(`/admin/team/${id}`);
      if (res.success) {
        setTeam((prev) => prev.filter((m) => m._id !== id));
        notifyContentUpdated();
      }
    } catch (err) {
      alert('Failed to delete team member: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      category: [formData.category],
    };

    try {
      if (editingMember) {
        const res = await api.put(`/admin/team/${editingMember._id}`, payload);
        if (res.success) {
          setTeam((prev) =>
            prev.map((m) => (m._id === editingMember._id ? res.data : m))
          );
          setIsModalOpen(false);
          notifyContentUpdated();
        }
      } else {
        const res = await api.post('/admin/team', payload);
        if (res.success) {
          setTeam((prev) => [res.data, ...prev]);
          setIsModalOpen(false);
          notifyContentUpdated();
        }
      }
    } catch (err) {
      alert('Failed to save team member: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">
            Veterinary Specialists &amp; Faculty
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage licensed KVB surgeons, clinical leadership profiles, and mobile station assignments.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-sm hover:bg-primary-container transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          <span>Add New Specialist</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-on-surface-variant">
            Loading team profiles...
          </div>
        ) : team.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-on-surface-variant">
            No team members found.
          </div>
        ) : (
          team.map((m) => (
            <div
              key={m._id}
              className={`bg-surface-clinical rounded-2xl p-5 shadow-sm border flex flex-col justify-between ${
                m.isDirector ? 'border-primary ring-2 ring-primary/20' : 'border-border-hairline'
              }`}
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-border-hairline">
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-surface-tinted text-primary font-label-sm text-xs font-bold uppercase">
                        {m.roleTag}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1 rounded text-primary hover:bg-surface-tinted"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(m._id, m.name)}
                          className="p-1 rounded text-error hover:bg-error-container/40"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface truncate mt-1">
                      {m.name}
                    </h3>
                    <span className="text-xs text-secondary font-semibold block truncate">
                      {m.title}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-subtle border border-border-hairline text-xs font-mono text-on-surface-variant mb-3 flex items-center justify-between">
                  <span>{m.kvbLicense || 'KVB Verified'}</span>
                  <span>{m.location}</span>
                </div>

                <p className="text-body-sm text-on-surface-variant line-clamp-3 mb-4">
                  {m.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-border-hairline flex items-center justify-between text-xs text-outline">
                <span>{m.experience}</span>
                <span>{m.email}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-clinical rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-border-hairline max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border-hairline mb-4">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                {editingMember ? 'Edit Specialist Profile' : 'Add New Specialist Profile'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-on-surface-variant hover:bg-surface-tinted"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Doctor / Specialist Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary"
                    placeholder="e.g. Dr. Dennis Kipchumba"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Academic Qualifications *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                    placeholder="BVM, MSc Veterinary Surgery (UoN)"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Discipline Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                  >
                    <option value="field-surgery">Surgery &amp; Triage</option>
                    <option value="one-health">One Health &amp; Lab</option>
                    <option value="theriogenology">Genomics &amp; Breeding</option>
                    <option value="leadership">Clinical Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    KVB License Number
                  </label>
                  <input
                    type="text"
                    value={formData.kvbLicense}
                    onChange={(e) => setFormData({ ...formData, kvbLicense: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                    placeholder="KVB: 1248-VS"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Role Tag Badge
                  </label>
                  <input
                    type="text"
                    value={formData.roleTag}
                    onChange={(e) => setFormData({ ...formData, roleTag: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                    placeholder="Surgical Lead"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Duty Station / Hub Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                    placeholder="Eldoret Mobile Lab"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Profile Image URL
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
                    Professional Biography *
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full p-3 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                    placeholder="Clinical expertise, large-herd specialties, surgical scope..."
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-label-md text-label-md text-on-surface">
                  <input
                    type="checkbox"
                    checked={formData.isDirector}
                    onChange={(e) => setFormData({ ...formData, isDirector: e.target.checked })}
                    className="w-4 h-4 rounded text-primary"
                  />
                  <span>Mark as Senior Clinical Director (Top Featured Profile)</span>
                </label>
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
                  {saving ? 'Saving...' : 'Save Specialist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
