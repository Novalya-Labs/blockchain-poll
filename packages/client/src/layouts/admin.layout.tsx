import Logo from '@/assets/images/logo.png';
import { Footer } from '@/components/auth-layout/Footer';
import { MainContentArea } from '@/components/auth-layout/MainContentArea';
import { ToggleSidebar } from '@/components/auth-layout/ToggleSidebar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { env } from '@/configs/env';
import { useAuthStore } from '@/features/auth/authStore';
import { adminRoutes, publicRoutes } from '@/navigations/urls';
import { VideoIcon, BarChart3 } from 'lucide-react';

import { Navigate, useLocation, useNavigate } from 'react-router-dom';

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const pathname = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={publicRoutes.signIn} />;
  }

  return (
    <SidebarProvider>
      <ToggleSidebar />
      <Sidebar className="bg-sidebar text-sidebar-foreground border-0 shadow-none">
        <SidebarContent>
          <SidebarHeader className="text-lg font-bold text-center flex items-center justify-center gap-2">
            <img src={Logo} alt={env.app.name} className="size-10 rounded-full" />
            <span>{env.app.name.split('-')[1]}</span>
          </SidebarHeader>
          <SidebarGroup className="px-0">
            <SidebarGroupContent className="px-0">
              <SidebarMenu className="gap-2 p-2">
                <SidebarMenuItem
                  onClick={() => navigate(adminRoutes.dashboard)}
                  className={`p-2 flex items-center gap-2 rounded-md cursor-pointer ${pathname.pathname === adminRoutes.dashboard ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/80'}`}
                >
                  <VideoIcon className="size-4" />
                  <span>Dashboard</span>
                </SidebarMenuItem>
                <SidebarMenuItem
                  onClick={() => navigate(adminRoutes.polls)}
                  className={`p-2 flex items-center gap-2 rounded-md cursor-pointer ${pathname.pathname === adminRoutes.polls ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/80'}`}
                >
                  <BarChart3 className="size-4" />
                  <span>Polls</span>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="flex flex-row items-center justify-between">
          <Footer />
        </SidebarFooter>
      </Sidebar>

      <MainContentArea />
    </SidebarProvider>
  );
}
