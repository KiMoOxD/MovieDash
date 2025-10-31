// NavItem.jsx
import { NavLink } from 'react-router-dom';

export default function NavItem({ path, icon, label }) {
  return (
    <NavLink
      to={`/${path}`}
      className={({ isActive }) =>
        isActive
          ? "flex justify-center sm:justify-start items-center px-2 sm:px-5 py-3 bg-gray-900 text-white rounded-md text-md"
          : "flex justify-center sm:justify-start items-center px-2 sm:px-5 py-3 hover:bg-gray-100 rounded-md text-md"
      }
    >
      {icon}
      <span className='hidden sm:block'>{label}</span>
    </NavLink>
  );
}