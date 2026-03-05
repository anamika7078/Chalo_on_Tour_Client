'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';
import { UserCog, Users, LogIn, Mail, Phone, Shield, Eye, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const LOGGED_IN_WINDOW_MS = 15 * 60 * 1000;

function formatLastLogin(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < LOGGED_IN_WINDOW_MS) return 'Logged in now';
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
}

function isLoggedInNow(lastLogin) {
  if (!lastLogin) return false;
  return new Date() - new Date(lastLogin) < LOGGED_IN_WINDOW_MS;
}

const fetchDetails = () => api.get('/users/details').then((r) => ({
  users: r.data?.users || [],
  loggedInCount: r.data?.loggedInCount ?? 0,
  totalUsers: r.data?.totalUsers ?? 0,
}));

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loggedInCount, setLoggedInCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', role: 'staff', phone: '', isActive: true });
  const [editSaving, setEditSaving] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadDetails = () => {
    setLoading(true);
    fetchDetails()
      .then(({ users: u, loggedInCount: c, totalUsers: t }) => {
        setUsers(u);
        setLoggedInCount(c);
        setTotalUsers(t);
      })
      .catch(() => {
        toast.error('Failed to load user details');
        setUsers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authLoading || !user) return;
    if (user.role !== 'superadmin') {
      toast.error('Only Super Admin can view user details');
      router.replace('/admin/dashboard');
      return;
    }
    loadDetails();
  }, [user, authLoading, router]);

  if (authLoading || (user && user.role !== 'superadmin')) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-red-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">User details</h1>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
              <LogIn className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Logged in now</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '—' : loggedInCount}</p>
              <p className="text-xs text-gray-400">Last 15 minutes</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total users</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '—' : totalUsers}</p>
              <p className="text-xs text-gray-400">Staff & Super Admin</p>
            </div>
          </div>
        </div>

        {/* User table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <UserCog className="h-5 w-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">All users</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-red-500" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Last login</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">{u.firstName} {u.lastName}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        {u.email}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${u.role === 'superadmin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                          <Shield className="h-3 w-3" />
                          {u.role === 'superadmin' ? 'Super Admin' : 'Staff'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {u.phone ? <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-gray-400" />{u.phone}</span> : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={isLoggedInNow(u.lastLogin) ? 'text-green-600 font-medium' : 'text-gray-600'}>
                          {formatLastLogin(u.lastLogin)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={u.isActive !== false ? 'text-green-600' : 'text-red-600'}>
                          {u.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button type="button" onClick={() => setViewUser(u)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700" title="View">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => { setEditUser(u); setEditForm({ firstName: u.firstName || '', lastName: u.lastName || '', email: u.email || '', role: u.role || 'staff', phone: u.phone || '', isActive: u.isActive !== false }); }} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => setDeleteUserId(u._id)} disabled={u._id === user?.id} className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed" title={u._id === user?.id ? 'Cannot delete yourself' : 'Delete'}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View modal */}
        {viewUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setViewUser(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">User details</h3>
                <button type="button" onClick={() => setViewUser(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-3 text-sm">
                <p><span className="text-gray-500">Name:</span> <span className="font-medium">{viewUser.firstName} {viewUser.lastName}</span></p>
                <p><span className="text-gray-500">Email:</span> {viewUser.email}</p>
                <p><span className="text-gray-500">Role:</span> {viewUser.role === 'superadmin' ? 'Super Admin' : 'Staff'}</p>
                <p><span className="text-gray-500">Phone:</span> {viewUser.phone || '—'}</p>
                <p><span className="text-gray-500">Last login:</span> {formatLastLogin(viewUser.lastLogin)}</p>
                <p><span className="text-gray-500">Status:</span> <span className={viewUser.isActive !== false ? 'text-green-600' : 'text-red-600'}>{viewUser.isActive !== false ? 'Active' : 'Inactive'}</span></p>
              </div>
              <div className="mt-4 flex justify-end">
                <button type="button" onClick={() => setViewUser(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit modal */}
        {editUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !editSaving && setEditUser(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit user</h3>
                <button type="button" onClick={() => !editSaving && setEditUser(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setEditSaving(true);
                try {
                  await api.put(`/users/${editUser._id}`, editForm);
                  toast.success('User updated');
                  setEditUser(null);
                  loadDetails();
                } catch (err) {
                  toast.error(err.response?.data?.message || 'Update failed');
                } finally {
                  setEditSaving(false);
                }
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                    <input type="text" value={editForm.firstName} onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                    <input type="text" value={editForm.lastName} onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select value={editForm.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white">
                    <option value="staff">Staff</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="edit-active" checked={editForm.isActive} onChange={(e) => setEditForm((f) => ({ ...f, isActive: e.target.checked }))} className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                  <label htmlFor="edit-active" className="text-sm font-medium text-gray-700">Active</label>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => !editSaving && setEditUser(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                  <button type="submit" disabled={editSaving} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-60 inline-flex items-center gap-2">
                    {editSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete confirm */}
        {deleteUserId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !deleteLoading && setDeleteUserId(null)}>
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Deactivate user?</h3>
              <p className="text-sm text-gray-600 mb-4">The user will be marked inactive and cannot log in. You can reactivate them later from Edit.</p>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => !deleteLoading && setDeleteUserId(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                <button type="button" onClick={async () => {
                  setDeleteLoading(true);
                  try {
                    await api.delete(`/users/${deleteUserId}`);
                    toast.success('User deactivated');
                    setDeleteUserId(null);
                    loadDetails();
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Failed to deactivate');
                  } finally {
                    setDeleteLoading(false);
                  }
                }} disabled={deleteLoading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-60 inline-flex items-center gap-2">
                  {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
