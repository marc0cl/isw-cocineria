import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';

import ProductPage from '@pages/ProductPage';
import Product from '@pages/Product';
import DeleteProduct from '@pages/DeleteProduct';
import UpdateProduct from '@pages/UpdateProduct';
import GestionProveedores from '@pages/GestionProveedores';

import '@styles/styles.css';
import Finances from "@pages/Finances.jsx";
import AddIncome from "@pages/AddIncome.jsx";
import Shifts from '@pages/shiftManagement.jsx';

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
      },
      {
        path: '/finanzas',
        element: (
            <ProtectedRoute allowedRoles={['administrador']}>
              <Finances />
            </ProtectedRoute>
        ),
      },
      {
        path: '/ingresar-ingresos',
        element: (
            <ProtectedRoute allowedRoles={['administrador', 'garzon']}>
              <AddIncome />
            </ProtectedRoute>
        ),
      },
      {
        path: '/gestion-proveedores',
        element: (
            <ProtectedRoute allowedRoles={['administrador','encargado']}>
              <GestionProveedores />
            </ProtectedRoute>
        )
      },
      {
        path: '/turnos',
        element: (
            <ProtectedRoute allowedRoles={['administrador','usuario']}>
              <Shifts />
            </ProtectedRoute>
        ),
      },
    ]
  },

  {
    path: '/',
    element: <Root />,
    children: [

      { path: '/products', element: <Product /> },
      {
        path: '/add-product',
        element: (
            <ProtectedRoute allowedRoles={['administrador']}>
              <ProductPage />
            </ProtectedRoute>
        )
      },
      {
        path: '/delete-product',
        element: (
            <ProtectedRoute allowedRoles={['administrador']}>
              <DeleteProduct />
            </ProtectedRoute>
        )
      },
      {
        path: '/edit-product',
        element: (
            <ProtectedRoute allowedRoles={['administrador']}>
              <UpdateProduct />
            </ProtectedRoute>
        )
      },

    ]
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
