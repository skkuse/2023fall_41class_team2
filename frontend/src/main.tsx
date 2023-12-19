// import React from 'react';
import ReactDOM from 'react-dom/client';
import './base.scss';
import './Global.scss';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './Layout.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import MainPage from './pages/MainPage.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import Calculator from './pages/Calculator.tsx';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL ?? '';

// Create a router for page routing
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: '/calculate',
        element: <Calculator />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </RecoilRoot>,
  // </React.StrictMode>,
);
