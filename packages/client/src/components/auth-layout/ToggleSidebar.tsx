import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { PanelLeftIcon, PanelRightIcon } from 'lucide-react';

export const ToggleSidebar = () => {
  const { open, openMobile, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  if (!open) {
    return (
      <Button variant="ghost" onClick={toggleSidebar} size="lg" className="has-[>svg]:p-2 absolute left-2 top-2 z-10">
        {open ? (
          <PanelRightIcon className="text-muted-foreground" />
        ) : (
          <PanelLeftIcon className="text-muted-foreground" />
        )}
      </Button>
    );
  }

  if (isMobile && !openMobile) {
    return (
      <Button variant="ghost" onClick={toggleSidebar} size="lg" className="has-[>svg]:p-2 absolute left-2 top-2 z-[10]">
        {open ? (
          <PanelRightIcon className="text-muted-foreground" />
        ) : (
          <PanelLeftIcon className="text-muted-foreground" />
        )}
      </Button>
    );
  }

  return null;
};
