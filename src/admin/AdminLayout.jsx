import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, logout, isSuperAdmin, changePassword } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Change Password Modal State
  const [changePwdModalOpen, setChangePwdModalOpen] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (!newPwd || newPwd.length < 8) {
      setPwdError('New password must be at least 8 characters long.');
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError('New password and confirmation do not match.');
      return;
    }

    setPwdError('');
    setPwdSuccess('');
    setPwdSaving(true);

    try {
      const result = await changePassword(newPwd, currentPwd);
      setPwdSaving(false);
      if (result.success) {
        setPwdSuccess('Your password has been changed successfully!');
        setCurrentPwd('');
        setNewPwd('');
        setConfirmPwd('');
        setTimeout(() => {
          setChangePwdModalOpen(false);
          setPwdSuccess('');
        }, 1500);
      } else {
        setPwdError(result.message || 'Failed to update password.');
      }
    } catch {
      setPwdSaving(false);
      setPwdError('Network error while updating password.');
    }
  };

  const navItems = [
    { label: 'Overview', to: '/admin', icon: 'dashboard', end: true },
    {
      group: 'Company Products & Sales',
      items: [
        { label: 'Products Catalog', to: '/admin/products', icon: 'inventory_2' },
        { label: 'Sales & Cash Register', to: '/admin/products/sales', icon: 'point_of_sale' },
      ],
    },
    {
      group: 'Veterinary Clinical Ops',
      items: [
        { label: 'Vet Daily Work Console', to: '/admin/vet/dashboard', icon: 'stethoscope' },
        { label: 'Triage Tickets', to: '/admin/appointments', icon: 'crisis_alert' },
      ],
    },
    {
      group: 'Services & Content',
      items: [
        { label: 'Clinical Services', to: '/admin/services', icon: 'medical_services' },
        { label: 'Office Locations & Hubs', to: '/admin/hubs', icon: 'location_on' },
        { label: 'Collaborations & Stories', to: '/admin/collaborations', icon: 'handshake' },
        { label: 'Veterinary Team', to: '/admin/team', icon: 'group' },
        { label: 'Homepage Copy', to: '/admin/content/home', icon: 'home' },
        { label: 'FAQs', to: '/admin/faqs', icon: 'quiz' },
        { label: 'Media Library', to: '/admin/media', icon: 'photo_library' },
      ],
    },
    {
      group: 'System & Security',
      items: [
        { label: 'Website Settings', to: '/admin/settings', icon: 'tune' },
        ...(isSuperAdmin
          ? [
            { label: 'Administrators', to: '/admin/users', icon: 'manage_accounts' },
            { label: 'Activity Logs', to: '/admin/audit-logs', icon: 'history' },
          ]
          : []),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-surface flex text-on-surface antialiased">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-surface-clinical border-r border-border-hairline shadow-sm shrink-0">
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-border-hairline bg-surface-tinted/40">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm font-bold text-headline-sm">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-primary leading-tight tracking-tight">
                ANIHEAL VETSPACE
              </span>
              <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                SLTNS LTD
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {navItems.map((item, idx) => {
            if (item.group) {
              return (
                <div key={idx} className="space-y-1.5">
                  <span className="px-3 text-label-sm font-label-sm uppercase tracking-wider text-outline font-bold block">
                    {item.group}
                  </span>
                  <div className="space-y-1">
                    {item.items.map((subItem) => (
                      <NavLink
                        key={subItem.to}
                        to={subItem.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-label-md text-label-md transition-colors ${isActive
                            ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                            : 'text-on-surface-variant hover:bg-surface-tinted hover:text-primary font-medium'
                          }`
                        }
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {subItem.icon}
                        </span>
                        <span>{subItem.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-label-md text-label-md transition-colors ${isActive
                    ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-tinted hover:text-primary font-medium'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User Badge & Logout Bottom Bar */}
        <div className="p-4 border-t border-border-hairline bg-surface-subtle">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-surface-clinical border border-border-hairline">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-surface-tinted flex items-center justify-center text-primary font-bold shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm font-bold text-on-surface truncate">
                  {user?.name || 'Administrator'}
                </span>
                <span className="font-label-sm text-[10px] text-secondary capitalize font-semibold">
                  {user?.role || 'editor'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setPwdError('');
                  setPwdSuccess('');
                  setCurrentPwd('');
                  setNewPwd('');
                  setConfirmPwd('');
                  setChangePwdModalOpen(true);
                }}
                title="Change Password"
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-tinted transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">key</span>
              </button>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 rounded-lg text-error hover:bg-error-container/40 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-20 bg-surface-clinical border-b border-border-hairline px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-on-surface hover:bg-surface-tinted"
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm font-bold hover:bg-secondary-container transition-colors border border-border-accent"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>View Live Website</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
          <div className="relative w-72 bg-surface-clinical flex flex-col h-full z-10 shadow-2xl">
            <div className="h-20 px-6 flex items-center justify-between border-b border-border-hairline bg-surface-tinted/40">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-primary leading-tight tracking-tight">
                  ANIHEAL VETSPACE
                </span>
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  SLTNS LTD
                </span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-tinted"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {navItems.map((item, idx) => {
                if (item.group) {
                  return (
                    <div key={idx} className="space-y-1">
                      <span className="px-3 text-label-sm font-label-sm uppercase tracking-wider text-outline font-bold">
                        {item.group}
                      </span>
                      {item.items.map((subItem) => (
                        <NavLink
                          key={subItem.to}
                          to={subItem.to}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg font-label-md ${isActive
                              ? 'bg-primary text-on-primary font-bold'
                              : 'text-on-surface-variant hover:bg-surface-tinted'
                            }`
                          }
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {subItem.icon}
                          </span>
                          <span>{subItem.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  );
                }
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg font-label-md ${isActive
                        ? 'bg-primary text-on-primary font-bold'
                        : 'text-on-surface-variant hover:bg-surface-tinted'
                      }`
                    }
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
            <div className="p-4 border-t border-border-hairline">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-error-container text-error font-bold font-label-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {changePwdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface-clinical rounded-2xl border border-border-hairline shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border-hairline pb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">lock_reset</span>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Change Account Password
                </h3>
              </div>
              <button
                onClick={() => setChangePwdModalOpen(false)}
                className="p-1 text-on-surface-variant hover:text-primary rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {pwdError && (
              <div className="p-3 rounded-xl bg-error-container text-on-error-container text-body-sm font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-error shrink-0">error</span>
                <span>{pwdError}</span>
              </div>
            )}

            {pwdSuccess && (
              <div className="p-3 rounded-xl bg-surface-tinted text-primary text-body-sm font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>
                <span>{pwdSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md font-bold text-on-surface mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle focus:bg-surface-clinical focus:outline-none focus:border-primary font-body-md"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md font-bold text-on-surface mb-1">
                  New Password (min 8 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle focus:bg-surface-clinical focus:outline-none focus:border-primary font-body-md"
                  placeholder="Enter new secure password"
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md font-bold text-on-surface mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-hairline bg-surface-subtle focus:bg-surface-clinical focus:outline-none focus:border-primary font-body-md"
                  placeholder="Re-enter new password"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-hairline">
                <button
                  type="button"
                  onClick={() => setChangePwdModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border-hairline font-label-md text-on-surface-variant hover:bg-surface-tinted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwdSaving || newPwd.length < 8 || newPwd !== confirmPwd}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {pwdSaving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
