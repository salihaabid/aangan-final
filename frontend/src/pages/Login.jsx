import { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function AuthForm() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // true = login, false = signup
  const { token, setToken, backendUrl, getUserCart } = useContext(ShopContext);

  // 🔹 State variables for inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toggleForm = () => {
    setIsLogin((prev) => !prev);

    // Clear fields when switching between login/signup
    setName('');
    setEmail('');
    setPassword('');
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (isLogin) {
  //       const response = await axios.post(backendUrl + '/api/user/login', {
  //         email,
  //         password,
  //       });

  //       if (response.data.success) {
  //         setToken(response.data.token);
  //         localStorage.setItem('token', response.data.token);
  //         toast.success('Logged in successfully!');
  //       } else {
  //         toast.error(response.data.message);
  //       }
  //     } else {
  //       const response = await axios.post(backendUrl + '/api/user/register', {
  //         name,
  //         email,
  //         password,
  //       });

  //       if (response.data.success) {
  //         setToken(response.data.token);
  //         localStorage.setItem('token', response.data.token);
  //         toast.success('Signed up successfully!');
  //       } else {
  //         toast.error(response.data.message);
  //       }
  //     }

  //     setName('');
  //     setEmail('');
  //     setPassword('');
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || error.message);
  //     console.error(error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await axios.post(backendUrl + '/api/user/login', {
          email,
          password,
        });

        if (response.data.success) {
          const newToken = response.data.token;

          setToken(newToken);
          localStorage.setItem('token', newToken);

          // 👇 instantly load cart for logged-in user
          getUserCart(newToken);

          toast.success('Logged in successfully!');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/register', {
          name,
          email,
          password,
        });

        if (response.data.success) {
          const newToken = response.data.token;

          setToken(newToken);
          localStorage.setItem('token', newToken);

          // 👇 instantly load cart for signed-up user
          getUserCart(newToken);

          toast.success('Signed up successfully!');
        } else {
          toast.error(response.data.message);
        }
      }

      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <div className='flex items-center justify-center'>
      <div className='w-96 border border-[#77846a]/20 shadow-lg rounded-2xl p-8'>
        <h2 className='text-2xl font-bold mb-6 text-center text-[#2a4125]'>
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {!isLogin && (
            <input
              type='text'
              placeholder='Full Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='border p-2 rounded-lg outline-none focus:ring-0'
              required
            />
          )}

          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border p-2 rounded-lg outline-none focus:ring-0'
            required
          />

          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border p-2 rounded-lg outline-none focus:ring-0'
            required
          />

          <button
            type='submit'
            className='bg-[#2a4125] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer'
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className='mt-4 text-center text-gray-600'>
          {isLogin ? 'Don’t have an account?' : 'Already have an account?'}{' '}
          <span
            className='text-green-700 cursor-pointer font-medium hover:underline'
            onClick={toggleForm}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}
