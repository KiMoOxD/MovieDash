// Subscriptions.jsx
import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import Modal from '../components/Modal';
import subscriptionsApi from '../api/subscriptions';
import { useToast } from '../contexts/ToastContext';

export default function Subscriptions() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  // action flags
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);

  // Form state for Add/Edit - backend fields: planName, price, durationDays, description
  const [formData, setFormData] = useState({
    planName: '',
    price: 0,
    durationDays: 30,
    description: ''
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

  const loadSubscriptions = async (config) => {
    setLoading(true);
    try {
      const res = await subscriptionsApi.getAllSubscriptions(config);
      const data = res.data ?? res;
      const normalized = (Array.isArray(data) ? data : []).map((s) => ({
        ...s,
        // backend uses subId as the subscription identifier
        subId: s.subId ?? s.subscriptionId ?? s.id ?? s._id ?? null,
        planName: s.planName ?? s.name ?? '',
        price: typeof s.price === 'number' ? s.price : Number(s.price) || 0,
        durationDays: s.durationDays ?? s.duration ?? s.days ?? 0,
        description: s.description ?? ''
      }));
      setPlans(normalized);
    } catch (err) {
      console.error('loadSubscriptions error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadSubscriptions({ signal: controller.signal });
    return () => controller.abort();
  }, []);

  // Handlers
  const handleAddPlan = async () => {
    setIsAdding(true);
    try {
      const payload = {
        planName: formData.planName,
        price: Number(formData.price),
        durationDays: Number(formData.durationDays),
        description: formData.description
      };
      await subscriptionsApi.addSubscription(payload);
      setIsAddModalOpen(false);
      resetForm();
      await loadSubscriptions();
    } catch (err) {
      console.error('addSubscription error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditPlan = async () => {
    if (!currentPlan) return;
    setIsUpdating(true);
    try {
      const payload = {
        planName: formData.planName,
        price: Number(formData.price),
        durationDays: Number(formData.durationDays),
        description: formData.description
      };
  await subscriptionsApi.updateSubscription(currentPlan.subId, payload);
      setIsEditModalOpen(false);
      resetForm();
      await loadSubscriptions();
    } catch (err) {
      console.error('updateSubscription error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!currentPlan) return;
    setIsDeleting(true);
    try {
  await subscriptionsApi.deleteSubscription(currentPlan.subId);
      setIsDeleteModalOpen(false);
      await loadSubscriptions();
    } catch (err) {
      console.error('deleteSubscription error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      planName: '',
      price: 0,
      durationDays: 30,
      description: ''
    });
  };

  const openEditModal = (plan) => {
    setCurrentPlan(plan);
    setFormData({
      planName: plan.planName ?? plan.name ?? '',
      price: plan.price ?? 0,
      durationDays: plan.durationDays ?? plan.duration ?? 0,
      description: plan.description ?? ''
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (plan) => {
    setCurrentPlan(plan);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Subscription Plans</h1>
          <p className="text-gray-500">Manage subscription plans and pricing</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <span>+</span> Add New Plan
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-700">
              <th className="px-3 py-3">ID</th>
              <th className="px-3 py-3">Plan Name</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">Duration (Days)</th>
              <th className="px-3 py-3">Description</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <svg className="animate-spin h-6 w-6 mx-auto text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <div className="text-sm text-gray-500 mt-2">Loading subscription plans...</div>
                </td>
              </tr>
            ) : (
              plans.map((plan) => (
                <tr key={plan.subId ?? plan.planName ?? Math.random()} className="hover:bg-gray-50">
                  <td className="px-3 py-4 text-xs">{plan.subId ?? '-'}</td>
                  <td className="px-3 py-4 text-xs">{plan.planName}</td>
                  <td className="px-3 py-4 text-xs">${(Number(plan.price) || 0).toFixed(2)}</td>
                  <td className="px-3 py-4 text-xs">{plan.durationDays}</td>
                  <td className="px-3 py-4 text-xs truncate max-w-xs">{plan.description}</td>
                  <td className="px-3 py-4 text-xs">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(plan)}
                        className="text-gray-600 hover:text-gray-900"
                        disabled={isAdding || isUpdating || isDeleting}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        onClick={() => openDeleteModal(plan)}
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

      {/* Add Plan Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Plan"
      >
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
            <input
              type="text"
              value={formData.planName}
              onChange={(e) => setFormData({...formData, planName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter plan name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
              <input
                type="number"
                min="1"
                value={formData.durationDays}
                onChange={(e) => setFormData({...formData, durationDays: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter plan description"
            />
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
            onClick={handleAddPlan}
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

      {/* Edit Plan Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Subscription Plan"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
            <input
              type="text"
              value={formData.planName}
              onChange={(e) => setFormData({...formData, planName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
              <input
                type="number"
                min="1"
                value={formData.durationDays}
                onChange={(e) => setFormData({...formData, durationDays: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
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
            onClick={handleEditPlan}
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
          This action cannot be undone. This will permanently delete the subscription plan.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeletePlan}
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