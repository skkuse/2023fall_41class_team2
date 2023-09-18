// import React from 'react';
import ReactDOM from 'react-dom/client';
import './base.scss';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './Layout.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import Home from './pages/Home.tsx';
import { RecoilRoot } from 'recoil';

// Create a router for page routing
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <RecoilRoot>
    <RouterProvider router={router} />,
  </RecoilRoot>,
  // </React.StrictMode>,
);
