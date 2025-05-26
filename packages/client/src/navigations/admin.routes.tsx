import AuthLayout from '@/layouts/admin.layout';
import DashboardPage from '@/pages/admin/dashboard';
import AdminPollsPage from '@/pages/admin/polls';
import AdminPollDetailsPage from '@/pages/admin/polls/[id]';
import { adminRoutes } from './urls';

export const adminBrowserRoutes = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: adminRoutes.dashboard,
        element: <DashboardPage />,
      },
      {
        path: adminRoutes.polls,
        element: <AdminPollsPage />,
      },
      {
        path: adminRoutes.pollDetails,
        element: <AdminPollDetailsPage />,
      },
    ],
  },
];
