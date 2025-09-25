import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  delay?: number;
  disabled?: boolean;
  trigger?: 'hover' | 'click' | 'both';
  arrow?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  className = '',
  delay = 100,
  disabled = false,
  trigger = 'hover',
  arrow = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800 dark:border-t-gray-200',
    bottom:
      'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800 dark:border-b-gray-200',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800 dark:border-l-gray-200',
    right:
      'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800 dark:border-r-gray-200'
  };

  const checkPosition = () => {
    if (!tooltipRef.current || !triggerRef.current) return;

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let newPosition = position;

    // Check if tooltip goes outside viewport and adjust position
    switch (position) {
      case 'top':
        if (tooltipRect.top < 0) newPosition = 'bottom';
        break;
      case 'bottom':
        if (tooltipRect.bottom > viewport.height) newPosition = 'top';
        break;
      case 'left':
        if (tooltipRect.left < 0) newPosition = 'right';
        break;
      case 'right':
        if (tooltipRect.right > viewport.width) newPosition = 'left';
        break;
    }

    setActualPosition(newPosition);
  };

  const showTooltip = () => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (trigger === 'click' || trigger === 'both') {
      setIsVisible(!isVisible);
    }
  };

  useEffect(() => {
    if (isVisible) {
      checkPosition();
    }
  }, [isVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (trigger === 'click' || trigger === 'both') {
        if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
          setIsVisible(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [trigger]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={trigger === 'hover' || trigger === 'both' ? showTooltip : undefined}
      onMouseLeave={trigger === 'hover' || trigger === 'both' ? hideTooltip : undefined}
      onClick={handleClick}
    >
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-[9999] px-2 py-1 text-xs text-white bg-gray-800 rounded-md shadow-lg whitespace-nowrap dark:bg-gray-200 dark:text-gray-800 transition-opacity duration-200 ${positionClasses[actualPosition]} ${className}`}
          role="tooltip"
          onMouseEnter={trigger === 'hover' || trigger === 'both' ? showTooltip : undefined}
          onMouseLeave={trigger === 'hover' || trigger === 'both' ? hideTooltip : undefined}
        >
          {content}

          {arrow && <div className={`absolute w-0 h-0 border-4 ${arrowClasses[actualPosition]}`} />}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
