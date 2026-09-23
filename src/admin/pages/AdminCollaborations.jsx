import React, { useState, useEffect } from 'react';
import collaborationService from '../../services/collaborationService';
import { notifyContentUpdated } from '../../services/eventBus';
import { useConfirm } from '../../context/ConfirmContext';

export default function AdminCollaborations() {
  const { confirm, alert: showAlert } = useConfirm();
  const [collaborations, setCollaborations] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, published: 0, totalComments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal State (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  // Form State
  const initialForm = {
    header: '',
    slug: '',
    partnerName: '',
    category: 'One Health Research',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    summary: '',
    content: '',
    externalUrl: '',
    status: 'published',
    featured: false,
    tags: '',
  };
  const [formData, setFormData] = useState(initialForm);

  // Comments Moderation Drawer State
  const [activeCommentsItem, setActiveCommentsItem] = useState(null);

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const categories = [
    'All',
    'One Health Research',
    'Community Outreach',
    'Academic & Training',
    'Livestock & Dairy Sector',
    'Wildlife & Conservation',
    'General Partnership',
  ];

  const fetchCollaborations = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const res = await collaborationService.getAdminCollaborations(params);
      if (res && res.data) {
        setCollaborations(res.data);
        if (res.metrics) {
          setMetrics(res.metrics);
        } else {
          setMetrics({
            total: res.data.length,
            published: res.data.filter((i) => i.status === 'published').length,
            totalComments: res.data.reduce((acc, curr) => acc + (curr.comments?.length || 0), 0),
          });
        }
      }
    } catch (err) {
      console.error('Failed to load collaborations:', err);
      setError('Unable to load collaborations. Please verify network or login.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  }, [selectedCategory, selectedStatus]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      header: item.header || '',
      slug: item.slug || '',
      partnerName: item.partnerName || '',
      category: item.category || 'One Health Research',
      imageUrl: item.imageUrl || '',
      summary: item.summary || '',
      content: item.content || '',
      externalUrl: item.externalUrl || '',
      status: item.status || 'published',
      featured: item.featured || false,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.header.trim() || !formData.content.trim()) {
      setFormError('Story header and content body are required.');
      return;
    }

    try {
      setSaving(true);
      setFormError(null);
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      };

      if (editingItem) {
        await collaborationService.updateCollaboration(editingItem._id, payload);
        setActionSuccess('Collaboration story updated successfully.');
      } else {
        await collaborationService.createCollaboration(payload);
        setActionSuccess('New collaboration story published successfully.');
      }

      notifyContentUpdated({ entity: 'collaborations' });
      setIsModalOpen(false);
      fetchCollaborations();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save collaboration.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await collaborationService.deleteCollaboration(id);
      notifyContentUpdated({ entity: 'collaborations' });
      setDeleteConfirmId(null);
      setActionSuccess('Collaboration story removed.');
      fetchCollaborations();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      await showAlert({
        title: 'Action Failed',
        message: 'Failed to delete collaboration: ' + (err.response?.data?.message || err.message),
        type: 'error',
      });
    }
  };

  const handleDeleteComment = async (collabId, commentId) => {
    const isConfirmed = await confirm({
      title: 'Delete Comment',
      message: 'Are you sure you want to permanently delete this reader comment?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (!isConfirmed) return;

    try {
      await collaborationService.deleteComment(collabId, commentId);
      // Update local comments modal
      if (activeCommentsItem) {
        const updated = activeCommentsItem.comments.filter((c) => c._id !== commentId);
        setActiveCommentsItem({ ...activeCommentsItem, comments: updated });
      }
      fetchCollaborations();
    } catch (err) {
      await showAlert({
        title: 'Action Failed',
        message: 'Failed to delete comment: ' + (err.response?.data?.message || err.message),
        type: 'error',
      });
    }
  };

  const handleToggleCommentApproval = async (collabId, commentId) => {
    try {
      const res = await collaborationService.toggleCommentApproval(collabId, commentId);
      if (activeCommentsItem) {
        const updated = activeCommentsItem.comments.map((c) =>
          c._id === commentId ? { ...c, approved: res.data.approved } : c
        );
        setActiveCommentsItem({ ...activeCommentsItem, comments: updated });
      }
      fetchCollaborations();
    } catch (err) {
      await showAlert({
        title: 'Action Failed',
        message: 'Failed to toggle comment approval: ' + (err.response?.data?.message || err.message),
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Collaborations &amp; Partnerships CMS
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Manage One Health research partnerships, institutional alliances, blog stories, and reader comments.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary-dark transition-all shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>New Collaboration Story</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface-clinical p-6 rounded-2xl border border-border-hairline shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">handshake</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-outline">Total Collaborations</p>
            <p className="text-2xl font-bold text-on-surface mt-0.5">{metrics.total}</p>
          </div>
        </div>

        <div className="bg-surface-clinical p-6 rounded-2xl border border-border-hairline shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">verified</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-outline">Published Stories</p>
            <p className="text-2xl font-bold text-on-surface mt-0.5">{metrics.published}</p>
          </div>
        </div>

        <div className="bg-surface-clinical p-6 rounded-2xl border border-border-hairline shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">forum</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-outline">Reader Comments</p>
            <p className="text-2xl font-bold text-on-surface mt-0.5">{metrics.totalComments}</p>
          </div>
        </div>
      </div>

      {/* Action Success Alert */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          {actionSuccess}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-surface-clinical p-4 rounded-2xl border border-border-hairline shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by title, partner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCollaborations()}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border-hairline bg-surface text-on-surface text-sm focus:outline-none focus:border-primary"
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
            search
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border-hairline bg-surface text-on-surface text-xs font-semibold focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border-hairline bg-surface text-on-surface text-xs font-semibold focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <button
            onClick={fetchCollaborations}
            className="px-3.5 py-2 rounded-xl bg-surface-tinted text-primary font-bold text-xs hover:bg-primary hover:text-on-primary transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Table of Collaborations */}
      <div className="bg-surface-clinical rounded-2xl border border-border-hairline shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-error font-medium">{error}</div>
        ) : collaborations.length === 0 ? (
          <div className="text-center py-16 px-4">
            <span className="material-symbols-outlined text-[48px] text-outline">article</span>
            <p className="text-on-surface font-bold text-lg mt-2">No Collaboration Stories Found</p>
            <p className="text-outline text-sm mt-1">Create your first strategic partnership blog post.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-on-surface">
              <thead className="bg-surface-tinted/50 text-xs uppercase tracking-wider text-outline border-b border-border-hairline font-bold">
                <tr>
                  <th className="px-6 py-4">Story &amp; Partner</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Comments</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline">
                {collaborations.map((item) => (
                  <tr key={item._id} className="hover:bg-surface-tinted/20 transition-colors">
                    {/* Story & Partner */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=120&q=80'}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-border-hairline shrink-0"
                        />
                        <div>
                          <p className="font-bold text-on-surface line-clamp-1">{item.header}</p>
                          <p className="text-xs text-secondary font-semibold line-clamp-1 mt-0.5">
                            {item.partnerName ? `Partner: ${item.partnerName}` : 'Internal Initiative'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                        {item.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          item.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'draft'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Comments Counter */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setActiveCommentsItem(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border-hairline hover:bg-surface-tinted text-xs font-bold text-on-surface transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px] text-primary">forum</span>
                        <span>{(item.comments || []).length} Comments</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-primary hover:bg-surface-tinted transition-colors"
                        title="Edit Story"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item._id)}
                        className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors"
                        title="Delete Story"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-clinical rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border-hairline shadow-2xl p-6 sm:p-8 space-y-6 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border-hairline pb-4">
              <h3 className="text-xl font-bold text-on-surface">
                {editingItem ? 'Edit Collaboration Story' : 'New Collaboration Story'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full text-on-surface hover:bg-surface-tinted flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                  Collaboration Header / Story Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.header}
                  onChange={(e) => setFormData({ ...formData, header: e.target.value })}
                  placeholder="e.g., One Health Zoonotic Surveillance with ILRI & KVB"
                  className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface text-on-surface text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                    Partner Organization Name
                  </label>
                  <input
                    type="text"
                    value={formData.partnerName}
                    onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                    placeholder="e.g., Kenya Dairy Board"
                    className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface text-on-surface text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                    Partnership Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface text-on-surface text-sm font-semibold focus:outline-none focus:border-primary"
                  >
                    {categories.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface text-on-surface text-sm focus:outline-none focus:border-primary"
                />
                {formData.imageUrl && (
                  <div className="mt-2 h-28 w-full rounded-xl overflow-hidden border border-border-hairline">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                  Summary / Lead Synopsis
                </label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="A concise 1-2 sentence overview of the collaborative milestone..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface text-on-surface text-sm focus:outline-none focus:border-primary"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                  Full Story Body / Article Content *
                </label>
                <textarea
                  rows={6}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the full blog article content, field methodology, quotes, and outcomes..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface text-on-surface text-sm focus:outline-none focus:border-primary font-mono"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                    Partner External Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.externalUrl}
                    onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                    placeholder="https://partner-domain.org"
                    className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface text-on-surface text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">
                    Publishing Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface text-on-surface text-sm font-semibold focus:outline-none focus:border-primary"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="featuredToggle" className="text-sm font-semibold text-on-surface">
                  Feature this story prominently on the public Collaborations page
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-hairline">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-border-hairline text-on-surface font-bold text-sm hover:bg-surface-tinted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving Story...' : editingItem ? 'Save Changes' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMMENTS MODERATION MODAL */}
      {activeCommentsItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-clinical rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-border-hairline shadow-2xl p-6 space-y-6 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border-hairline pb-4">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Reader Comments</h3>
                <p className="text-xs text-outline line-clamp-1">{activeCommentsItem.header}</p>
              </div>
              <button
                onClick={() => setActiveCommentsItem(null)}
                className="w-8 h-8 rounded-full text-on-surface hover:bg-surface-tinted flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-4">
              {(activeCommentsItem.comments || []).length === 0 ? (
                <div className="text-center py-8 text-outline text-sm">No comments submitted yet.</div>
              ) : (
                activeCommentsItem.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="p-4 rounded-2xl bg-surface border border-border-hairline space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-on-surface">{comment.name}</span>
                        {comment.email && <span className="text-xs text-outline">({comment.email})</span>}
                        {comment.approved === false && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-error/10 text-error uppercase">
                            Hidden
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-outline">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant whitespace-pre-line">{comment.comment}</p>
                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-border-hairline">
                      <button
                        onClick={() => handleToggleCommentApproval(activeCommentsItem._id, comment._id)}
                        className="px-3 py-1 rounded-lg bg-surface-tinted text-xs font-bold text-primary hover:bg-primary hover:text-on-primary transition-colors"
                      >
                        {comment.approved === false ? 'Approve & Show' : 'Hide from Public'}
                      </button>
                      <button
                        onClick={() => handleDeleteComment(activeCommentsItem._id, comment._id)}
                        className="px-3 py-1 rounded-lg text-xs font-bold text-error hover:bg-error/10 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-clinical rounded-2xl max-w-sm w-full p-6 border border-border-hairline shadow-xl text-center space-y-4 animate-scale-in">
            <span className="material-symbols-outlined text-[48px] text-error">warning</span>
            <h3 className="text-lg font-bold text-on-surface">Delete Collaboration Story?</h3>
            <p className="text-sm text-on-surface-variant">
              This will permanently remove this partnership story and all reader comments.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-border-hairline text-sm font-bold text-on-surface hover:bg-surface-tinted"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-error text-on-error text-sm font-bold hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
