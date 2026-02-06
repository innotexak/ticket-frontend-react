import React from 'react';
import { cn } from '@/utils/cn';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size = 'md',
  className,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const showFallback = !src || imageError || !imageLoaded;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-secondary border border-border-default dark:border-white/10 font-medium text-tertiary overflow-hidden',
        sizeClasses[size],
        className
      )}
    >
      {showFallback ? (
        <span className="uppercase">
          {fallback || (alt ? alt.charAt(0) : 'U')}
        </span>
      ) : (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
        />
      )}
    </div>
  );
};

export default Avatar;