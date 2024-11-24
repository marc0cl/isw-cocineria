import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';
import ShiftManagement  from '@pages/ShiftManagement';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <Error404/>,
    children: [
      {
        path: '/home',
        element: <Home/>
      },
      {
        path: '/users',
        element: (
        <ProtectedRoute allowedRoles={['administrador']}>
          <Users />
        </ProtectedRoute>
        )
    }, 
    {
      path: '/gestion-turnos',
      element: <ShiftManagement/>
    }
    ]
  },
  {
    path: '/auth',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)

document.addEventListener('DOMContentLoaded', () => {
  let listElements = document.querySelectorAll('.list__button--click');

  listElements.forEach(listElement => {
    listElement.addEventListener('click', () => {
      //alert()
      listElement.classList.toggle('arrow');

      let height = 0;
      let menu = listElement.nextElementSibling;
      if (menu.clientHeight == '0') {
        height = menu.scrollHeight;

      }

      menu.style.height = `${height}px`;
    });
  });
});