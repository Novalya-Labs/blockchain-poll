import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuthStore } from '@/features/auth/authStore';
import { publicRoutes } from '@/navigations/urls';
import { Globe, LogOutIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const Footer = () => {
  const { signOut, language, setLanguage, role } = useAuthStore();
  const { open } = useSidebar();
  const navigate = useNavigate();
  const { t } = useTranslation(['common']);

  const handleSignOut = async () => {
    await signOut();
    navigate(publicRoutes.signIn);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const getInitials = (name: string | undefined): string => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <div className="flex items-center gap-3 py-2 justify-between w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-3 cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-muted-foreground bg-sidebar-accent dark:bg-muted">
                {getInitials(role === 'civil' ? 'Civil' : 'Admin').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {open ? (
              <div className="flex flex-col">
                <span className="text-sidebar-foreground text-sm">{role === 'civil' ? 'Civil' : 'Admin'}</span>
              </div>
            ) : null}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-popover border-border text-popover-foreground">
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer hover:bg-accent text-destructive">
            <LogOutIcon className="mr-2 h-4 w-4 text-destructive" />
            {t('userDropdown.signOut')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center cursor-pointer p-2 rounded-full hover:bg-sidebar-accent">
            <Globe className="h-5 w-5 text-sidebar-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-popover border-border text-popover-foreground">
          <DropdownMenuItem
            onClick={() => handleLanguageChange('en')}
            className={`cursor-pointer hover:bg-accent ${language === 'en' ? 'bg-accent' : ''}`}
          >
            <span className="mr-2">🇬🇧</span>
            English
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleLanguageChange('fr')}
            className={`cursor-pointer hover:bg-accent ${language === 'fr' ? 'bg-accent' : ''}`}
          >
            <span className="mr-2">🇫🇷</span>
            Français
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
