import ErrorBoundaryPage from '@/components/error-boundary';
import RootLayout from '@/layouts/root.layout';
import NotFoundPage from '@/pages/public/not-found';
import { createBrowserRouter } from 'react-router-dom';
import { adminBrowserRoutes } from './admin.routes';
import { publicBrowserRoutes } from './public.routes';
import { civilBrowserRoutes } from './civil.routes';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      ...publicBrowserRoutes,
      ...adminBrowserRoutes,
      ...civilBrowserRoutes,
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
