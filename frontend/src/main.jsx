import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import ProductPage from '@pages/ProductPage';  // Página para agregar productos
import Product from '@pages/Product';        // Página para listar productos
import DeleteProduct from '@pages/DeleteProduct'; // Página para eliminar productos
import UpdateProduct from '@pages/UpdateProduct'; // Página para actualizar productos

import '@styles/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        ),
      }
    ]
  },

  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/products', element: <Product /> },       // Ruta para la lista de productos
      { path: '/add-product', element: <ProductPage /> }, // Ruta para agregar productos
      { path: '/delete-product', element: <DeleteProduct /> }, // Ruta para eliminar productos
      { path: '/edit-product', element: <UpdateProduct /> }, // Ruta para actualizar productos

    ],
  },

  {
    path: '/auth',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
