///////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../layout/Main';
import { toast } from 'react-toastify';

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/user/admin`, {
        email,
        password,
      });
      if (response.data.success && response.data.token) {
        setToken(response.data.token); // store actual token, not true
        console.log(response.data.token);
        toast.success('Login successful!');
      } else {
        toast.error(response.data.message || 'Invalid credentials');
      }

      // Reset input fields
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-[#fef7e5]'>
      <div className='w-96  border border-[#77846a]/20 shadow-lg rounded-2xl p-8'>
        {/* Heading */}
        <h2 className='text-2xl font-bold text-center mb-6 text-[#2a4125]'>
          Admin Panel
        </h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='email'
            placeholder='Email'
            className='border rounded-lg px-4 py-2 my-1 focus:outline-none focus:ring-0 focus:ring-[#2a4125]'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type='password'
            placeholder='Password'
            className='border rounded-lg px-4 py-2 focus:outline-none focus:ring-0 focus:ring-[#2a4125] my-1'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type='submit'
            className='bg-[#2a4125] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
