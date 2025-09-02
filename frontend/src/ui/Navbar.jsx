import { useContext, useState } from 'react';
import { LuSearch, LuUser, LuShoppingBag, LuMenu, LuX } from 'react-icons/lu';
import { Link, NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { setShowSearch, getCartCount, token, setToken, setCartItems } =
    useContext(ShopContext);

  const navLinkClass = ({ isActive }) =>
    `!text-[20px] !bg-transparent focus:!bg-transparent active:outline-none 
     hover:text-[#2a4125] hover:underline hover:decoration-[#2a4125]
     ${
       isActive
         ? 'text-[#2a4125] underline decoration-[#2a4125]'
         : 'text-[#77846a]'
     }`;

  const handleClick = () => setOpenSubmenu(false);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setToken('');
    setCartItems({});
  };

  return (
    <header>
      <div className='navbar xl:px-24'>
        {/* Left - Logo + Mobile Menu */}
        <div className='navbar-start flex items-center gap-4'>
          {/* Mobile Hamburger */}
          <button
            className='lg:hidden text-[#2a4125] cursor-pointer'
            onClick={() => setOpenSidebar(true)}
          >
            <LuMenu size={30} />
          </button>

          {/* Logo */}
          <NavLink
            to='/'
            className='flex justify-center items-center w-full lg:w-auto'
          >
            <img
              src={assets.logo}
              alt='Logo'
              className='h-35 w-auto mx-auto cursor-pointer'
            />
          </NavLink>
        </div>

        {/* Center - Desktop Menu */}
        <div className='navbar-center hidden lg:flex'>
          <ul className='menu menu-horizontal px-4'>
            <li>
              <NavLink to='/' className={navLinkClass}>
                Home
              </NavLink>
            </li>
            <li>
              <details open={openSubmenu}>
                <summary
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenSubmenu(!openSubmenu);
                  }}
                  className={navLinkClass({ isActive: false })}
                >
                  Products
                </summary>
                <ul
                  className='p-2 pr-[25px] bg-[#fef7e5] rounded-[15px] shadow-md'
                  style={{
                    borderTop: '2px solid #2a4125',
                    borderLeft: '2px solid #2a4125',
                    borderRight: '2px solid #2a4125',
                    borderBottom: '4px solid #2a4125',
                    padding: '10px 80px 0px 10px',
                  }}
                >
                  <li>
                    <NavLink
                      to='/Collection'
                      onClick={() => handleClick('Shop All')}
                      className={navLinkClass('Shop All')}
                    >
                      Shop All
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to='Cheddar'
                      onClick={() => handleClick('Cheddar')}
                      className={navLinkClass('Cheddar')}
                    >
                      Cheddar
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to='/Mozzarella'
                      onClick={() => handleClick('Mozzarella')}
                      className={navLinkClass('Mozzarella')}
                    >
                      Mozzarella
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to='/Shredded'
                      onClick={() => handleClick('Shredded')}
                      className={navLinkClass('Shredded')}
                    >
                      Shredded
                    </NavLink>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <NavLink to='/Deals' className={navLinkClass}>
                Deals
              </NavLink>
            </li>
            <li>
              <NavLink to='/Business' className={navLinkClass}>
                Business Customers
              </NavLink>
            </li>
            <li>
              <NavLink to='/Contact' className={navLinkClass}>
                Contact Us
              </NavLink>
            </li>
            <li>
              <NavLink to='/About' className={navLinkClass}>
                About Us
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right - Icons */}
        <div className='navbar-end'>
          <div className='flex gap-6 p-4'>
            <LuSearch
              size={29}
              strokeWidth={1.5}
              className='text-[#2a4125] transition-transform duration-200 hover:scale-110 cursor-pointer'
              onClick={() => setShowSearch(true)}
            />
            <div className='relative group'>
              <LuUser
                size={29}
                strokeWidth={1.5}
                className='text-[#2a4125] transition-transform duration-200 hover:scale-110 cursor-pointer'
              />

              {/* Dropdown Menu */}
              <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                <div
                  className='flex flex-col gap-2 w-36 py-3 px-5 text-gray-500 rounded shadow-md bg-[#fef7e5]'
                  style={{
                    borderTop: '2px solid #2a4125',
                    borderLeft: '2px solid #2a4125',
                    borderRight: '2px solid #2a4125',
                    borderBottom: '4px solid #2a4125',
                  }}
                >
                  {!token ? (
                    <Link to='/login'>
                      <p className='cursor-pointer hover:text-black'>Login</p>
                    </Link>
                  ) : (
                    <>
                      <Link to='/orders'>
                        <p className='cursor-pointer hover:text-black'>
                          Orders
                        </p>
                      </Link>
                      <p
                        className='cursor-pointer hover:text-black'
                        onClick={logout}
                      >
                        Logout
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Cart Icon with Badge */}
            <Link to='/cart' className='relative'>
              <LuShoppingBag
                size={29}
                strokeWidth={1.5}
                className='text-[#2a4125] transition-transform duration-200 hover:scale-110 cursor-pointer'
              />
              <p className='absolute right-[-5px] bottom-[-5px] w-4 h-4 flex items-center justify-center text-xs bg-[#2a4125] text-white rounded-full'>
                {getCartCount()}
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar for Mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#fef7e5] shadow-lg z-50 transform transition-transform duration-300 ${
          openSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          borderRight: '4px solid #2a4125',
        }}
      >
        {/* Close Button */}
        <div className='flex justify-between items-center p-4 border-b border-[#2a4125]'>
          <img src={assets.logo} alt='Logo' className='h-10' />
          <button
            className='text-[#2a4125]'
            onClick={() => setOpenSidebar(false)}
          >
            <LuX size={28} />
          </button>
        </div>

        {/* Sidebar Links */}
        <ul className='flex flex-col p-4 gap-4'>
          <NavLink
            to='/'
            className={navLinkClass}
            onClick={() => setOpenSidebar(false)}
          >
            Home
          </NavLink>
          <NavLink
            to='/Collection'
            className={navLinkClass}
            onClick={() => setOpenSidebar(false)}
          >
            Shop All
          </NavLink>
          <NavLink
            to='/Cheddar'
            className={navLinkClass}
            onClick={() => setOpenSidebar(false)}
          >
            Cheddar
          </NavLink>
          <NavLink
            to='/Mozzarella'
            className={navLinkClass}
            onClick={() => setOpenSidebar(false)}
          >
            Mozzarella
          </NavLink>
          <NavLink
            to='/Shredded'
            className={navLinkClass}
            onClick={() => setOpenSidebar(false)}
          >
            Shredded
          </NavLink>
          <NavLink
            to='/Deals'
            className={navLinkClass}
            onClick={() => setOpenSidebar(false)}
          >
            Deals
          </NavLink>
          <NavLink
            to='/Business'
            className={navLinkClass}
            onClick={() => setOpenSidebar(false)}
          >
            Business Customers
          </NavLink>
          <NavLink
            to='/Contact'
            className={navLinkClass}
            onClick={() => setOpenSidebar(false)}
          >
            Contact Us
          </NavLink>
          <NavLink
            to='/About'
            className={navLinkClass}
            onClick={() => setOpenSidebar(false)}
          >
            About Us
          </NavLink>
        </ul>
      </div>
    </header>
  );
}
