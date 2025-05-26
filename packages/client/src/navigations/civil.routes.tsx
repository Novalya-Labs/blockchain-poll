import DashboardPage from '@/pages/civil/dashboard';
import CivilVotePage from '@/pages/civil/vote';
import CivilVoteOnPollPage from '@/pages/civil/vote/[id]';
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
      {
        path: civilRoutes.vote,
        element: <CivilVotePage />,
      },
      {
        path: civilRoutes.voteOnPoll,
        element: <CivilVoteOnPollPage />,
      },
    ],
  },
];
