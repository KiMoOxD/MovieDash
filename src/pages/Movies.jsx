// Movies.jsx
import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import Modal from '../components/Modal';
import moviesApi from '../api/movies';
import { useToast } from '../contexts/ToastContext';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  // action flags for create / update / delete
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  
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
    posterURL: 'https://example.com/poster.jpg',
    movieURL: 'https://example.com/movie.mp4'
  });

  // Helpers
  const loadMovies = async () => {
    setLoading(true);
    try {
      const res = await moviesApi.getAllMovies();
      // Normalize backend keys to the front-end shape we use in the UI.
      const data = res.data ?? res;
      const normalized = (Array.isArray(data) ? data : []).map((m) => ({
        // backend returns movieId, title, description, type, releaseYear, posterURL, movieURL
        ...m,
        posterURL: m.posterURL ?? m.posterUrl ?? m.poster ?? '',
        movieURL: m.movieURL ?? m.movieUrl ?? m.movie ?? '',
      }));
      setMovies(normalized);
    } catch (err) {
      console.error('loadMovies error', err.response ?? err);
      showApiErrors(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

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

  // Handlers -> call backend
  const handleAddMovie = async () => {
    setIsAdding(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        releaseYear: Number(formData.releaseYear),
        posterURL: formData.posterURL,
        movieURL: formData.movieURL,
      };
      await moviesApi.addMovie(payload);
      setIsAddModalOpen(false);
      resetForm();
      await loadMovies();
    } catch (err) {
        console.error('addMovie error', err.response ?? err);
        showApiErrors(err);
    }
    finally {
      setIsAdding(false);
    }
  };

  const handleEditMovie = async () => {
    if (!currentMovie) return;
    setIsUpdating(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        releaseYear: Number(formData.releaseYear),
        posterURL: formData.posterURL,
        movieURL: formData.movieURL,
      };
      await moviesApi.updateMovie(currentMovie.movieId, payload);
      setIsEditModalOpen(false);
      resetForm();
      await loadMovies();
    } catch (err) {
      console.error('updateMovie error', err.response ?? err);
      showApiErrors(err);
    }
    finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteMovie = async () => {
    if (!currentMovie) return;
    setIsDeleting(true);
    try {
      await moviesApi.deleteMovie(currentMovie.movieId);
      setIsDeleteModalOpen(false);
      await loadMovies();
    } catch (err) {
      console.error('deleteMovie error', err.response ?? err);
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
      releaseYear: '2025',
      posterURL: 'https://example.com/poster.jpg',
      movieURL: 'https://example.com/movie.mp4'
    });
  };

  const openEditModal = (movie) => {
    setCurrentMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      type: movie.type,
      releaseYear: movie.releaseYear,
      posterURL: movie.posterURL ?? movie.posterUrl ?? movie.poster ?? '',
      movieURL: movie.movieURL ?? movie.movieUrl ?? movie.movie ?? ''
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
            {loading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center">
                  <svg className="animate-spin h-6 w-6 mx-auto text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <div className="text-sm text-gray-500 mt-2">Loading movies...</div>
                </td>
              </tr>
            ) : (
              movies.map((movie) => (
                <tr key={movie.movieId} className="hover:bg-gray-50">
                  <td className="px-3 py-4 text-xs">{movie.movieId}</td>
                  <td className="px-3 py-4 text-xs">{movie.title}</td>
                  <td className="px-3 py-4 text-xs truncate max-w-xs">{movie.description}</td>
                  <td className="px-3 py-4 text-xs">{movie.type}</td>
                  <td className="px-3 py-4 text-xs">{movie.releaseYear}</td>
                  <td className="px-3 py-4 text-xs truncate max-w-xs">{movie.posterURL}</td>
                  <td className="px-3 py-4 text-xs truncate max-w-xs">{movie.movieURL}</td>
                  <td className="px-3 py-4 text-xs">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(movie)}
                        className="text-gray-600 hover:text-gray-900"
                        disabled={isAdding || isUpdating || isDeleting}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        onClick={() => openDeleteModal(movie)}
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
              value={formData.posterURL}
              onChange={(e) => setFormData({...formData, posterURL: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/poster.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Movie URL</label>
            <input
              type="text"
              value={formData.movieURL}
              onChange={(e) => setFormData({...formData, movieURL: e.target.value})}
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
              value={formData.posterURL}
              onChange={(e) => setFormData({...formData, posterURL: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Movie URL</label>
            <input
              type="text"
              value={formData.movieURL}
              onChange={(e) => setFormData({...formData, movieURL: e.target.value})}
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