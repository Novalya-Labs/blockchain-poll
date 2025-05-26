import DashboardPage from '@/pages/civil/dashboard';
import { civilRoutes } from './urls';
import CivilLayout from '@/layouts/civil.layout';

export const civilBrowserRoutes = [
  {
    element: <CivilLayout />,
    children: [
      {
        path: civilRoutes.dashboard,
        element: <DashboardPage />,
      },
    ],
  },
];
