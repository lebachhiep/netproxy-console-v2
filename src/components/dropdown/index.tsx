import React, { useState, createContext, useContext, useRef, useEffect, ReactNode, MouseEventHandler } from 'react';
import { useFloating, autoUpdate, offset, flip, shift, UseFloatingReturn } from '@floating-ui/react-dom';
import { FiChevronDown } from 'react-icons/fi';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  trigger: 'click' | 'hover' | 'both';
  refs: UseFloatingReturn['refs'] & { setReference?: (node: HTMLElement | null) => void; setFloating?: (node: HTMLElement | null) => void };
  floatingStyles: React.CSSProperties;
  placement: string;
  autoPlacement: 'top' | 'bottom';
  positionClasses: string;
  handleMouseEnter: () => void;
  handleMouseLeave: (e: React.MouseEvent) => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

interface DropdownProps {
  children: ReactNode;
  defaultOpen?: boolean;
  trigger?: 'click' | 'hover' | 'both';
  placement?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

function Dropdown({ children, defaultOpen = false, trigger = 'click', placement = 'bottom' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const [autoPlacement, setAutoPlacement] = useState<'top' | 'bottom'>(placement === 'top' ? 'top' : 'bottom');
  const { refs, floatingStyles } = useFloating({
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    placement: 'bottom-start'
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !dropdownRef.current) return;
    const rect = dropdownRef.current.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 240; // max-h-60 ~ 240px
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      setAutoPlacement('top');
    } else {
      setAutoPlacement('bottom');
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (trigger === 'hover' || trigger === 'both') {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (trigger !== 'hover' && trigger !== 'both') return;

    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }

    const to = (e.relatedTarget as Node) || null;
    if (dropdownRef.current && to && dropdownRef.current.contains(to)) {
      return;
    }

    const x = (e as React.MouseEvent).clientX;
    const y = (e as React.MouseEvent).clientY;
    const el = document.elementFromPoint(x, y);
    if (dropdownRef.current && el && dropdownRef.current.contains(el)) {
      return;
    }

    hoverTimeout.current = setTimeout(() => setIsOpen(false), 120);
  };

  // Get position classes based on placement (like Select.tsx)
  const getPositionClasses = () => {
    // Only use autoPlacement for 'top'/'bottom', fallback to original for others
    if (placement === 'top' || placement === 'bottom') {
      switch (autoPlacement) {
        case 'top':
          return 'bottom-full mb-1 left-0 right-0';
        case 'bottom':
        default:
          return 'top-full mt-1 left-0 right-0';
      }
    }
    // Fallback for left/right placements
    switch (placement) {
      case 'top-left':
        return 'bottom-full mb-1 right-0';
      case 'top-right':
        return 'bottom-full mb-1 left-0';
      case 'bottom-left':
        return 'top-full mt-1 right-0';
      case 'bottom-right':
        return 'top-full mt-1 left-0';
      default:
        return 'top-full mt-1 left-0 right-0';
    }
  };

  const positionClasses = getPositionClasses();

  return (
    <DropdownContext.Provider
      value={
        {
          isOpen,
          setIsOpen,
          trigger,
          refs,
          floatingStyles,
          placement,
          autoPlacement,
          positionClasses,
          handleMouseEnter,
          handleMouseLeave
        } as any
      }
    >
      <div ref={dropdownRef} className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

interface TriggerProps {
  children: ReactNode | ((isOpen: boolean) => ReactNode);
  className?: string;
  asIcon?: boolean;
  showChevron?: boolean;
}

function Trigger({ children, className = '', asIcon = false, showChevron = false }: TriggerProps) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('Dropdown.Trigger must be used within Dropdown');
  const { isOpen, setIsOpen, trigger, refs, handleMouseEnter, handleMouseLeave } = context as any;

  const baseClasses = asIcon
    ? 'w-25 h-10 rounded-lg transition-colors flex items-center justify-center'
    : twMerge(
        'shadow-xs transition-all duration-300 flex items-center gap-1 justify-between w-full h-12 px-3 border-2 rounded-lg bg-bg-secondary dark:bg-bg-primary-dark text-sm dark:text-text-me-dark',
        isOpen
          ? 'border-primary dark:border-primary-dark'
          : 'border-border-element dark:border-border-element-dark hover:bg-bg-input dark:hover:bg-bg-input-dark hover:font-bold hover:text-text-hi dark:hover:text-text-hi-dark hover:border-blue dark:hover:border-transparent'
      );

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (trigger === 'click' || trigger === 'both') {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (trigger === 'click' || trigger === 'both') {
        setIsOpen(!isOpen);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <button
      ref={refs.setReference as (node: HTMLButtonElement | null) => void}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      className={twMerge(baseClasses, className)}
      type="button"
    >
      {typeof children === 'function' ? children(isOpen) : children}
      {!asIcon && showChevron && (
        <FiChevronDown
          className={twMerge('transition-transform text-text-me dark:text-text-me-dark w-4 h-4', isOpen ? 'rotate-180' : 'rotate-0')}
        />
      )}
    </button>
  );
}

interface MenuProps {
  children: ReactNode;
  className?: string;
}

function Menu({ children, className = '' }: MenuProps) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('Dropdown.Menu must be used within Dropdown');
  const { isOpen, positionClasses, handleMouseEnter, handleMouseLeave } = context as any;

  if (!isOpen) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={twMerge(
        'p-1 absolute bg-bg-secondary dark:bg-bg-secondary-dark border border-border-element dark:border-border-element-dark rounded-lg shadow-md z-50 transition-all duration-300 ease-out overflow-y-auto flex flex-col gap-1 max-h-60',
        positionClasses,
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      {children}
    </div>
  );
}

interface ItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
}

function Item({ children, onClick, className = '', isActive }: ItemProps) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('Dropdown.Item must be used within Dropdown');
  const { setIsOpen } = context;

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    onClick?.();
    setIsOpen(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <button
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      className={twMerge(
        clsx(
          'text-text-hi dark:text-text-me-dark transition-all duration-300 rounded-lg font-medium px-3 py-2 cursor-pointer text-sm w-full text-left hover:bg-bg-hover-gray dark:hover:bg-bg-hover-gray-dark hover:font-bold whitespace-nowrap',
          { 'bg-bg-hover-gray dark:bg-bg-hover-gray-dark font-bold ': isActive }
        ),
        className
      )}
      type="button"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="border-t border-border-element dark:border-border-element-dark my-1" />;
}

// Attach sub-components to main component
Dropdown.Trigger = Trigger;
Dropdown.Menu = Menu;
Dropdown.Item = Item;
Dropdown.Divider = Divider;

export { Dropdown };
