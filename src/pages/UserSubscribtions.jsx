// UserSubscriptions.jsx
import React, { useState } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import Modal from '../components/Modal'; // Reusing your existing modal component

export default function UserSubscriptions() {
  // Mock data - replace with API later
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      userId: 1,
      subscriptionId: 3,
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      status: "Active"
    },
    {
      id: 2,
      userId: 2,
      subscriptionId: 1,
      startDate: "2024-02-20",
      endDate: "2024-03-20",
      status: "Active"
    },
    {
      id: 3,
      userId: 3,
      subscriptionId: 2,
      startDate: "2023-12-10",
      endDate: "2024-01-10",
      status: "Inactive"
    }
  ]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    userId: '',
    subscriptionId: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  // Handlers
  const handleAddAssignment = () => {
    const newAssignment = {
      id: assignments.length + 1,
      userId: parseInt(formData.userId),
      subscriptionId: parseInt(formData.subscriptionId),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.isActive ? "Active" : "Inactive"
    };
    setAssignments([...assignments, newAssignment]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditAssignment = () => {
    setAssignments(assignments.map(a => a.id === currentAssignment.id ? {
      ...a,
      userId: parseInt(formData.userId),
      subscriptionId: parseInt(formData.subscriptionId),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.isActive ? "Active" : "Inactive"
    } : a));
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteAssignment = () => {
    setAssignments(assignments.filter(a => a.id !== currentAssignment.id));
    setIsDeleteModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      subscriptionId: '',
      startDate: '',
      endDate: '',
      isActive: true
    });
  };

  const openEditModal = (assignment) => {
    setCurrentAssignment(assignment);
    setFormData({
      userId: assignment.userId.toString(),
      subscriptionId: assignment.subscriptionId.toString(),
      startDate: assignment.startDate,
      endDate: assignment.endDate,
      isActive: assignment.status === "Active"
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
            {assignments.map((assignment) => (
              <tr key={assignment.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 text-xs">{assignment.id}</td>
                <td className="px-3 py-4 text-xs">{assignment.userId}</td>
                <td className="px-3 py-4 text-xs">{assignment.subscriptionId}</td>
                <td className="px-3 py-4 text-xs">{assignment.startDate}</td>
                <td className="px-3 py-4 text-xs">{assignment.endDate}</td>
                <td className="px-3 py-4 text-xs">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    assignment.status === "Active" 
                      ? "bg-gray-900 text-white" 
                      : "bg-gray-200 text-gray-800"
                  }`}>
                    {assignment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(assignment)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => openDeleteModal(assignment)}
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
                value={formData.subscriptionId}
                onChange={(e) => setFormData({...formData, subscriptionId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="text"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="mm/dd/yyyy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="text"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="mm/dd/yyyy"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Active Status</label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input
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
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Create
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
                value={formData.subscriptionId}
                onChange={(e) => setFormData({...formData, subscriptionId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="text"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="text"
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
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}