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

export default function Sidebar() {
  return (
    <aside className="text-black  w-[270px] border border-r-gray-200 border-t-0 min-h-screen flex flex-col items-center gap-4">
      <div className="flex justify-center items-center w-full  py-4.5 border-b border-gray-200">
        <div className="bg-gray-900 p-2 rounded-md mr-3">
          <FaFilm className="text-white h-5 w-5" />
        </div>
        <span className="text-gray-800 font-medium">Admin Dashboard</span>
      </div>
      <nav className="w-full p-4">
        <NavItem path={''} icon={<LuLayoutDashboard className="mr-3 text-lg " />} label={'Dashboard'} />
        <NavItem path={'movies'} icon={<TbMovie className="mr-3 text-lg" />} label={'Movies'} />
        <NavItem path={'series'} icon={<FiTv className="mr-3 text-lg" />} label={'Series'} />
        <NavItem path={'episodes'} icon={<LuMonitorPlay className="mr-3 text-lg" />} label={'Episodes'} />
        <NavItem path={'channels'} icon={<HiMiniSignal className="mr-3 text-lg" />} label={'Channels'} />
        <NavItem path={'users'} icon={<LuUsers className="mr-3 text-lg" />} label={'Users'} />
        <NavItem path={'subscriptions'} icon={<LuCreditCard className="mr-3 text-lg" />} label={'Subscriptions'} />
        <NavItem path={'user-subscriptions'} icon={<RiUserSettingsLine className="mr-3 text-lg" />} label={'User Subscriptions'} />
        <NavItem path={'settings'} icon={<LuSettings className="mr-3 text-lg" />} label={'Settings'} />
      </nav>
    </aside>
  );
}