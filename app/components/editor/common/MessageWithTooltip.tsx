import React, { useRef, useState } from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

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
            'inline-flex items-center gap-2',
            'px-4 py-2 rounded-full',
            'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30',
            'border-2 border-green-300 dark:border-green-700',
            'text-green-700 dark:text-green-300',
            'font-semibold text-sm',
            'shadow-md',
          ),
          !isDoneMessage && className,
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isDoneMessage && (
          <Check className="w-5 h-5 flex-shrink-0" />
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
