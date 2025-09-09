import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './router/Router.jsx';
import ShopContextProvider from './context/ShopContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ShopContextProvider>
      <RouterProvider router={router} />
    </ShopContextProvider>
    <ToastContainer position='top-right' autoClose={1000} />
  </QueryClientProvider>
);
