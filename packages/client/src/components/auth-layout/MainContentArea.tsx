import { Outlet } from 'react-router-dom';

export const MainContentArea: React.FC = () => {
  return (
    <main className="flex-1 bg-background text-foreground relative">
      <Outlet />
    </main>
  );
};
