import AuthLayout from '@/layouts/admin.layout';
import DashboardPage from '@/pages/admin/dashboard';
import { adminRoutes } from './urls';

export const adminBrowserRoutes = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: adminRoutes.dashboard,
        element: <DashboardPage />,
      },
    ],
  },
];
