import React, { useState, useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

const HeaderBar = () => {
  return (
    <div className="bg-white px-6 py-4 flex items-center justify-end border-b border-gray-200">
      {/* Search Bar */}
      {/* <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-2 w-96">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search movies, series, users..."
          className="bg-transparent outline-none text-gray-800 placeholder-gray-500 flex-1"
        />
      </div> */}

      {/* Right Side: User Profile (no notifications) */}
      <div className="flex items-center space-x-4">
        <UserProfile />
      </div>
    </div>
  );
};

const UserProfile = () => {
  const { user, logout } = useAuth() || {}
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  if (!user) return null

  const name = user?.name || user?.username || 'Admin User'
  const email = user?.email || 'admin@movieapp.com'
  const initials = (name || 'A').split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase()

  const doSignOut = async () => {
    try {
      await logout()
      addToast('Signed out', { type: 'info' })
      navigate('/login', { replace: true })
    } catch (err) {
      addToast('Error signing out', { type: 'error' })
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((s) => !s)} className="flex items-center space-x-3 focus:outline-none">
        <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
          <span className="text-gray-800 font-semibold text-sm">{initials}</span>
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-gray-800 text-sm font-medium">{name}</p>
          <p className="text-gray-500 text-xs">{email}</p>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow z-50">
          <button onClick={doSignOut} className="w-full text-left px-4 py-2 hover:bg-gray-50">Sign out</button>
        </div>
      )}
    </div>
  )
}

export default HeaderBar;