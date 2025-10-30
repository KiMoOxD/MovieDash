// Episodes.jsx
import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import Modal from '../components/Modal'; 
import episodesApi from '../api/episodes';
import { useToast } from '../contexts/ToastContext';
export default function Episodes() {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);

  // Form state for Add/Edit (use backend field names)
  const [formData, setFormData] = useState({
    seriesId: '',
    seasonName: 'Season 1',
    title: '',
    description: '',
    episodeURL: 'https://example.com/episode.mp4',
    posterURL: 'https://example.com/poster.jpg'
  });

  const { addToast } = useToast();

  const showApiErrors = (err) => {
    const problems = err?.response?.data;
    if (problems?.errors && typeof problems.errors === 'object') {
      Object.values(problems.errors).forEach((arr) => {
        if (Array.isArray(arr)) arr.forEach((m) => addToast(m, { type: 'error' }));
        else addToast(String(arr), { type: 'error' });
      });
      return;
    }
    const title = problems?.title || err?.message || 'An error occurred';
    addToast(title, { type: 'error' });
  };

  const loadEpisodes = async () => {
    setLoading(true);
    try {
      const res = await episodesApi.getAllEpisodes();
      const data = res.data ?? res;
      const normalized = (Array.isArray(data) ? data : []).map((e) => ({
        ...e,
        episodeId: e.episodeId ?? e.id ?? e.episodeID ?? '',
        seriesId: e.seriesId ?? e.seriesID ?? e.series ?? '',
        seasonName: e.seasonName ?? e.season ?? '',
        episodeURL: e.episodeURL ?? e.url ?? '',
        posterURL: e.posterURL ?? e.posterUrl ?? e.poster ?? ''
      }));
      setEpisodes(normalized);
    } catch (err) {
      console.error('loadEpisodes error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEpisodes();
  }, []);

  // Handlers -> call backend
  const handleAddEpisode = async () => {
    setIsAdding(true);
    try {
      const payload = {
        seriesId: Number(formData.seriesId),
        seasonName: formData.seasonName,
        title: formData.title,
        description: formData.description,
        posterURL: formData.posterURL,
        episodeURL: formData.episodeURL,
      };
      await episodesApi.addEpisode(payload);
      setIsAddModalOpen(false);
      resetForm();
      addToast('Episode created', { type: 'success' });
      await loadEpisodes();
    } catch (err) {
      console.error('addEpisode error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditEpisode = async () => {
    if (!currentEpisode) return;
    setIsUpdating(true);
    try {
      const payload = {
        seriesId: Number(formData.seriesId),
        seasonName: formData.seasonName,
        title: formData.title,
        description: formData.description,
        posterURL: formData.posterURL,
        episodeURL: formData.episodeURL,
      };
  await episodesApi.updateEpisode(currentEpisode.episodeId, payload);
      setIsEditModalOpen(false);
      resetForm();
      addToast('Episode updated', { type: 'success' });
      await loadEpisodes();
    } catch (err) {
      console.error('updateEpisode error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteEpisode = async () => {
    if (!currentEpisode) return;
    setIsDeleting(true);
    try {
  await episodesApi.deleteEpisode(currentEpisode.episodeId);
      setIsDeleteModalOpen(false);
      addToast('Episode deleted', { type: 'success' });
      await loadEpisodes();
    } catch (err) {
      console.error('deleteEpisode error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      seriesId: '',
      seasonName: 'Season 1',
      title: '',
      description: '',
      episodeURL: 'https://example.com/episode.mp4',
      posterURL: 'https://example.com/poster.jpg'
    });
  };

  const openEditModal = (episode) => {
    setCurrentEpisode(episode);
    setFormData({
      seriesId: episode.seriesId.toString(),
      seasonName: episode.seasonName ?? episode.season ?? '',
      title: episode.title,
      description: episode.description,
      episodeURL: episode.episodeURL ?? episode.url ?? '',
      posterURL: episode.posterURL ?? episode.posterUrl ?? episode.poster ?? ''
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (episode) => {
    setCurrentEpisode(episode);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Episodes Management</h1>
          <p className="text-gray-500">Manage series episodes</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <span>+</span> Add New Episode
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-700">
              <th className="px-3 py-3">ID</th>
              <th className="px-3 py-3">Series ID</th>
              <th className="px-3 py-3">Season</th>
              <th className="px-3 py-3">Title</th>
              <th className="px-3 py-3">Description</th>
              <th className="px-3 py-3">URL</th>
              <th className="px-3 py-3">Poster</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center">
                  <svg className="animate-spin h-6 w-6 mx-auto text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <div className="text-sm text-gray-500 mt-2">Loading episodes...</div>
                </td>
              </tr>
            ) : (
              episodes.map((episode) => (
                <tr key={episode.episodeId} className="hover:bg-gray-50">
                  <td className="px-3 py-4 text-xs">{episode.episodeId}</td>
                  <td className="px-3 py-4 text-xs">{episode.seriesId}</td>
                  <td className="px-3 py-4 text-xs">{episode.seasonName}</td>
                  <td className="px-3 py-4 text-xs">{episode.title}</td>
                  <td className="px-3 py-4 text-xs truncate max-w-xs">{episode.description}</td>
                  <td className="px-3 py-4 text-xs truncate max-w-xs">{episode.episodeURL}</td>
                  <td className="px-3 py-4 text-xs truncate max-w-xs">{episode.posterURL}</td>
                  <td className="px-3 py-4 text-xs">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(episode)}
                        className="text-gray-600 hover:text-gray-900"
                        disabled={isAdding || isUpdating || isDeleting}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        onClick={() => openDeleteModal(episode)}
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

      {/* Add Episode Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Episode"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Series ID</label>
              <input
                type="number"
                value={formData.seriesId}
                onChange={(e) => setFormData({...formData, seriesId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Season Name</label>
              <input
                type="text"
                value={formData.seasonName}
                onChange={(e) => setFormData({...formData, seasonName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Season 1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter episode title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter episode description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Episode URL</label>
            <input
              type="text"
              value={formData.episodeURL}
              onChange={(e) => setFormData({...formData, episodeURL: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/episode.mp4"
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
            onClick={handleAddEpisode}
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

      {/* Edit Episode Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Episode"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Series ID</label>
              <input
                type="number"
                value={formData.seriesId}
                onChange={(e) => setFormData({...formData, seriesId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Season Name</label>
              <input
                type="text"
                value={formData.seasonName}
                onChange={(e) => setFormData({...formData, seasonName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Episode URL</label>
            <input
              type="text"
              value={formData.episodeURL}
              onChange={(e) => setFormData({...formData, episodeURL: e.target.value})}
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
            onClick={handleEditEpisode}
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
          This action cannot be undone. This will permanently delete the episode.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteEpisode}
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