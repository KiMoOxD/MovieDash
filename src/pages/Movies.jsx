// Movies.jsx
import React, { useState } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import Modal from '../components/Modal';

export default function Movies() {
  // Mock data - replace with API later
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "The Dark Knight",
      description: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.",
      type: "Action",
      releaseYear: "2008",
      posterUrl: "https://example.com/dark-knight.jpg",
      movieUrl: "https://example.com/dark-knight.mp4"
    },
    {
      id: 2,
      title: "Inception",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
      type: "Sci-Fi",
      releaseYear: "2010",
      posterUrl: "https://example.com/inception.jpg",
      movieUrl: "https://example.com/inception.mp4"
    },
    {
      id: 3,
      title: "The Godfather",
      description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      type: "Crime",
      releaseYear: "1972",
      posterUrl: "https://example.com/godfather.jpg",
      movieUrl: "https://example.com/godfather.mp4"
    }
  ]);

  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    releaseYear: '2025',
    posterUrl: 'https://example.com/poster.jpg',
    movieUrl: 'https://example.com/movie.mp4'
  });

  // Handlers
  const handleAddMovie = () => {
    const newMovie = {
      id: movies.length + 1,
      ...formData
    };
    setMovies([...movies, newMovie]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditMovie = () => {
    setMovies(movies.map(m => m.id === currentMovie.id ? { ...m, ...formData } : m));
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteMovie = () => {
    setMovies(movies.filter(m => m.id !== currentMovie.id));
    setIsDeleteModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      releaseYear: '2025',
      posterUrl: 'https://example.com/poster.jpg',
      movieUrl: 'https://example.com/movie.mp4'
    });
  };

  const openEditModal = (movie) => {
    setCurrentMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      type: movie.type,
      releaseYear: movie.releaseYear,
      posterUrl: movie.posterUrl,
      movieUrl: movie.movieUrl
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (movie) => {
    setCurrentMovie(movie);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Movies Management</h1>
          <p className="text-gray-500">Manage your movie library</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-800"
        >
          <span>+</span> Add New Movie
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
              <th className="px-3 py-3">Release Year</th>
              <th className="px-3 py-3">Poster</th>
              <th className="px-3 py-3">Movie URL</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {movies.map((movie) => (
              <tr key={movie.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 text-xs">{movie.id}</td>
                <td className="px-3 py-4 text-xs">{movie.title}</td>
                <td className="px-3 py-4 text-xs truncate max-w-xs">{movie.description}</td>
                <td className="px-3 py-4 text-xs">{movie.type}</td>
                <td className="px-3 py-4 text-xs">{movie.releaseYear}</td>
                <td className="px-3 py-4 text-xs truncate max-w-xs">{movie.posterUrl}</td>
                <td className="px-3 py-4 text-xs truncate max-w-xs">{movie.movieUrl}</td>
                <td className="px-3 py-4 text-xs">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(movie)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => openDeleteModal(movie)}
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

      {/* Add Movie Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Movie"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter movie title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter movie description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Action, Drama, Sci-Fi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Release Year</label>
              <input
                type="text"
                value={formData.releaseYear}
                onChange={(e) => setFormData({...formData, releaseYear: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2025"
              />
            </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Movie URL</label>
            <input
              type="text"
              value={formData.movieUrl}
              onChange={(e) => setFormData({...formData, movieUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/movie.mp4"
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
            onClick={handleAddMovie}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Create
          </button>
        </div>
      </Modal>

      {/* Edit Movie Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Movie"
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
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Release Year</label>
              <input
                type="text"
                value={formData.releaseYear}
                onChange={(e) => setFormData({...formData, releaseYear: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Movie URL</label>
            <input
              type="text"
              value={formData.movieUrl}
              onChange={(e) => setFormData({...formData, movieUrl: e.target.value})}
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
            onClick={handleEditMovie}
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
          This action cannot be undone. This will permanently delete the movie.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteMovie}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}