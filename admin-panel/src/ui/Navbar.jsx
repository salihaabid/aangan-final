import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { FaList, FaPlusCircle } from 'react-icons/fa';
import { TbChecklist } from 'react-icons/tb';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Navbar({ setToken }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 text-[18px] 
     hover:text-[#2a4125] hover:underline hover:decoration-[#2a4125]
     ${
       isActive
         ? 'text-[#2a4125] underline decoration-[#2a4125]'
         : 'text-[#77846a]'
     }`;

  return (
    <header>
      <div className='navbar xl:px-24 justify-between'>
        {/* Left: Logo */}
        <div className='flex items-center'>
          <img
            src={assets.logo}
            alt='Logo'
            className='h-35 w-auto cursor-pointer'
          />
        </div>

        {/* Center: Nav Items (Desktop) */}
        <div className='hidden md:flex justify-center flex-1'>
          <ul className='menu menu-horizontal gap-6 px-4'>
            <li>
              <NavLink to='/Add' className={navLinkClass}>
                <FaPlusCircle size={20} /> Add Product
              </NavLink>
            </li>
            <li>
              <NavLink to='/' className={navLinkClass}>
                <FaList size={20} /> List Products
              </NavLink>
            </li>

            <li>
              <NavLink to='/Order' className={navLinkClass}>
                <TbChecklist size={22} /> Orders
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right: Logout Button (Desktop) */}
        <div className='hidden md:flex flex-none'>
          <button
            className='flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition cursor-pointer'
            style={{ backgroundColor: '#2a4125' }}
            onClick={() => setToken('')}
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className='md:hidden flex items-center'>
          <button
            onClick={() => setMenuOpen(true)}
            className='text-[#2a4125] focus:outline-none cursor-pointer pr-8'
          >
            <HiMenu size={28} />
          </button>
        </div>
      </div>

      {/* Overlay + Sidebar */}
      {menuOpen && (
        <div className='fixed inset-0 z-50'>
          {/* Transparent Background Overlay */}
          <div
            className='absolute inset-0 bg-opacity-40'
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Sidebar */}
          <div
            className={`absolute top-0 right-0 h-full w-64 bg-[#fef7e5] shadow-lg transform transition-transform duration-300 ${
              menuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Close Button */}
            <div className='flex justify-end p-4'>
              <button onClick={() => setMenuOpen(false)}>
                <HiX size={28} className='text-[#2a4125] cursor-pointer' />
              </button>
            </div>

            {/* Nav Items */}
            <ul className='flex flex-col gap-4 p-4'>
              <li>
                <NavLink
                  to='/Add'
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <FaPlusCircle size={20} /> Add Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/'
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <FaList size={20} /> List Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/Order'
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <TbChecklist size={22} /> Orders
                </NavLink>
              </li>
              <li>
                <button
                  className='flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition cursor-pointer w-full justify-center'
                  style={{ backgroundColor: '#2a4125' }}
                  onClick={() => setToken('')}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
