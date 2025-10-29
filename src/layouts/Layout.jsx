import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import HeaderBar from '../components/HeaderBar'

export default function Layout() {
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
