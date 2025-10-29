import React, { useState } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import Modal from '../components/Modal'; 

export default function Series() {
  // Mock data - replace with API later
  const [seriesList, setSeriesList] = useState([
    {
      id: 1,
      title: "Breaking Bad",
      description: "A high school chemistry teacher turned methamphetamine manufacturer.",
      type: "Crime",
      url: "https://example.com/breaking-bad",
      posterUrl: "https://example.com/breaking-bad.jpg"
    },
    {
      id: 2,
      title: "Game of Thrones",
      description: "Nine noble families fight for control over the lands of Westeros.",
      type: "Fantasy",
      url: "https://example.com/got",
      posterUrl: "https://example.com/got.jpg"
    },
    {
      id: 3,
      title: "Stranger Things",
      description: "When a young boy disappears, his mother and friends are drawn into a mystery involving secret government experiments.",
      type: "Sci-Fi",
      url: "https://example.com/stranger-things",
      posterUrl: "https://example.com/stranger-things.jpg"
    }
  ]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSeries, setCurrentSeries] = useState(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    url: 'https://example.com/series',
    posterUrl: 'https://example.com/poster.jpg'
  });

  // Handlers
  const handleAddSeries = () => {
    const newSeries = {
      id: seriesList.length + 1,
      ...formData
    };
    setSeriesList([...seriesList, newSeries]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditSeries = () => {
    setSeriesList(seriesList.map(s => s.id === currentSeries.id ? { ...s, ...formData } : s));
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteSeries = () => {
    setSeriesList(seriesList.filter(s => s.id !== currentSeries.id));
    setIsDeleteModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      url: 'https://example.com/series',
      posterUrl: 'https://example.com/poster.jpg'
    });
  };

  const openEditModal = (seriesItem) => {
    setCurrentSeries(seriesItem);
    setFormData({
      title: seriesItem.title,
      description: seriesItem.description,
      type: seriesItem.type,
      url: seriesItem.url,
      posterUrl: seriesItem.posterUrl
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
            {seriesList.map((seriesItem) => (
              <tr key={seriesItem.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 text-xs">{seriesItem.id}</td>
                <td className="px-3 py-4 text-xs">{seriesItem.title}</td>
                <td className="px-3 py-4 text-xs truncate max-w-xs">{seriesItem.description}</td>
                <td className="px-3 py-4 text-xs">{seriesItem.type}</td>
                <td className="px-3 py-4 text-xs truncate max-w-xs">{seriesItem.url}</td>
                <td className="px-3 py-4 text-xs truncate max-w-xs">{seriesItem.posterUrl}</td>
                <td className="px-3 py-4 text-xs">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(seriesItem)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => openDeleteModal(seriesItem)}
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
            onClick={handleAddSeries}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Create
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
            onClick={handleEditSeries}
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
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}