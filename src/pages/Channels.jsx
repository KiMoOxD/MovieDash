import React, { useState } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import Modal from '../components/Modal'; 

export default function Channels() {
  // Mock data - replace with API later
  const [channels, setChannels] = useState([
    {
      id: 1,
      name: "HBO",
      description: "Premium entertainment channel with original series and movies.",
      category: "Premium",
      url: "https://example.com/hbo",
      logoUrl: "https://example.com/hbo-logo.png"
    },
    {
      id: 2,
      name: "ESPN",
      description: "Sports broadcasting network covering live events and analysis.",
      category: "Sports",
      url: "https://example.com/espn",
      logoUrl: "https://example.com/espn-logo.png"
    },
    {
      id: 3,
      name: "Discovery",
      description: "Documentary and reality programming network.",
      category: "Documentary",
      url: "https://example.com/discovery",
      logoUrl: "https://example.com/discovery-logo.png"
    }
  ]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    url: 'https://example.com/channel',
    logoUrl: 'https://example.com/logo.png'
  });

  // Handlers
  const handleAddChannel = () => {
    const newChannel = {
      id: channels.length + 1,
      ...formData
    };
    setChannels([...channels, newChannel]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditChannel = () => {
    setChannels(channels.map(c => c.id === currentChannel.id ? { ...c, ...formData } : c));
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteChannel = () => {
    setChannels(channels.filter(c => c.id !== currentChannel.id));
    setIsDeleteModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      url: 'https://example.com/channel',
      logoUrl: 'https://example.com/logo.png'
    });
  };

  const openEditModal = (channel) => {
    setCurrentChannel(channel);
    setFormData({
      name: channel.name,
      description: channel.description,
      category: channel.category,
      url: channel.url,
      logoUrl: channel.logoUrl
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (channel) => {
    setCurrentChannel(channel);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Channels Management</h1>
          <p className="text-gray-500">Manage streaming channels</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <span>+</span> Add New Channel
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-700">
              <th className="px-3 py-3">ID</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Description</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">URL</th>
              <th className="px-3 py-3">Logo</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {channels.map((channel) => (
              <tr key={channel.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 text-xs">{channel.id}</td>
                <td className="px-3 py-4 text-xs">{channel.name}</td>
                <td className="px-3 py-4 text-xs truncate max-w-xs">{channel.description}</td>
                <td className="px-3 py-4 text-xs">{channel.category}</td>
                <td className="px-3 py-4 text-xs truncate max-w-xs">{channel.url}</td>
                <td className="px-3 py-4 text-xs truncate max-w-xs">{channel.logoUrl}</td>
                <td className="px-3 py-4 text-xs">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(channel)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => openDeleteModal(channel)}
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

      {/* Add Channel Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Channel"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter channel name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter channel description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Premium, Sports, Documentary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/channel"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input
              type="text"
              value={formData.logoUrl}
              onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/logo.png"
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
            onClick={handleAddChannel}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Create
          </button>
        </div>
      </Modal>

      {/* Edit Channel Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Channel"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input
              type="text"
              value={formData.logoUrl}
              onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            onClick={handleEditChannel}
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
          This action cannot be undone. This will permanently delete the channel.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteChannel}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}