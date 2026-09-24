import React, { useState, useEffect } from 'react';
import api, { API_BASE_URL } from '../../services/api';
import { useConfirm } from '../../context/ConfirmContext';

export default function AdminMedia() {
  const { confirm, alert: showAlert } = useConfirm();
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await api.get('/media');
      if (res.success && res.data?.media) {
        setMediaList(res.data.media);
      }
    } catch (err) {
      console.error('Failed to load media files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', file.name);

    setUploading(true);
    try {
      const token = sessionStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const res = await response.json();
      if (res.success && res.data) {
        setMediaList((prev) => [res.data, ...prev]);
      } else {
        await showAlert({
          title: 'Upload Failed',
          message: res.message || 'Upload failed',
          type: 'error',
        });
      }
    } catch (err) {
      await showAlert({
        title: 'Upload Error',
        message: 'Upload error: ' + err.message,
        type: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopySuccess(url);
    setTimeout(() => setCopySuccess(''), 2500);
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: 'Delete Media Image',
      message: 'Are you sure you want to permanently delete this media image?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (!isConfirmed) return;

    try {
      const res = await api.delete(`/media/${id}`);
      if (res.success) {
        setMediaList((prev) => prev.filter((m) => m._id !== id));
      }
    } catch (err) {
      await showAlert({
        title: 'Action Failed',
        message: 'Failed to delete media: ' + err.message,
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">
            Media Library &amp; Asset Manager
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Upload clinic photos, ambulance assets, diagnostic case images, and copy direct URLs for content.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-sm hover:bg-primary-container transition-all cursor-pointer shrink-0">
          <span className="material-symbols-outlined text-[20px]">
            {uploading ? 'sync' : 'upload_file'}
          </span>
          <span>{uploading ? 'Uploading Image...' : 'Upload New Image'}</span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploading}
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {copySuccess && (
        <div className="p-3 bg-surface-tinted border border-border-accent rounded-xl text-primary font-label-md text-label-md font-bold flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">check</span>
          <span>Copied image URL to clipboard!</span>
        </div>
      )}

      {/* Grid of Images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-on-surface-variant">
            Loading media library...
          </div>
        ) : mediaList.length === 0 ? (
          <div className="col-span-full py-12 text-center text-on-surface-variant bg-surface-clinical rounded-2xl border border-border-hairline p-8">
            <span className="material-symbols-outlined text-[48px] text-outline block mb-2">
              photo_library
            </span>
            <p className="font-semibold text-on-surface">No uploaded images yet.</p>
            <p className="text-sm text-outline mt-1">
              Upload images to use them inside your clinical service cards, hero headers, or staff profiles.
            </p>
          </div>
        ) : (
          mediaList.map((item) => (
            <div
              key={item._id}
              className="bg-surface-clinical rounded-xl overflow-hidden shadow-sm border border-border-hairline group flex flex-col justify-between"
            >
              <div className="aspect-square bg-surface-container relative overflow-hidden">
                <img
                  src={item.url}
                  alt={item.altText || item.originalName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-2.5 bg-surface-subtle border-t border-border-hairline space-y-1.5">
                <div className="text-[11px] font-semibold text-on-surface truncate" title={item.originalName}>
                  {item.originalName}
                </div>
                <div className="flex items-center justify-between gap-1 pt-1">
                  <button
                    onClick={() => handleCopyUrl(item.url)}
                    className="flex-1 py-1 rounded bg-surface-clinical text-primary border border-border-hairline text-[11px] font-bold hover:bg-surface-tinted transition-colors flex items-center justify-center gap-1"
                    title="Copy URL"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    <span>Copy URL</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1 rounded text-error hover:bg-error-container/40"
                    title="Delete Image"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
