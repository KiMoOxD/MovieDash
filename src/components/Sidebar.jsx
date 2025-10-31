import { FaFilm } from 'react-icons/fa';
import { LuLayoutDashboard } from "react-icons/lu";
import { TbMovie } from "react-icons/tb";
import { FiTv } from "react-icons/fi";
import { LuMonitorPlay } from "react-icons/lu";
import { HiMiniSignal } from "react-icons/hi2";
import { LuCreditCard } from "react-icons/lu";
import { RiUserSettingsLine } from "react-icons/ri";
import { LuSettings } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";






import NavItem from './NavItem';
import React, { useEffect, useState } from 'react'
import settingsApi from '../api/settings'

export default function Sidebar() {
  const [appName, setAppName] = useState('Admin Dashboard')

  useEffect(() => {
    const ac = new AbortController()
    let mounted = true
    settingsApi
      .getSettingData({ signal: ac.signal })
      .then((res) => {
        if (!mounted) return
        const data = res?.data ?? res
        if (data?.appName) setAppName(data.appName)
      })
      .catch(() => {
        // silent fallback to default name
      })
    return () => {
      mounted = false
      ac.abort()
    }
  }, [])

  return (
    <aside className="text-black sm:w-[270px] border border-r-gray-200 border-t-0 min-h-screen flex flex-col items-center gap-4">
      <div className="flex justify-center items-center w-full  py-4.5 border-b border-gray-200">
        <div className="bg-gray-900 p-2 rounded-md mr-3">
          <FaFilm className="text-white h-5 w-5" />
        </div>
        <span className="text-gray-800 font-medium hidden sm:block">{appName}</span>
      </div>
      <nav className="w-full p-4">
        <NavItem path={''} icon={<LuLayoutDashboard className="sm:mr-3 text-lg" />} label={'Dashboard'} />
        <NavItem path={'movies'} icon={<TbMovie className="sm:mr-3 text-lg" />} label={'Movies'} />
        <NavItem path={'series'} icon={<FiTv className="sm:mr-3 text-lg" />} label={'Series'} />
        <NavItem path={'episodes'} icon={<LuMonitorPlay className="sm:mr-3 text-lg" />} label={'Episodes'} />
        <NavItem path={'channels'} icon={<HiMiniSignal className="sm:mr-3 text-lg" />} label={'Channels'} />
        <NavItem path={'users'} icon={<LuUsers className="sm:mr-3 text-lg" />} label={'Users'} />
        <NavItem path={'subscriptions'} icon={<LuCreditCard className="sm:mr-3 text-lg" />} label={'Subscriptions'} />
        <NavItem path={'user-subscriptions'} icon={<RiUserSettingsLine className="sm:mr-3 text-lg" />} label={'User Subscriptions'} />
        <NavItem path={'settings'} icon={<LuSettings className="sm:mr-3 text-lg" />} label={'Settings'} />
      </nav>
    </aside>
  )
}