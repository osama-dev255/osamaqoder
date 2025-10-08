import React from 'react';

interface CenteredContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CenteredContent({ children, className = '' }: CenteredContentProps) {
  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${className}`}>
      <div className="w-full max-w-4xl">
        {children}
      </div>
    </div>
  );
}