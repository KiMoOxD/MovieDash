// UserSubscriptions.jsx
import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import Modal from '../components/Modal'; // Reusing your existing modal component
import userSubscriptionsApi from '../api/userSubscriptions';
import { useToast } from '../contexts/ToastContext';

export default function UserSubscriptions() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    userId: '',
    subId: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  const { addToast } = useToast();
  const showApiErrors = (err) => {
    if (err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError' || /cancel/i.test(err?.message || '')) return;
    const problems = err?.response?.data;
    if (typeof problems === 'string' && problems.trim()) {
      addToast(problems, { type: 'error' });
      return;
    }
    if (problems?.errors && typeof problems.errors === 'object') {
      Object.values(problems.errors).forEach((arr) => {
        if (Array.isArray(arr)) arr.forEach((m) => addToast(m, { type: 'error' }));
        else addToast(String(arr), { type: 'error' });
      });
      return;
    }
    const title = problems?.title || problems?.message || err?.message || 'An error occurred';
    addToast(title, { type: 'error' });
  };

  const loadAssignments = async (config) => {
    setLoading(true);
    try {
      const res = await userSubscriptionsApi.getAllUserSubs(config);
      const data = res.data ?? res;
      const normalized = (Array.isArray(data) ? data : []).map((s) => ({
        ...s,
        // prefer backend record id if present
        userSubId: s.userSubId ?? s.id ?? s._id ?? null,
        userId: s.userId ?? s.user ?? null,
        subId: s.subId ?? s.subscriptionId ?? s.subscription ?? null,
        startDate: s.startDate ? new Date(s.startDate).toISOString().split('T')[0] : '',
        endDate: s.endDate ? new Date(s.endDate).toISOString().split('T')[0] : '',
        isActive: typeof s.isActive === 'boolean' ? s.isActive : (s.status === 'Active')
      }));
      setAssignments(normalized);
    } catch (err) {
      console.error('loadAssignments error', err.response ?? err);
      // If backend returns 404 with a plain-text "no records" message,
      // treat it as an empty list instead of leaving stale data in the UI.
      const resp = err?.response;
      if (resp && (resp.status === 404 || resp.status === 204)) {
        const body = resp.data;
        if (typeof body === 'string' && body.trim()) {
          // clear assignments and show a neutral/info toast instead of an error
          setAssignments([]);
          addToast(body, { type: 'info' });
          return;
        }
        // no body -> just clear
        setAssignments([]);
        return;
      }
      showApiErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadAssignments({ signal: controller.signal });
    return () => controller.abort();
  }, []);

  // Handlers
  const handleAddAssignment = async () => {
    setIsAdding(true);
    try {
      // backend expects top-level fields (id is assigned server-side)
      const payload = {
        userId: Number(formData.userId),
        subId: Number(formData.subId),
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        isActive: Boolean(formData.isActive)
      };
      await userSubscriptionsApi.addUserSub(payload);
      setIsAddModalOpen(false);
      resetForm();
      await loadAssignments();
    } catch (err) {
      console.error('addUserSub error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditAssignment = async () => {
    if (!currentAssignment) return;
    setIsUpdating(true);
    try {
      const payload = {
        userId: Number(formData.userId),
        subId: Number(formData.subId),
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        isActive: Boolean(formData.isActive)
      };
      // prefer normalized userSubId, fall back to raw id
      const recordId = currentAssignment.userSubId ?? currentAssignment.id ?? currentAssignment._id;
      await userSubscriptionsApi.updateUserSub(recordId, payload);
      setIsEditModalOpen(false);
      resetForm();
      await loadAssignments();
    } catch (err) {
      console.error('updateUserSub error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAssignment = async () => {
    if (!currentAssignment) return;
    setIsDeleting(true);
    try {
      // prefer normalized userSubId, fall back to raw id
      const recordId = currentAssignment.userSubId ?? currentAssignment.id ?? currentAssignment._id;
      await userSubscriptionsApi.deleteUserSub(recordId);
      setIsDeleteModalOpen(false);
      await loadAssignments();
    } catch (err) {
      console.error('deleteUserSub error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      subId: '',
      startDate: '',
      endDate: '',
      isActive: true
    });
  };

  const openEditModal = (assignment) => {
    setCurrentAssignment(assignment);
    setFormData({
      userId: (assignment.userId ?? assignment.user)?.toString() ?? '',
      subId: (assignment.subId ?? assignment.subscriptionId ?? assignment.subscription)?.toString() ?? '',
      startDate: assignment.startDate,
      endDate: assignment.endDate,
      isActive: Boolean(assignment.isActive)
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (assignment) => {
    setCurrentAssignment(assignment);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Subscriptions</h1>
          <p className="text-gray-500">Manage user subscription assignments</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <span>+</span> Add New Assignment
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-700">
              <th className="px-3 py-3">ID</th>
              <th className="px-3 py-3">User ID</th>
              <th className="px-3 py-3">Subscription ID</th>
              <th className="px-3 py-3">Start Date</th>
              <th className="px-3 py-3">End Date</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <svg className="animate-spin h-6 w-6 mx-auto text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <div className="text-sm text-gray-500 mt-2">Loading user subscriptions...</div>
                </td>
              </tr>
            ) : (
              assignments.map((assignment) => (
                <tr key={assignment.userSubId ?? `${assignment.userId}-${assignment.subId}` ?? Math.random()} className="hover:bg-gray-50">
                  <td className="px-3 py-4 text-xs">{assignment.userSubId ?? '-'}</td>
                  <td className="px-3 py-4 text-xs">{assignment.userId}</td>
                  <td className="px-3 py-4 text-xs">{assignment.subId}</td>
                  <td className="px-3 py-4 text-xs">{assignment.startDate}</td>
                  <td className="px-3 py-4 text-xs">{assignment.endDate}</td>
                  <td className="px-3 py-4 text-xs">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      assignment.isActive 
                        ? "bg-gray-900 text-white" 
                        : "bg-gray-200 text-gray-800"
                    }`}>
                      {assignment.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(assignment)}
                        className="text-gray-600 hover:text-gray-900"
                        disabled={isAdding || isUpdating || isDeleting}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        onClick={() => openDeleteModal(assignment)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isAdding || isUpdating || isDeleting}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Assignment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Assignment"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input
                type="number"
                value={formData.userId}
                onChange={(e) => setFormData({...formData, userId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subscription ID</label>
              <input
                type="number"
                value={formData.subId}
                onChange={(e) => setFormData({...formData, subId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Active Status</label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input
                id="toggle"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="toggle"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                  formData.isActive ? 'bg-gray-900' : 'bg-gray-300'
                }`}
              ></label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAddAssignment}
            disabled={isAdding}
            className={`px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 ${isAdding ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isAdding ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              'Create'
            )}
          </button>
        </div>
      </Modal>

      {/* Edit Assignment Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User Subscription"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input
                type="number"
                value={formData.userId}
                onChange={(e) => setFormData({...formData, userId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subscription ID</label>
              <input
                type="number"
                value={formData.subId}
                onChange={(e) => setFormData({...formData, subId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Active Status</label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input
                id="toggle"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="toggle"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                  formData.isActive ? 'bg-gray-900' : 'bg-gray-300'
                }`}
              ></label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleEditAssignment}
            disabled={isUpdating}
            className={`px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 ${isUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isUpdating ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Updating...
              </span>
            ) : (
              'Update'
            )}
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Are you sure?"
      >
        <p className="text-gray-600 mb-6">
          This action cannot be undone. This will permanently delete the user subscription assignment.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAssignment}
            disabled={isDeleting}
            className={`px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 ${isDeleting ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isDeleting ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Deleting...
              </span>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}