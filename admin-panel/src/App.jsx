import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './layout/Main';
import ListItems from './pages/ListItems';
import Orders from './pages/Orders';
import AddProduct from './pages/AddProduct';

const router = createBrowserRouter([
  {
    element: <Main />,
    children: [
      {
        path: '/',
        element: <ListItems />,
      },
      {
        path: '/Add',
        element: <AddProduct />,
      },
      {
        path: '/Order',
        element: <Orders />,
      },
    ],
  },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
