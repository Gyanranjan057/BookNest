import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from  "../../assets/logo/logo.png"
import {
  FaTachometerAlt,
  FaBook,
  FaList,
  FaShoppingCart,
  FaUsers,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa"
import assets from '../../assets/assets'

const Sidebar = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }
  const menu = [
    { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
    { name: "Books", path: "/admin/books", icon: <FaBook /> },
    { name: "Categories", path: "/admin/categories", icon: <FaList /> },
    { name: "Orders", path: "/admin/orders", icon: <FaShoppingCart /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
  ]
  return (
    <div className={`h-screen ${open ? "w-64" : "w-20"} bg-gray-900 text-gray-300 p-5 pt-8 duration-300 relative flex flex-col justify-between`}>
      <FaBars className='absolute top-4 right-8 text-gray-400 cursor-pointer hover:text-white'
        onClick={() => setOpen(!open)}
      />
      <div>
        {/* LOGO */}
        <div className='flex items-center justify-center'>
          <img src={logo} alt="logo" className="mt-3 h-10 w-10 top object-cover rounded-full" />
        </div>
        <h1 className='text-2xl text-center font-bold mb-4 text-white tracking-wide mt-2'>
          {open ? "Admin Panel" : ""}
        </h1>
        {/* Menu */}
        <ul className='space-y-3'>
          {menu.map((item, index) => (
            <NavLink to={item.path} key={index} end
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 group ${isActive
                  ? "bg-green-800 text-white shadow-md"
                  : "hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>

              {open && <span className="whitespace-nowrap">{item.name}</span>}
            </NavLink>
          ))}
        </ul>
      </div>
      {/* Logout */}
      <div>
        <button onClick={handleLogout}
          className='flex items-center gap-4 w-full p-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition '>
          <FaSignOutAlt />
          {open && <span>Logout</span>}

        </button>
      </div>
    </div>
  )
}

export default Sidebar