import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import Modal from '../components/Modal'; 
import seriesApi from '../api/series';
import { useToast } from '../contexts/ToastContext';

export default function Series() {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSeries, setCurrentSeries] = useState(null);

  // Form state for Add/Edit (use backend keys)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    url: 'https://example.com/series',
    posterURL: 'https://example.com/poster.jpg'
  });

  const { addToast } = useToast();

  const showApiErrors = (err) => {
    if (err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError' || /cancel/i.test(err?.message || '')) {
      return;
    }
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

  const loadSeries = async (config) => {
    setLoading(true);
    try {
      const res = await seriesApi.getAllSeries(config);
      const data = res.data ?? res;
      const normalized = (Array.isArray(data) ? data : []).map((s) => ({
        ...s,
        seriesId: s.seriesId ?? s.id ?? s.seriesID ?? '',
        posterURL: s.posterURL ?? s.posterUrl ?? s.poster ?? ''
      }));
      setSeriesList(normalized);
    } catch (err) {
      console.error('loadSeries error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadSeries({ signal: controller.signal });
    return () => controller.abort();
  }, []);

  // Handlers -> call backend
  const handleAddSeries = async () => {
    setIsAdding(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        url: formData.url,
        posterURL: formData.posterURL,
      };
      await seriesApi.addSeries(payload);
      setIsAddModalOpen(false);
      resetForm();
      addToast('Series created', { type: 'success' });
      await loadSeries();
    } catch (err) {
      console.error('addSeries error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditSeries = async () => {
    if (!currentSeries) return;
    setIsUpdating(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        url: formData.url,
        posterURL: formData.posterURL,
      };
  await seriesApi.updateSeries(currentSeries.seriesId, payload);
      setIsEditModalOpen(false);
      resetForm();
      addToast('Series updated', { type: 'success' });
      await loadSeries();
    } catch (err) {
      console.error('updateSeries error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSeries = async () => {
    if (!currentSeries) return;
    setIsDeleting(true);
    try {
  await seriesApi.deleteSeries(currentSeries.seriesId);
      setIsDeleteModalOpen(false);
      addToast('Series deleted', { type: 'success' });
      await loadSeries();
    } catch (err) {
      console.error('deleteSeries error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      url: 'https://example.com/series',
      posterURL: 'https://example.com/poster.jpg'
    });
  };

  const openEditModal = (seriesItem) => {
    setCurrentSeries(seriesItem);
    setFormData({
      title: seriesItem.title,
      description: seriesItem.description,
      type: seriesItem.type,
      url: seriesItem.url,
      posterURL: seriesItem.posterURL ?? seriesItem.posterUrl ?? seriesItem.poster ?? ''
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (seriesItem) => {
    setCurrentSeries(seriesItem);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Series Management</h1>
          <p className="text-gray-500">Manage your series library</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <span>+</span> Add New Series
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-700">
              <th className="px-3 py-3">ID</th>
              <th className="px-3 py-3">Title</th>
              <th className="px-3 py-3">Description</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">URL</th>
              <th className="px-3 py-3">Poster</th>
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
                  <div className="text-sm text-gray-500 mt-2">Loading series...</div>
                </td>
              </tr>
            ) : (
              seriesList.map((seriesItem) => (
                <tr key={seriesItem.seriesId} className="hover:bg-gray-50">
                  <td className="px-3 py-4 text-xs">{seriesItem.seriesId}</td>
                  <td className="px-3 py-4 text-xs">{seriesItem.title}</td>
                  <td className="px-3 py-4 text-xs truncate max-w-xs">{seriesItem.description}</td>
                  <td className="px-3 py-4 text-xs">{seriesItem.type}</td>
                  <td className="px-3 py-4 text-xs truncate max-w-xs">{seriesItem.url}</td>
                  <td className="px-3 py-4 text-xs truncate max-w-xs">{seriesItem.posterURL}</td>
                  <td className="px-3 py-4 text-xs">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(seriesItem)}
                        className="text-gray-600 hover:text-gray-900"
                        disabled={isAdding || isUpdating || isDeleting}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        onClick={() => openDeleteModal(seriesItem)}
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

      {/* Add Series Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Series"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter series title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter series description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Drama, Comedy, Fantasy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/series"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL</label>
            <input
              type="text"
              value={formData.posterURL}
              onChange={(e) => setFormData({...formData, posterURL: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/poster.jpg"
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
            onClick={handleAddSeries}
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

      {/* Edit Series Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Series"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL</label>
            <input
              type="text"
              value={formData.posterURL}
              onChange={(e) => setFormData({...formData, posterURL: e.target.value})}
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
            onClick={handleEditSeries}
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
          This action cannot be undone. This will permanently delete the series.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteSeries}
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