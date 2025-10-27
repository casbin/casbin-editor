import React, { useRef, useState } from 'react';
import { clsx } from 'clsx';

interface MessageWithTooltipProps {
  message: React.ReactNode;
  className?: string;
}

export const MessageWithTooltip: React.FC<MessageWithTooltipProps> = ({ message, className }) => {
  const [showFullMessage, setShowFullMessage] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (messageRef.current) {
      const isOverflowing = messageRef.current.scrollWidth > messageRef.current.clientWidth;
      if (isOverflowing) {
        setShowFullMessage(true);
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!tooltipRef.current?.contains(e.relatedTarget as Node)) {
      setShowFullMessage(false);
    }
  };

  const handleTooltipMouseLeave = (e: React.MouseEvent) => {
    if (!messageRef.current?.contains(e.relatedTarget as Node)) {
      setShowFullMessage(false);
    }
  };

  // Check if message contains timing information (e.g., "Done in 2439.20ms")
  const isDoneMessage = typeof message === 'string' && message.includes('Done in') && message.includes('ms');

  return (
    <div className="relative">
      <div
        ref={messageRef}
        className={clsx(
          'truncate max-w-[300px] sm:max-w-[500px]',
          {
            'cursor-help': typeof message === 'string' && message.length > 50,
          },
          // Better UI for "Done in X ms" messages
          isDoneMessage && clsx(
            'px-3 py-1.5 rounded-lg',
            'bg-green-50 dark:bg-green-900/20',
            'border border-green-200 dark:border-green-800',
            'text-green-700 dark:text-green-400',
            'font-medium text-sm',
            'shadow-sm',
            'flex items-center gap-2',
          ),
          !isDoneMessage && className,
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isDoneMessage && (
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {message}
      </div>

      {showFullMessage && message && (
        <div
          ref={tooltipRef}
          className={clsx(
            'fixed z-50',
            'bg-[#1e1e1e] text-[#e06c75]',
            'w-[800px] min-h-[400px]',
            'p-6',
            'rounded border border-gray-700',
            'top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2',
            'overflow-auto',
          )}
          style={{
            maxHeight: '80vh',
          }}
          onMouseLeave={handleTooltipMouseLeave}
        >
          <div className="whitespace-pre-wrap break-words">{message}</div>
        </div>
      )}
    </div>
  );
};
