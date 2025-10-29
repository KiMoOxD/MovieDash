// Episodes.jsx
import React, { useState } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import Modal from '../components/Modal'; 
export default function Episodes() {
  // Mock data - replace with API later
  const [episodes, setEpisodes] = useState([
    {
      id: 1,
      seriesId: 1,
      season: "Season 1",
      title: "Pilot",
      description: "Walter White's life changes when he's diagnosed with cancer.",
      url: "https://example.com/bb-s1e1.mp4",
      posterUrl: "https://example.com/bb-s1e1.jpg"
    },
    {
      id: 2,
      seriesId: 1,
      season: "Season 1",
      title: "Cat's in the Bag...",
      description: "Walt and Jesse face the aftermath of their first cook.",
      url: "https://example.com/bb-s1e2.mp4",
      posterUrl: "https://example.com/bb-s1e2.jpg"
    },
    {
      id: 3,
      seriesId: 2,
      season: "Season 1",
      title: "Winter Is Coming",
      description: "Eddard Stark is torn between his family and an old promise.",
      url: "https://example.com/got-s1e1.mp4",
      posterUrl: "https://example.com/got-s1e1.jpg"
    }
  ]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    seriesId: '',
    season: 'Season 1',
    title: '',
    description: '',
    url: 'https://example.com/episode.mp4',
    posterUrl: 'https://example.com/poster.jpg'
  });

  // Handlers
  const handleAddEpisode = () => {
    const newEpisode = {
      id: episodes.length + 1,
      ...formData,
      seriesId: parseInt(formData.seriesId) // Ensure it's a number
    };
    setEpisodes([...episodes, newEpisode]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditEpisode = () => {
    setEpisodes(episodes.map(e => e.id === currentEpisode.id ? { ...e, ...formData, seriesId: parseInt(formData.seriesId) } : e));
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteEpisode = () => {
    setEpisodes(episodes.filter(e => e.id !== currentEpisode.id));
    setIsDeleteModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      seriesId: '',
      season: 'Season 1',
      title: '',
      description: '',
      url: 'https://example.com/episode.mp4',
      posterUrl: 'https://example.com/poster.jpg'
    });
  };

  const openEditModal = (episode) => {
    setCurrentEpisode(episode);
    setFormData({
      seriesId: episode.seriesId.toString(),
      season: episode.season,
      title: episode.title,
      description: episode.description,
      url: episode.url,
      posterUrl: episode.posterUrl
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
            {episodes.map((episode) => (
              <tr key={episode.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 text-xs">{episode.id}</td>
                <td className="px-3 py-4 text-xs">{episode.seriesId}</td>
                <td className="px-3 py-4 text-xs">{episode.season}</td>
                <td className="px-3 py-4 text-xs">{episode.title}</td>
                <td className="px-3 py-4 text-xs truncate max-w-xs">{episode.description}</td>
                <td className="px-3 py-4 text-xs truncate max-w-xs">{episode.url}</td>
                <td className="px-3 py-4 text-xs truncate max-w-xs">{episode.posterUrl}</td>
                <td className="px-3 py-4 text-xs">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(episode)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => openDeleteModal(episode)}
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
                value={formData.season}
                onChange={(e) => setFormData({...formData, season: e.target.value})}
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
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/episode.mp4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL</label>
            <input
              type="text"
              value={formData.posterUrl}
              onChange={(e) => setFormData({...formData, posterUrl: e.target.value})}
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
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Create
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
                value={formData.season}
                onChange={(e) => setFormData({...formData, season: e.target.value})}
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
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL</label>
            <input
              type="text"
              value={formData.posterUrl}
              onChange={(e) => setFormData({...formData, posterUrl: e.target.value})}
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
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}