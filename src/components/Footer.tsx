import Link from 'next/link';
import {
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiHeart,
} from 'react-icons/fi';

const SOCIAL_LINKS = [
  { icon: FiGithub, href: 'https://github.com', ariaLabel: 'GitHub' },
  { icon: FiTwitter, href: 'https://twitter.com', ariaLabel: 'Twitter' },
  { icon: FiLinkedin, href: 'https://linkedin.com', ariaLabel: 'LinkedIn' },
];

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer
      className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900/50 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">Ticket</span>
              <span>•</span>
              <span>© {CURRENT_YEAR}</span>
            </div>
          </div>

          {/* Center: Social Links */}
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ icon: Icon, href, ariaLabel }) => (
              <a
                key={ariaLabel}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ariaLabel}
                className="p-1.5 rounded text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Right: Links & Status */}
          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
            <Link href="#privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="#terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Terms
            </Link>
            <span>•</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;