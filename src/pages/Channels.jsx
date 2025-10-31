import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import Modal from '../components/Modal'; 
import channelsApi from '../api/channels';
import { useToast } from '../contexts/ToastContext';

export default function Channels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  // action flags for create / update / delete
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(null);

  // Form state for Add/Edit
  // use backend field names: channelName, description, category, url, logo
  const [formData, setFormData] = useState({
    channelName: '',
    description: '',
    category: '',
    url: 'https://example.com/channel',
    logo: 'https://example.com/logo.png'
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

  // Load channels from API
  const loadChannels = async (config) => {
    setLoading(true);
    try {
      const res = await channelsApi.getAllChannels(config);
      const data = res.data ?? res;
      const normalized = (Array.isArray(data) ? data : []).map((c) => ({
        // normalize possible backend keys to front-end shape
        ...c,
        channelId: c.channelId ?? c.id ?? c._id ?? null,
        channelName: c.channelName ?? c.name ?? '',
        description: c.description ?? '',
        category: c.category ?? '',
        url: c.url ?? c.channelUrl ?? '',
        logo: c.logo ?? c.logoUrl ?? c.logoUrl ?? ''
      }));
      setChannels(normalized);
    } catch (err) {
      console.error('loadChannels error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadChannels({ signal: controller.signal });
    return () => controller.abort();
  }, []);

  // Handlers
  const handleAddChannel = async () => {
    setIsAdding(true);
    try {
      const payload = {
        channelName: formData.channelName,
        description: formData.description,
        category: formData.category,
        url: formData.url,
        logo: formData.logo
      };
      await channelsApi.addChannel(payload);
      setIsAddModalOpen(false);
      resetForm();
      await loadChannels();
    } catch (err) {
      console.error('addChannel error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditChannel = async () => {
    if (!currentChannel) return;
    setIsUpdating(true);
    try {
      const payload = {
        channelName: formData.channelName,
        description: formData.description,
        category: formData.category,
        url: formData.url,
        logo: formData.logo
      };
      await channelsApi.updateChannel(currentChannel.channelId, payload);
      setIsEditModalOpen(false);
      resetForm();
      await loadChannels();
    } catch (err) {
      console.error('updateChannel error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteChannel = async () => {
    if (!currentChannel) return;
    setIsDeleting(true);
    try {
      await channelsApi.deleteChannel(currentChannel.channelId);
      setIsDeleteModalOpen(false);
      await loadChannels();
    } catch (err) {
      console.error('deleteChannel error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      channelName: '',
      description: '',
      category: '',
      url: 'https://example.com/channel',
      logo: 'https://example.com/logo.png'
    });
  };

  const openEditModal = (channel) => {
    setCurrentChannel(channel);
    setFormData({
      channelName: channel.channelName ?? channel.name ?? '',
      description: channel.description ?? '',
      category: channel.category ?? '',
      url: channel.url ?? '',
      logo: channel.logo ?? channel.logoUrl ?? ''
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
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <svg className="animate-spin h-6 w-6 mx-auto text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <div className="text-sm text-gray-500 mt-2">Loading channels...</div>
                </td>
              </tr>
            ) : (
              channels.map((channel) => (
                <tr key={channel.channelId ?? channel.url ?? Math.random()} className="hover:bg-gray-50">
                  <td className="px-3 py-4 text-xs">{channel.channelId ?? '-'}</td>
                  <td className="px-3 py-4 text-xs">{channel.channelName}</td>
                  <td className="px-3 py-4 text-xs truncate max-w-xs">{channel.description}</td>
                  <td className="px-3 py-4 text-xs">{channel.category}</td>
                  <td className="px-3 py-4 text-xs truncate max-w-xs">{channel.url}</td>
                  <td className="px-3 py-4 text-xs truncate max-w-xs">{channel.logo}</td>
                  <td className="px-3 py-4 text-xs">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(channel)}
                        className="text-gray-600 hover:text-gray-900"
                        disabled={isAdding || isUpdating || isDeleting}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        onClick={() => openDeleteModal(channel)}
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
              value={formData.channelName}
              onChange={(e) => setFormData({...formData, channelName: e.target.value})}
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
              value={formData.logo}
              onChange={(e) => setFormData({...formData, logo: e.target.value})}
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
              value={formData.channelName}
              onChange={(e) => setFormData({...formData, channelName: e.target.value})}
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
              value={formData.logo}
              onChange={(e) => setFormData({...formData, logo: e.target.value})}
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
            disabled={isDeleting}
            className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${isDeleting ? 'opacity-60 cursor-not-allowed' : ''}`}
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