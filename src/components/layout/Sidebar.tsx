import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  Trash2, 
  ChevronLeft,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/blogs', icon: FileText, label: 'All Blogs' },
  { to: '/blogs/new', icon: Plus, label: 'Create Blog' },
  { to: '/trash', icon: Trash2, label: 'Trash' },
];

export const Sidebar = ({ 
  isCollapsed, 
  isMobileOpen, 
  onToggleCollapse,
  onCloseMobile 
}: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 h-screen bg-sidebar transition-all duration-300 flex flex-col transform",
          // keep fixed on large screens so sidebar always spans full viewport
          isCollapsed ? "lg:w-16 w-64" : "lg:w-64 w-64",
          // mobile slide-in/out; always visible on lg
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            {!isCollapsed ? (
              <>
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
                  <FileText className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-bold text-sidebar-foreground">BlogAdmin</h1>
              </>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-sidebar-foreground" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop collapse button */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
              aria-label="Toggle sidebar"
            >
              <ChevronLeft className={cn(
                "w-5 h-5 transition-transform",
                isCollapsed && "rotate-180"
              )} />
            </button>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
              aria-label="Close mobile sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const path = location.pathname;
            let isActive = false;

            if (item.to === '/') {
              isActive = path === '/';
            } else if (item.to === '/blogs') {
              // Match /blogs and /blogs/:id but NOT /blogs/new (create page)
              isActive = path === '/blogs' || (path.startsWith('/blogs/') && !path.startsWith('/blogs/new'));
            } else {
              isActive = path === item.to || (item.to !== '/' && path.startsWith(item.to));
            }
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={cn(
                  "transition-colors flex rounded-lg",
                  isCollapsed
                    ? "justify-center py-3"
                    : "items-center gap-3 px-3 py-2.5",
                  "text-sidebar-muted hover:text-sidebar-foreground",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent"
                )}
              >
                <div className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-md",
                  isActive ? "bg-sidebar-primary/20" : ""
                )}>
                  <item.icon className={cn("w-5 h-5", isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground")} />
                </div>
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border flex items-center justify-center mt-auto">
          {!isCollapsed ? (
            <p className="text-xs text-sidebar-muted">© 2025 BlogAdmin</p>
          ) : (
            <p className="text-xs text-sidebar-muted">© 2025</p>
          )}
        </div>
      </aside>
    </>
  );
};
