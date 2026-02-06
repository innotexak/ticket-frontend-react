import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      className={`
        bg-primary rounded-lg shadow-md border border-border-default dark:border-white/10
        ${hoverable ? 'hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-all duration-200' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`px-6 py-4 border-b border-border-default dark:border-white/10 ${className}`}>
    {children}
  </div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`px-6 py-4 ${className}`}>{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`px-6 py-4 border-t border-border-default dark:border-white/10 bg-secondary dark:bg-gray-800/50 rounded-b-lg flex gap-2 justify-end ${className}`}>
    {children}
  </div>
);