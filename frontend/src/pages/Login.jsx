// import { useContext, useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { ShopContext } from '../context/ShopContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// export default function AuthForm() {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true); // true = login, false = signup
//   const { token, setToken, backendUrl, getUserCart } = useContext(ShopContext);

//   // ✅ useForm hook
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   // ✅ toggle between login & signup
//   const toggleForm = () => {
//     setIsLogin((prev) => !prev);
//     reset(); // clear form values when switching
//   };

//   // ✅ form submit handler
//   const onSubmit = async (data) => {
//     try {
//       if (isLogin) {
//         // ---- LOGIN ----
//         const response = await axios.post(backendUrl + '/api/user/login', {
//           email: data.email,
//           password: data.password,
//         });

//         if (response.data.success) {
//           const newToken = response.data.token;

//           setToken(newToken);
//           localStorage.setItem('token', newToken);
//           getUserCart(newToken);

//           toast.success('Logged in successfully!');
//         } else {
//           toast.error(response.data.message);
//         }
//       } else {
//         // ---- SIGNUP ----
//         const response = await axios.post(backendUrl + '/api/user/register', {
//           name: data.name,
//           email: data.email,
//           password: data.password,
//         });

//         if (response.data.success) {
//           const newToken = response.data.token;

//           setToken(newToken);
//           localStorage.setItem('token', newToken);
//           getUserCart(newToken);

//           toast.success('Signed up successfully!');
//         } else {
//           toast.error(response.data.message);
//         }
//       }

//       reset(); // clear form fields after submit
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//       console.error(error);
//     }
//   };

//   // ✅ redirect if already logged in
//   useEffect(() => {
//     if (token) {
//       navigate('/');
//     }
//   }, [token, navigate]);

//   return (
//     <div className='flex items-center justify-center'>
//       <div className='w-96 border border-[#77846a]/20 shadow-lg rounded-2xl p-8'>
//         <h2 className='text-2xl font-bold mb-6 text-center text-[#2a4125]'>
//           {isLogin ? 'Login' : 'Sign Up'}
//         </h2>

//         <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
//           {/* Signup Only Field */}
//           {!isLogin && (
//             <div>
//               <input
//                 type='text'
//                 placeholder='Full Name'
//                 {...register('name', {
//                   required: !isLogin && 'Full name is required',
//                 })}
//                 className='border p-2 rounded-lg outline-none focus:ring-0 w-full'
//               />
//               {errors.name && (
//                 <p className='text-red-500 text-sm'>{errors.name.message}</p>
//               )}
//             </div>
//           )}

//           {/* Email */}
//           <div>
//             <input
//               type='email'
//               placeholder='Email'
//               {...register('email', {
//                 required: 'Email is required',
//                 pattern: {
//                   value: /^[^@]+@[^@]+\.[^@]+$/,
//                   message: 'Enter a valid email',
//                 },
//               })}
//               className='border p-2 rounded-lg outline-none focus:ring-0 w-full'
//             />
//             {errors.email && (
//               <p className='text-red-500 text-sm'>{errors.email.message}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <input
//               type='password'
//               placeholder='Password'
//               {...register('password', {
//                 required: 'Password is required',
//                 minLength: {
//                   value: 6,
//                   message: 'Password must be at least 6 characters',
//                 },
//               })}
//               className='border p-2 rounded-lg outline-none focus:ring-0 w-full'
//             />
//             {errors.password && (
//               <p className='text-red-500 text-sm'>{errors.password.message}</p>
//             )}
//           </div>

//           <button
//             type='submit'
//             className='bg-[#2a4125] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer'
//           >
//             {isLogin ? 'Login' : 'Sign Up'}
//           </button>
//         </form>

//         <p className='mt-4 text-center text-gray-600'>
//           {isLogin ? 'Don’t have an account?' : 'Already have an account?'}{' '}
//           <span
//             className='text-green-700 cursor-pointer font-medium hover:underline'
//             onClick={toggleForm}
//           >
//             {isLogin ? 'Sign Up' : 'Login'}
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

export default function AuthForm() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // true = login, false = signup
  const { token, setToken, backendUrl, getUserCart } = useContext(ShopContext);

  // ✅ useForm hook
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // ✅ Mutation function (runs when form is submitted)
  const authMutation = useMutation({
    mutationFn: async ({ type, data }) => {
      if (type === 'login') {
        return axios.post(`${backendUrl}/api/user/login`, {
          email: data.email,
          password: data.password,
        });
      } else {
        return axios.post(`${backendUrl}/api/user/register`, {
          name: data.name,
          email: data.email,
          password: data.password,
        });
      }
    },
    onSuccess: (response) => {
      if (response.data.success) {
        const newToken = response.data.token;
        setToken(newToken);
        localStorage.setItem('token', newToken);

        // instantly load user cart
        getUserCart(newToken);

        toast.success(
          isLogin ? 'Logged in successfully!' : 'Signed up successfully!'
        );
        reset();
      } else {
        toast.error(response.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message);
      console.error(error);
    },
  });

  // ✅ toggle between login & signup
  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    reset(); // clear form values when switching
  };

  // ✅ form submit handler → just call mutation
  const onSubmit = (data) => {
    authMutation.mutate({
      type: isLogin ? 'login' : 'register',
      data,
    });
  };

  // ✅ redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className='flex items-center justify-center'>
      <div className='w-96 border border-[#77846a]/20 shadow-lg rounded-2xl p-8'>
        <h2 className='text-2xl font-bold mb-6 text-center text-[#2a4125]'>
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          {/* Signup Only Field */}
          {!isLogin && (
            <div>
              <input
                type='text'
                placeholder='Full Name'
                {...register('name', {
                  required: !isLogin && 'Full name is required',
                })}
                className='border p-2 rounded-lg outline-none focus:ring-0 w-full'
              />
              {errors.name && (
                <p className='text-red-500 text-sm'>{errors.name.message}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <input
              type='email'
              placeholder='Email'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^@]+@[^@]+\.[^@]+$/,
                  message: 'Enter a valid email',
                },
              })}
              className='border p-2 rounded-lg outline-none focus:ring-0 w-full'
            />
            {errors.email && (
              <p className='text-red-500 text-sm'>{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type='password'
              placeholder='Password'
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className='border p-2 rounded-lg outline-none focus:ring-0 w-full'
            />
            {errors.password && (
              <p className='text-red-500 text-sm'>{errors.password.message}</p>
            )}
          </div>

          <button
            type='submit'
            disabled={authMutation.isLoading}
            className='bg-[#2a4125] text-white py-2 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-70'
          >
            {authMutation.isLoading
              ? 'Please wait...'
              : isLogin
              ? 'Login'
              : 'Sign Up'}
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
