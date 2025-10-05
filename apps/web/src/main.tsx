import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@vitalize/ui';
import { Layout } from './pages/Layout';
import { Patients } from './pages/Patients';
import { PatientDetail } from './pages/PatientDetail';
import { Plans } from './pages/Plans';
import { Analytics } from './pages/Analytics';
import { Messages } from './pages/Messages';
import { Settings } from './pages/Settings';
import { Privacy } from './pages/Privacy';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Patients /> },
      { path: 'patients/:id', element: <PatientDetail /> },
      { path: 'plans', element: <Plans /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'messages', element: <Messages /> },
      { path: 'settings', element: <Settings /> },
      { path: 'privacy', element: <Privacy /> }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
