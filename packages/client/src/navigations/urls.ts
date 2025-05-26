export const adminRoutes = {
  dashboard: '/a/dashboard',
} as const;

export const civilRoutes = {
  dashboard: '/c/dashboard',
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
