import { Outlet } from 'react-router-dom';
import Navbar from '../ui/Navbar';
import { useEffect, useState } from 'react';
import Login from '../ui/Login';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export default function Main() {
  const [token, setToken] = useState(
    localStorage.getItem('token') ? localStorage.getItem('token') : ''
  );
  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <div className='min-h-screen bg-[#fef7e5]'>
      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <Outlet context={{ token }} />
        </>
      )}
    </div>
  );
}
