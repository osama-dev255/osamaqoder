import React from 'react';

interface TabNotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  className?: string;
}

export function TabNotification({ type, message, className = '' }: TabNotificationProps) {
  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'tab-notification-success';
      case 'error':
        return 'tab-notification-error';
      case 'info':
        return 'tab-notification-info';
      case 'warning':
        return 'tab-notification-warning';
      default:
        return 'tab-notification-info';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`${getTypeClass()} ${className} flex items-center`}>
      <span className="mr-2 font-bold">{getTypeIcon()}</span>
      <span>{message}</span>
    </div>
  );
}

interface AlertNotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  className?: string;
}

export function AlertNotification({ type, title, message, className = '' }: AlertNotificationProps) {
  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-error';
      case 'info':
        return 'alert-info';
      case 'warning':
        return 'alert-warning';
      default:
        return 'alert-info';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`${getTypeClass()} ${className}`}>
      <div className="flex items-start">
        <span className="mr-2 text-lg font-bold">{getTypeIcon()}</span>
        <div>
          {title && <h4 className="font-bold mb-1">{title}</h4>}
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}