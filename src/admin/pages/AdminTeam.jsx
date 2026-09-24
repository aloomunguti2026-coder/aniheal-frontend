import React, { useState, useEffect, useId } from 'react';
import api, { API_BASE_URL } from '../../services/api';
import { notifyContentUpdated } from '../../services/eventBus';
import { useConfirm } from '../../context/ConfirmContext';

const CATEGORY_OPTIONS = [
  { value: 'leadership', label: 'Clinical Leadership' },
  { value: 'field-surgery', label: 'Surgery & Triage' },
  { value: 'one-health', label: 'One Health & Lab' },
  { value: 'theriogenology', label: 'Genomics & Breeding' },
  { value: 'diagnostics', label: 'Diagnostics & Pathology' },
];

const DEFAULT_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAwEQECb8OurVoi2GFDxSPomx5mCzT1SPE2x6JKkK4uwMPyk36iit-a7RG1-Qt28yyNu-iiQqN-C7zWmf3jnNf0ERgucQupyrUKISH80Ov4HXHZIZ1n_zBZ-92rZqr7TzQ8xM7i9pZ5pwvilXPSndralMnY9aBrtKJpQj5YltnY8A1pq5x4ghVeQtwzFyr516MZ_UDD5uXEpxDhp_g8eq4EK23Ye7UCLLacU8LqbbPAq2La-_VWujuo';

export default function AdminTeam() {
  const { confirm, alert: showAlert } = useConfirm();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fileInputId = useId();

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
    actionLabel: 'Schedule Specialist Consult',
    isDirector: false,
    directorSpecialty: 'Herd Theriogenology & Metabolic Care',
    directorAccreditation: 'Licensed Surgeon (KVB/SRG/2006)',
    directorDutyHub: 'Naivasha & Central Rift Diagnostic Core',
    email: '',
    category: 'field-surgery',
    sortOrder: 0,
    isPublished: true,
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const showToast = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/team');
      if (res.success) {
        setTeam(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load team:', err);
      showToast('Failed to load team members: ' + (err.message || 'Error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      title: 'BVM, MSc Veterinary Surgery (UoN)',
      roleTag: 'Specialist',
      specialtyTag: 'Field Surgery & Ambulatory Triage',
      kvbLicense: 'KVB: 1248-VS',
      image: DEFAULT_IMAGE,
      bio: 'Licensed veterinary surgeon specializing in ambulatory triage, emergency surgical intervention, and herd healthcare protocols across Kenya.',
      location: 'Nakuru Mobile Hub',
      experience: '8 Yrs Active Field Exp',
      actionLabel: 'Request Specialist Consult',
      isDirector: false,
      directorSpecialty: 'Herd Theriogenology & Metabolic Care',
      directorAccreditation: 'Licensed Surgeon (KVB/SRG/2006)',
      directorDutyHub: 'Naivasha & Central Rift Diagnostic Core',
      email: 'specialist@aniheal.co.ke',
      category: 'field-surgery',
      sortOrder: team.length + 1,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    const cat = Array.isArray(member.category)
      ? member.category[0] || 'field-surgery'
      : member.category || 'field-surgery';

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
      actionLabel: member.actionLabel || 'Request Specialist Consult',
      isDirector: Boolean(member.isDirector),
      directorSpecialty: member.directorSpecialty || member.specialtyTag || '',
      directorAccreditation: member.directorAccreditation || member.kvbLicense || '',
      directorDutyHub: member.directorDutyHub || member.location || '',
      email: member.email || '',
      category: cat,
      sortOrder: typeof member.sortOrder === 'number' ? member.sortOrder : 0,
      isPublished: member.isPublished !== false,
    });
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const data = new FormData();
      data.append('file', file);

      const token = sessionStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: data,
      });

      const res = await response.json();
      if (res.success && res.data?.url) {
        setFormData((prev) => ({ ...prev, image: res.data.url }));
        showToast('Photo uploaded successfully');
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Image upload failed: ' + err.message, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleTogglePublish = async (member) => {
    const nextPublished = !member.isPublished;
    try {
      const res = await api.put(`/admin/team/${member._id}`, {
        isPublished: nextPublished,
      });
      if (res.success) {
        setTeam((prev) =>
          prev.map((m) => (m._id === member._id ? { ...m, isPublished: nextPublished } : m))
        );
        notifyContentUpdated({ resource: 'team', id: member._id, action: 'publish_toggle' });
        showToast(`Profile ${nextPublished ? 'published' : 'hidden'} on public site`);
      }
    } catch (err) {
      showToast('Failed to update status: ' + err.message, 'error');
    }
  };

  const handleToggleDirector = async (member) => {
    const nextDirector = !member.isDirector;
    try {
      const res = await api.put(`/admin/team/${member._id}`, {
        isDirector: nextDirector,
      });
      if (res.success) {
        setTeam((prev) =>
          prev.map((m) => ({
            ...m,
            isDirector: m._id === member._id ? nextDirector : nextDirector ? false : m.isDirector,
          }))
        );
        notifyContentUpdated({ resource: 'team', id: member._id, action: 'director_toggle' });
        showToast(
          nextDirector
            ? `${member.name} designated as Senior Clinical Director`
            : `${member.name} unset from Director`
        );
      }
    } catch (err) {
      showToast('Failed to set director: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    const isConfirmed = await confirm({
      title: 'Remove Specialist Profile',
      message: `Are you sure you want to remove specialist profile "${name}"?`,
      confirmText: 'Yes, Remove',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (!isConfirmed) return;

    try {
      const res = await api.delete(`/admin/team/${id}`);
      if (res.success) {
        setTeam((prev) => prev.filter((m) => m._id !== id));
        notifyContentUpdated({ resource: 'team', id, action: 'delete' });
        showToast(`Specialist profile "${name}" deleted`);
      }
    } catch (err) {
      showToast('Failed to delete team member: ' + err.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      category: [formData.category],
      sortOrder: Number(formData.sortOrder) || 0,
    };

    try {
      if (editingMember) {
        const res = await api.put(`/admin/team/${editingMember._id}`, payload);
        if (res.success) {
          setTeam((prev) =>
            prev.map((m) => {
              if (m._id === editingMember._id) return res.data;
              if (payload.isDirector) return { ...m, isDirector: false };
              return m;
            })
          );
          setIsModalOpen(false);
          notifyContentUpdated({ resource: 'team', id: editingMember._id, action: 'update' });
          showToast(`Profile for ${res.data.name} updated successfully!`);
        }
      } else {
        const res = await api.post('/admin/team', payload);
        if (res.success) {
          setTeam((prev) => {
            const list = payload.isDirector
              ? prev.map((m) => ({ ...m, isDirector: false }))
              : [...prev];
            return [res.data, ...list];
          });
          setIsModalOpen(false);
          notifyContentUpdated({ resource: 'team', id: res.data._id, action: 'create' });
          showToast(`Specialist ${res.data.name} added successfully!`);
        }
      }
    } catch (err) {
      showToast('Failed to save team member: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Filtered team list
  const filteredTeam = team.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.kvbLicense?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.specialtyTag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.bio?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' ||
      (Array.isArray(m.category)
        ? m.category.includes(categoryFilter)
        : m.category === categoryFilter);

    return matchesSearch && matchesCategory;
  });

  const directorCount = team.filter((m) => m.isDirector).length;
  const publishedCount = team.filter((m) => m.isPublished !== false).length;

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all transform animate-in fade-in slide-in-from-top-4 ${
            feedback.type === 'error'
              ? 'bg-error text-on-error'
              : 'bg-primary text-on-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {feedback.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span className="font-label-md font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm font-bold border border-border-accent mb-2">
            <span className="material-symbols-outlined text-[16px] text-kvb-gold">verified</span>
            <span>KVB Regulated Faculty CMS</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">
            Veterinary Specialists &amp; Faculty
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Live database management for licensed surgeons, Senior Clinical Director, and regional ambulatory staff. Changes reflect automatically on the public Our Team page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTeam}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-all cursor-pointer"
            title="Refresh from server"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
            <span>Refresh</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>Add Specialist</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-clinical p-4 rounded-xl border border-border-hairline shadow-sm">
          <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block">
            Total Specialists
          </span>
          <span className="font-headline-lg text-headline-lg font-bold text-primary">
            {team.length}
          </span>
        </div>
        <div className="bg-surface-clinical p-4 rounded-xl border border-border-hairline shadow-sm">
          <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block">
            Published Live
          </span>
          <span className="font-headline-lg text-headline-lg font-bold text-[#16a34a]">
            {publishedCount}
          </span>
        </div>
        <div className="bg-surface-clinical p-4 rounded-xl border border-border-hairline shadow-sm">
          <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block">
            Clinical Director
          </span>
          <span className="font-headline-lg text-headline-lg font-bold text-secondary">
            {directorCount > 0 ? 'Assigned' : 'None Set'}
          </span>
        </div>
        <div className="bg-surface-clinical p-4 rounded-xl border border-border-hairline shadow-sm">
          <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block">
            Real-Time Sync
          </span>
          <span className="font-headline-lg text-headline-lg font-bold text-primary flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] animate-ping inline-block"></span>
            Active
          </span>
        </div>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="bg-surface-clinical p-4 rounded-xl border border-border-hairline flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, KVB, hub, or specialty..."
            className="w-full pl-10 pr-4 py-2 bg-surface-subtle border border-border-hairline rounded-lg text-body-sm focus:outline-none focus:border-primary focus:bg-surface-clinical"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">cancel</span>
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-subtle text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All Categories ({team.length})
          </button>
          {CATEGORY_OPTIONS.map((opt) => {
            const count = team.filter((m) =>
              Array.isArray(m.category) ? m.category.includes(opt.value) : m.category === opt.value
            ).length;
            const isActive = categoryFilter === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setCategoryFilter(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-subtle text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {opt.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Specialists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-on-surface-variant space-y-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-label-md">Loading registered veterinary team from database...</p>
          </div>
        ) : filteredTeam.length === 0 ? (
          <div className="col-span-full py-16 text-center text-on-surface-variant bg-surface-clinical rounded-2xl border border-dashed border-border-hairline space-y-3">
            <span className="material-symbols-outlined text-[48px] text-outline">group_off</span>
            <p className="font-headline-sm font-bold text-on-surface">No specialists found</p>
            <p className="text-body-sm text-on-surface-variant max-w-md mx-auto">
              {searchQuery || categoryFilter !== 'all'
                ? 'Try adjusting your search criteria or discipline filter.'
                : 'Get started by creating your first veterinary faculty profile.'}
            </p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-on-primary font-label-md font-semibold shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Add First Specialist</span>
            </button>
          </div>
        ) : (
          filteredTeam.map((m) => (
            <div
              key={m._id}
              className={`bg-surface-clinical rounded-2xl p-5 shadow-sm border flex flex-col justify-between transition-all hover:shadow-md ${
                m.isDirector
                  ? 'border-primary ring-2 ring-primary/20 bg-surface-tinted/20'
                  : 'border-border-hairline'
              } ${m.isPublished === false ? 'opacity-70 bg-surface-subtle' : ''}`}
            >
              <div>
                {/* Card Top: Photo, Badges & Quick Action Icons */}
                <div className="flex items-start gap-4 mb-3">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-border-hairline shadow-inner">
                    <img
                      src={m.image || DEFAULT_IMAGE}
                      alt={m.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE;
                      }}
                    />
                    {m.isDirector && (
                      <span className="absolute bottom-0 inset-x-0 bg-primary/90 text-on-primary text-[9px] font-bold uppercase text-center py-0.5 tracking-wider">
                        Director
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-surface-tinted text-primary font-label-sm text-[11px] font-bold uppercase tracking-wider">
                        {m.roleTag || 'Specialist'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 rounded-lg text-primary hover:bg-surface-tinted transition-colors cursor-pointer"
                          title="Edit Profile"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(m._id, m.name)}
                          className="p-1.5 rounded-lg text-error hover:bg-error-container/40 transition-colors cursor-pointer"
                          title="Delete Profile"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>

                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface truncate">
                      {m.name}
                    </h3>
                    <span className="text-xs text-secondary font-semibold block truncate">
                      {m.title}
                    </span>
                  </div>
                </div>

                {/* Badges strip: Specialty, License, Station */}
                <div className="space-y-1.5 mb-3">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-surface-tinted text-primary text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span className="truncate">{m.specialtyTag || 'Clinical Specialist'}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-surface-subtle border border-border-hairline text-xs text-on-surface-variant flex items-center justify-between">
                    <span className="font-mono font-semibold">{m.kvbLicense || 'KVB License'}</span>
                    <span className="truncate ml-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-primary">
                        location_on
                      </span>
                      {m.location || 'Nairobi HQ'}
                    </span>
                  </div>
                </div>

                <p className="text-body-sm text-on-surface-variant line-clamp-3 mb-4 leading-relaxed">
                  {m.bio}
                </p>

                {/* If Director, display extra director meta tags */}
                {m.isDirector && (
                  <div className="mb-4 p-2.5 rounded-lg bg-surface-clinical border border-primary/30 text-xs space-y-1">
                    <div className="flex items-center gap-1 text-primary font-bold">
                      <span className="material-symbols-outlined text-[14px]">star</span>
                      <span>Senior Faculty Director Meta:</span>
                    </div>
                    <div className="text-on-surface-variant">
                      <span className="font-semibold text-on-surface">Duty Hub:</span>{' '}
                      {m.directorDutyHub || m.location || 'Naivasha Diagnostic Core'}
                    </div>
                    <div className="text-on-surface-variant">
                      <span className="font-semibold text-on-surface">Accreditation:</span>{' '}
                      {m.directorAccreditation || m.kvbLicense || 'Licensed Surgeon'}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Live toggle, Director toggle & Meta */}
              <div className="pt-3 border-t border-border-hairline space-y-2">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span className="font-medium">{m.experience || 'Field Vet'}</span>
                  <span className="font-mono truncate max-w-[150px]">{m.email}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(m)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      m.isPublished !== false
                        ? 'bg-[#16a34a]/10 text-[#16a34a] hover:bg-[#16a34a]/20'
                        : 'bg-surface-subtle text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        m.isPublished !== false ? 'bg-[#16a34a]' : 'bg-outline'
                      }`}
                    ></span>
                    <span>{m.isPublished !== false ? 'Published' : 'Draft / Hidden'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleDirector(m)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      m.isDirector
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-subtle text-on-surface-variant hover:text-primary hover:bg-surface-tinted'
                    }`}
                    title={m.isDirector ? 'Currently Senior Director' : 'Promote to Senior Director'}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {m.isDirector ? 'grade' : 'star_outline'}
                    </span>
                    <span>{m.isDirector ? 'Senior Director' : 'Set as Director'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface-clinical rounded-2xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 border border-border-hairline my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border-hairline mb-5">
              <div>
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                  {editingMember ? `Edit ${editingMember.name}` : 'Add New Veterinary Specialist'}
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  Information will automatically sync live with the public Our Team showcase.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-tinted cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Doctor Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Doctor / Specialist Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold text-on-surface focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    placeholder="e.g. Dr. Dennis Kipchumba"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Academic Qualifications &amp; Fellowships *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md text-on-surface focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    placeholder="e.g. BVM, MSc Veterinary Surgery (UoN)"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Discipline Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md text-on-surface focus:bg-surface-clinical focus:border-primary focus:outline-none cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    KVB License Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.kvbLicense}
                    onChange={(e) => setFormData({ ...formData, kvbLicense: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-mono text-on-surface focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    placeholder="e.g. KVB: 1248-VS"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Role Tag Badge (Photo Pill)
                  </label>
                  <input
                    type="text"
                    value={formData.roleTag}
                    onChange={(e) => setFormData({ ...formData, roleTag: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md text-on-surface focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    placeholder="e.g. Surgical Lead, Biosecurity, Genomics"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Specialty Tag (Discipline Badge)
                  </label>
                  <input
                    type="text"
                    value={formData.specialtyTag}
                    onChange={(e) => setFormData({ ...formData, specialtyTag: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md text-on-surface focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    placeholder="e.g. Field Surgery &amp; Orthopedics"
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
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md text-on-surface focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    placeholder="e.g. Eldoret Mobile Lab / Rift Valley"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Experience Badge
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md text-on-surface focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    placeholder="e.g. 12 Yrs Active Field Exp"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Direct Contact / Dispatch Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md text-on-surface focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    placeholder="e.g. d.kipchumba@aniheal.co.ke"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Call-to-Action Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.actionLabel}
                    onChange={(e) => setFormData({ ...formData, actionLabel: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md text-on-surface focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    placeholder="e.g. Dispatch Surgical Unit / Consult"
                  />
                </div>

                {/* Profile Image with File Upload */}
                <div className="sm:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Doctor Portrait Photo
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-border-hairline">
                      <img
                        src={formData.image || DEFAULT_IMAGE}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_IMAGE;
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md text-on-surface focus:bg-surface-clinical focus:border-primary focus:outline-none w-full"
                      placeholder="https://... or upload a photo"
                    />
                    <label
                      htmlFor={fileInputId}
                      className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md font-semibold cursor-pointer border border-border-hairline whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {uploadingImage ? 'sync' : 'upload_file'}
                      </span>
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Photo'}</span>
                      <input
                        id={fileInputId}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingImage}
                        onChange={handleImageFileUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Biography */}
                <div className="sm:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Professional Biography &amp; Clinical Scope *
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-surface-subtle border border-border-hairline text-body-md text-on-surface focus:bg-surface-clinical focus:border-primary focus:outline-none leading-relaxed"
                    placeholder="Describe clinical background, KVB specialties, large-herd scope, emergency triage expertise..."
                  ></textarea>
                </div>
              </div>

              {/* Director Checkbox & Director-Specific Custom Meta */}
              <div className="p-4 rounded-xl bg-surface-tinted/40 border border-primary/20 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDirector}
                    onChange={(e) => setFormData({ ...formData, isDirector: e.target.checked })}
                    className="w-5 h-5 rounded text-primary border-border-hairline focus:ring-primary cursor-pointer"
                  />
                  <div>
                    <span className="font-label-lg font-bold text-on-surface block">
                      Mark as Senior Clinical Director (Top Featured Hero Card)
                    </span>
                    <span className="text-body-sm text-on-surface-variant">
                      Promotes this specialist to the flagship feature card at the top of the Our Team page.
                    </span>
                  </div>
                </label>

                {formData.isDirector && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-primary/20">
                    <div>
                      <label className="block text-xs font-bold uppercase text-primary mb-1">
                        Director Specialty
                      </label>
                      <input
                        type="text"
                        value={formData.directorSpecialty}
                        onChange={(e) =>
                          setFormData({ ...formData, directorSpecialty: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-lg bg-surface-clinical border border-border-hairline text-body-sm focus:border-primary focus:outline-none"
                        placeholder="Herd Theriogenology &amp; Metabolic Care"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-primary mb-1">
                        Director Accreditation
                      </label>
                      <input
                        type="text"
                        value={formData.directorAccreditation}
                        onChange={(e) =>
                          setFormData({ ...formData, directorAccreditation: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-lg bg-surface-clinical border border-border-hairline text-body-sm focus:border-primary focus:outline-none"
                        placeholder="Licensed Surgeon (KVB/SRG/2006)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-primary mb-1">
                        Director Duty Hub
                      </label>
                      <input
                        type="text"
                        value={formData.directorDutyHub}
                        onChange={(e) =>
                          setFormData({ ...formData, directorDutyHub: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-lg bg-surface-clinical border border-border-hairline text-body-sm focus:border-primary focus:outline-none"
                        placeholder="Naivasha Diagnostic Core"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Publication Status & Sort Order */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-label-md font-semibold text-on-surface">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-primary cursor-pointer"
                  />
                  <span>Published on Live Website</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="font-label-md font-semibold text-on-surface-variant text-xs">
                    Sort Order:
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                    className="w-20 h-9 px-3 rounded-lg bg-surface-subtle border border-border-hairline text-body-sm text-center focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-hairline">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-on-surface-variant font-semibold hover:bg-surface-subtle transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-7 py-2.5 rounded-full bg-primary text-on-primary font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingMember ? 'Update Specialist' : 'Add Specialist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
