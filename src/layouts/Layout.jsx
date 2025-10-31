import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import HeaderBar from '../components/HeaderBar'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user } = useAuth() || {}

  if (!user) {
    // redirect unauthenticated users to login
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1">
        <HeaderBar />
        <Outlet />
      </main>
    </div>
  )
}
