import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isCollapsed, isMobileOpen, toggleCollapse, toggleMobile, closeMobile } = useSidebar();

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onToggleCollapse={toggleCollapse}
        onCloseMobile={closeMobile}
      />
      
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        // push main content to the right to avoid overlapping the fixed sidebar
        isCollapsed ? "lg:ml-16" : "lg:ml-64"
      )}>
        <Navbar onToggleMobile={toggleMobile} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
