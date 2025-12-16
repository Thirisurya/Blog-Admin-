import { Menu, Bell, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface NavbarProps {
  onToggleMobile: () => void;
}

export const Navbar = ({ onToggleMobile }: NavbarProps) => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobile}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-lg font-semibold text-foreground hidden sm:block">
          Blog Management
        </h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </button>
        <div className="flex items-center gap-3 pl-2 border-l border-border ml-2">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">Admin</p>
            <p className="text-xs text-muted-foreground">admin@blog.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};
