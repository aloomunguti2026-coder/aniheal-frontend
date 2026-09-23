import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConfirm } from '../../context/ConfirmContext';
import api from '../../services/api';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { confirm, alert: showAlert } = useConfirm();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const initialFormState = {
    name: '',
    email: '',
    password: '',
    role: 'editor',
    isActive: true,
    mustChangePassword: true,
  };
  const [formData, setFormData] = useState(initialFormState);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      if (res.success) {
        setUsers(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditUser(null);
    setFormData(initialFormState);
    setModalOpen(true);
  };

  const handleOpenEdit = (usr) => {
    setEditUser(usr);
    setFormData({
      name: usr.name,
      email: usr.email,
      password: '', // leave empty if unchanged
      role: usr.role || 'editor',
      isActive: usr.isActive !== undefined ? usr.isActive : true,
      mustChangePassword: !!usr.mustChangePassword,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveStatus(null);
    try {
      const payload = { ...formData };
      if (editUser && !payload.password) {
        delete payload.password;
      }

      const res = editUser
        ? await api.put(`/admin/users/${editUser._id}`, payload)
        : await api.post('/admin/users', payload);

      if (res.success) {
        setSaveStatus({ type: 'success', message: 'User account updated successfully!' });
        setModalOpen(false);
        loadUsers();
      } else {
        setSaveStatus({ type: 'error', message: res.message || 'Failed to save user account.' });
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: err.message || 'Network error saving user account.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (u) => {
    const userId = typeof u === 'object' ? u._id : u;
    const userName = typeof u === 'object' ? u.name : '';

    const isConfirmed = await confirm({
      title: 'Deactivate / Delete Administrator',
      message: userName
        ? `Are you sure you want to deactivate or delete the account for "${userName}"?`
        : 'Are you sure you want to deactivate or delete this administrator?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (!isConfirmed) return;

    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.success) {
        loadUsers();
      } else {
        await showAlert({
          title: 'Action Failed',
          message: res.message || 'Failed to delete user',
          type: 'error',
        });
      }
    } catch (err) {
      await showAlert({
        title: 'Action Failed',
        message: err.message || 'Error deleting user',
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-clinical p-6 rounded-2xl border border-border-hairline shadow-sm">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">
            Staff & Administrators
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage authorized staff credentials, roles, and administrative access permissions.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-dark transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          <span>Create Administrator</span>
        </button>
      </div>

      {saveStatus && (
        <div
          className={`p-4 rounded-xl font-label-md ${
            saveStatus.type === 'success'
              ? 'bg-secondary-container text-on-secondary-container border border-border-accent'
              : 'bg-error-container text-error'
          }`}
        >
          {saveStatus.message}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-surface-clinical rounded-2xl border border-border-hairline overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border-hairline flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm text-primary font-bold">
            All Admin Accounts ({users.length})
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-on-surface-variant font-body-md">
            <span className="material-symbols-outlined animate-spin text-[32px] text-primary mb-2">
              sync
            </span>
            <p>Loading administrators...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant font-body-md">
            No administrator accounts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-md">
              <thead className="bg-surface-subtle text-outline font-label-sm uppercase tracking-wider text-label-sm border-b border-border-hairline">
                <tr>
                  <th className="py-3.5 px-6">Administrator</th>
                  <th className="py-3.5 px-6">Email Address</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline">
                {users.map((usr) => (
                  <tr key={usr._id} className="hover:bg-surface-tinted/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-on-surface">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-label-sm">
                          {usr.name ? usr.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div>{usr.name}</div>
                          {usr._id === currentUser?.id && (
                            <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                              Current User
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant font-mono text-body-sm">
                      <div>{usr.email}</div>
                      {usr.mustChangePassword && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-800 mt-0.5">
                          <span className="material-symbols-outlined text-[12px]">key</span>
                          Temporary Password
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider ${
                          usr.role === 'superadmin'
                            ? 'bg-primary text-on-primary'
                            : usr.role === 'admin'
                            ? 'bg-indigo-600 text-white'
                            : usr.role === 'vet'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-secondary-container text-on-secondary-container border border-border-accent'
                        }`}
                      >
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold ${
                          usr.isActive
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-error-container text-error'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            usr.isActive ? 'bg-primary' : 'bg-error'
                          }`}
                        ></span>
                        {usr.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(usr)}
                        className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-tinted rounded-lg transition-colors cursor-pointer"
                        title="Edit User"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      {usr._id !== currentUser?.id && (
                        <button
                          onClick={() => handleDelete(usr._id)}
                          className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/40 rounded-lg transition-colors cursor-pointer"
                          title="Delete User"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface-clinical rounded-2xl border border-border-hairline shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border-hairline pb-4">
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                {editUser ? 'Edit Administrator' : 'Create New Administrator'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-on-surface-variant hover:text-primary rounded-lg"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md font-bold text-on-surface mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle focus:bg-surface-clinical focus:outline-none focus:border-primary font-body-md"
                  placeholder="e.g. Dr. Jane Doe"
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md font-bold text-on-surface mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle focus:bg-surface-clinical focus:outline-none focus:border-primary font-body-md"
                  placeholder="name@aniheal.co.ke"
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md font-bold text-on-surface mb-1.5">
                  Password {editUser && <span className="text-outline font-normal">(leave blank to keep unchanged)</span>}
                </label>
                <input
                  type="password"
                  required={!editUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle focus:bg-surface-clinical focus:outline-none focus:border-primary font-body-md"
                  placeholder={editUser ? '••••••••' : 'Temporary or permanent password (min 8 chars)'}
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="mustChangePassword"
                  checked={formData.mustChangePassword}
                  onChange={(e) => setFormData({ ...formData, mustChangePassword: e.target.checked })}
                  className="w-4 h-4 rounded text-primary border-border-hairline focus:ring-primary"
                />
                <label htmlFor="mustChangePassword" className="text-body-sm font-semibold text-on-surface cursor-pointer">
                  Require password change on user's first login
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md font-bold text-on-surface mb-1.5">
                    Access Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle focus:bg-surface-clinical focus:outline-none focus:border-primary font-body-md font-semibold"
                  >
                    <option value="superadmin">Super Admin (Full Access)</option>
                    <option value="admin">Admin (Staff & Content)</option>
                    <option value="vet">Field Vet (Clinical Logs & Cases)</option>
                    <option value="editor">Editor (Content & Services)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-label-md font-bold text-on-surface mb-1.5">
                    Account Status
                  </label>
                  <select
                    value={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle focus:bg-surface-clinical focus:outline-none focus:border-primary font-body-md font-semibold"
                  >
                    <option value="true">Active</option>
                    <option value="false">Disabled / Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-hairline">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-border-hairline font-label-md text-on-surface-variant hover:bg-surface-tinted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {saveLoading ? 'Saving...' : 'Save User Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
