export const adminRoutes = {
  dashboard: '/a/dashboard',
  polls: '/a/polls',
  pollsCreate: '/a/polls/create',
  pollDetails: '/a/polls/:id',
} as const;

export const civilRoutes = {
  dashboard: '/c/dashboard',
  vote: '/c/vote',
  voteOnPoll: '/c/vote/:id',
} as const;

export const publicRoutes = {
  signIn: '/sign-in',
  home: '/',
  howItWorks: '/how-it-works',
  notFound: '*',
} as const;

export const routes = {
  ...adminRoutes,
  ...civilRoutes,
  ...publicRoutes,
} as const;
