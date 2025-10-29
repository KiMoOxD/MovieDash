// Subscriptions.jsx
import React, { useState } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import Modal from '../components/Modal';

export default function Subscriptions() {
  // Mock data - replace with API later
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Basic",
      price: 9.99,
      duration: 30,
      description: "Access to basic content library"
    },
    {
      id: 2,
      name: "Standard",
      price: 14.99,
      duration: 30,
      description: "Access to full content library with HD streaming"
    },
    {
      id: 3,
      name: "Premium",
      price: 19.99,
      duration: 30,
      description: "Full access with 4K streaming and multiple devices"
    },
    {
      id: 4,
      name: "Basic Annual",
      price: 99.99,
      duration: 365,
      description: "Basic plan for one year with discount"
    }
  ]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    duration: 30,
    description: ''
  });

  // Handlers
  const handleAddPlan = () => {
    const newPlan = {
      id: plans.length + 1,
      ...formData,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration)
    };
    setPlans([...plans, newPlan]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditPlan = () => {
    setPlans(plans.map(p => p.id === currentPlan.id ? {
      ...p,
      name: formData.name,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      description: formData.description
    } : p));
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeletePlan = () => {
    setPlans(plans.filter(p => p.id !== currentPlan.id));
    setIsDeleteModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      duration: 30,
      description: ''
    });
  };

  const openEditModal = (plan) => {
    setCurrentPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      description: plan.description
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
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 text-xs">{plan.id}</td>
                <td className="px-3 py-4 text-xs">{plan.name}</td>
                <td className="px-3 py-4 text-xs">${plan.price.toFixed(2)}</td>
                <td className="px-3 py-4 text-xs">{plan.duration}</td>
                <td className="px-3 py-4 text-xs truncate max-w-xs">{plan.description}</td>
                <td className="px-3 py-4 text-xs">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(plan)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => openDeleteModal(plan)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
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
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Create
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
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
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
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Update
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
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}