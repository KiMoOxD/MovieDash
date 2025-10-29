// Users.jsx
import React, { useState } from 'react';
import { FaPencilAlt, FaTrash, FaUserPlus } from 'react-icons/fa';
import Modal from '../components/Modal';

export default function Users() {
  // Mock data - replace with API later
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      password: "password123", // In real app, never store plain text!
      role: "Admin",
      status: "Active",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Emma Wilson",
      email: "emma@example.com",
      password: "password123",
      role: "User",
      status: "Active",
      createdAt: "2024-02-20"
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      password: "password123",
      role: "User",
      status: "Inactive",
      createdAt: "2024-03-10"
    }
  ]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    isActive: true
  });

  // Handlers
  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      ...formData,
      status: formData.isActive ? "Active" : "Inactive",
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditUser = () => {
    setUsers(users.map(u => u.id === currentUser.id ? {
      ...u,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      status: formData.isActive ? "Active" : "Inactive"
    } : u));
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteUser = () => {
    setUsers(users.filter(u => u.id !== currentUser.id));
    setIsDeleteModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: '',
      isActive: true
    });
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password, // For demo only — never show real passwords!
      role: user.role,
      isActive: user.status === "Active"
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-gray-500">Manage your user base</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaUserPlus className="h-4 w-4" /> Add New User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-700">
              <th className="px-3 py-3">ID</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Email</th>
              <th className="px-3 py-3">Password</th>
              <th className="px-3 py-3">Role</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Created At</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 text-xs">{user.id}</td>
                <td className="px-3 py-4 text-xs">{user.name}</td>
                <td className="px-3 py-4 text-xs">{user.email}</td>
                <td className="px-3 py-4 text-xs">********</td>
                <td className="px-3 py-4 text-xs">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === "Admin" 
                      ? "bg-gray-900 text-white" 
                      : "bg-gray-200 text-gray-800"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === "Active" 
                      ? "bg-gray-900 text-white" 
                      : "bg-gray-200 text-gray-800"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{user.createdAt}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => openDeleteModal(user)}
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

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter user name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter user email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Admin, User, Moderator"
            />
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
            onClick={handleAddUser}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Create
          </button>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            onClick={handleEditUser}
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
          This action cannot be undone. This will permanently delete the user.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteUser}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}