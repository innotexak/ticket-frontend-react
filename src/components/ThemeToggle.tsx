'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

export function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme, isLoaded } = useTheme();

  // Don't render until theme is loaded to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <button
        disabled
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 opacity-50"
        aria-label="Loading theme"
      >
        <FiMonitor className="w-5 h-5" />
      </button>
    );
  }

  const getIcon = () => {
    if (theme === 'system') {
      return resolvedTheme === 'dark' ? (
        <FiMoon className="w-5 h-5" />
      ) : (
        <FiSun className="w-5 h-5" />
      );
    }
    return theme === 'dark' ? (
      <FiMoon className="w-5 h-5" />
    ) : (
      <FiSun className="w-5 h-5" />
    );
  };

  const getLabel = () => {
    if (theme === 'system') {
      return `System (${resolvedTheme})`;
    }
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  return (
    <div className="relative group">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg   transition-colors text-gray-700 dark:text-gray-300"
    
        aria-label="Toggle theme"
      >
        {getIcon()}
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs  rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        {getLabel()} - Click to change
      </div>
    </div>
  );
}

export default ThemeToggle;