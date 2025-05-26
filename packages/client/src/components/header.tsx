import { adminRoutes, civilRoutes, publicRoutes } from '@/navigations/urls';
import { Link } from 'react-router-dom';
import Logo from '@/assets/images/logo.png';
import { Button } from './ui/button';
import { useAuthStore } from '@/features/auth/authStore';

export const Header: React.FC = () => {
  const { isAuthenticated, role } = useAuthStore();

  return (
    <header className="sticky top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-background">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Link to={publicRoutes.home} className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="size-10 rounded-full" />
            <span className="text-2xl font-bold">Blockchain Poll</span>
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <ul className="flex items-center gap-4">
            <li>
              <Link to={publicRoutes.home} className="hover:underline">
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to={publicRoutes.howItWorks} className="hover:underline">
                <span>How it works</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex-1 flex justify-end">
          {isAuthenticated ? (
            <Link to={role === 'civil' ? civilRoutes.dashboard : adminRoutes.dashboard}>
              <Button>
                <span>Dashboard</span>
              </Button>
            </Link>
          ) : (
            <Link to={publicRoutes.signIn}>
              <Button>
                <span>Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
