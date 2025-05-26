import { MainContentArea } from '@/components/auth-layout/MainContentArea';
import { useAuthStore } from '@/features/auth/authStore';
import { publicRoutes } from '@/navigations/urls';
import { Navigate } from 'react-router-dom';

export default function CivilLayout() {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={publicRoutes.signIn} />;
  }

  if (role !== 'civil') {
    return <Navigate to={publicRoutes.signIn} />;
  }

  return (
    <>
      <MainContentArea />
    </>
  );
}
