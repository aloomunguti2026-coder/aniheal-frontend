import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { notifyContentUpdated } from '../../services/eventBus';
import { useConfirm } from '../../context/ConfirmContext';

export default function AdminFAQs() {
  const { confirm, alert: showAlert } = useConfirm();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general',
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/faqs');
      if (res.success) {
        setFaqs(res.data);
      }
    } catch (err) {
      console.error('Failed to load FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'general',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'general',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, questionText) => {
    const isConfirmed = await confirm({
      title: 'Delete FAQ',
      message: questionText
        ? `Are you sure you want to delete FAQ: "${questionText}"?`
        : 'Are you sure you want to permanently delete this FAQ item?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (!isConfirmed) return;

    try {
      const res = await api.delete(`/admin/faqs/${id}`);
      if (res.success) {
        setFaqs((prev) => prev.filter((f) => f._id !== id));
        notifyContentUpdated();
      }
    } catch (err) {
      await showAlert({
        title: 'Action Failed',
        message: 'Failed to delete FAQ: ' + err.message,
        type: 'error',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingFaq) {
        const res = await api.put(`/admin/faqs/${editingFaq._id}`, formData);
        if (res.success) {
          setFaqs((prev) =>
            prev.map((f) => (f._id === editingFaq._id ? res.data : f))
          );
          setIsModalOpen(false);
          notifyContentUpdated();
        }
      } else {
        const res = await api.post('/admin/faqs', formData);
        if (res.success) {
          setFaqs((prev) => [...prev, res.data]);
          setIsModalOpen(false);
          notifyContentUpdated();
        }
      }
    } catch (err) {
      await showAlert({
        title: 'Save Failed',
        message: 'Failed to save FAQ: ' + err.message,
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">
            Frequently Asked Questions (FAQs)
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage accordion Q&amp;As for emergency responses, M-Pesa billing, and farm biosafety.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-sm hover:bg-primary-container transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Add New FAQ</span>
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-on-surface-variant">
            Loading FAQs...
          </div>
        ) : faqs.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant">
            No FAQs found.
          </div>
        ) : (
          faqs.map((faq, i) => (
            <div
              key={faq._id}
              className="bg-surface-clinical rounded-2xl p-5 shadow-sm border border-border-hairline flex items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-surface-tinted text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    {faq.question}
                  </h3>
                </div>
                <p className="text-body-sm text-on-surface-variant leading-relaxed pl-8">
                  {faq.answer}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleOpenEdit(faq)}
                  className="p-1.5 rounded-lg text-primary hover:bg-surface-tinted transition-colors"
                  title="Edit FAQ"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(faq._id)}
                  className="p-1.5 rounded-lg text-error hover:bg-error-container/40 transition-colors"
                  title="Delete FAQ"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-clinical rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-border-hairline">
            <div className="flex items-center justify-between pb-3 border-b border-border-hairline mb-4">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                {editingFaq ? 'Edit FAQ Item' : 'Add New FAQ Item'}
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
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary"
                  placeholder="e.g. What payment methods are supported?"
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  Answer *
                </label>
                <textarea
                  rows="5"
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full p-3 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                  placeholder="Provide procedural clarity for farmers and clients..."
                ></textarea>
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
                  {saving ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
