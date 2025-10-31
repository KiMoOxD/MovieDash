import React, { useState, useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import usersApi from '../api/users'
import settingsApi from '../api/settings'
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
  const [freshUser, setFreshUser] = useState(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  useEffect(() => {
    if (!user) return
    const ac = new AbortController()
    let mounted = true
    // try several ways to get a user id: auth user object, decoded token from localStorage,
    // or an accessToken returned in the auth response.
    const idFromAuthObj = user?.id ?? user?.userId ?? null
    const idFromTokenStore = settingsApi.getUserIdFromToken()
    const decodeJwt = (token) => {
      try {
        if (!token) return null
        const parts = token.split('.')
        if (parts.length < 2) return null
        const base64Url = parts[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
        const json = decodeURIComponent(
          atob(padded)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
        const payload = JSON.parse(json)
        return payload.userId ?? payload.user_id ?? payload.sub ?? payload.id ?? payload.nameid ?? null
      } catch (e) {
        return null
      }
    }

    const idFromAccessToken = decodeJwt(user?.accessToken || user?.token || null)
    const id = idFromAuthObj ?? idFromTokenStore ?? idFromAccessToken
    if (!id) return
    usersApi.getUserById(id, { signal: ac.signal })
      .then((res) => {
        // console.log(res)
        if (!mounted) return
        const data = res?.data ?? res
        const u = data?.email ?? data?.user ?? data
        setFreshUser(u)
      })
      .catch((err) => {
        // ignore cancel
        if (err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError') return
        // otherwise ignore silently
      })

    return () => {
      mounted = false
      ac.abort()
    }
  }, [user])

  if (!user) return null

  const name = freshUser?.name || freshUser?.username || user?.name || user?.username || 'Admin User'
  const email = freshUser?.email || user?.email || 'admin@movieapp.com'
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