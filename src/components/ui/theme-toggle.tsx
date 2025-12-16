import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
        <Sun className="w-5 h-5 text-muted-foreground" />
      </div>
    );
  }

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors"
      title={`Current: ${theme} (click to cycle)`}
    >
      {theme === 'light' && <Sun className="w-5 h-5 text-warning" />}
      {theme === 'dark' && <Moon className="w-5 h-5 text-primary" />}
      {theme === 'system' && <Monitor className="w-5 h-5 text-muted-foreground" />}
    </button>
  );
};
