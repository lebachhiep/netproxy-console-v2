import React, { useState, createContext, useContext, useRef, useEffect, ReactNode, MouseEventHandler } from 'react';
import { useFloating, autoUpdate, offset, flip, shift, UseFloatingReturn } from '@floating-ui/react-dom';
import { Chevron } from '../icons';

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  trigger: 'click' | 'hover' | 'both';
  refs: UseFloatingReturn['refs'] & { setReference?: (node: HTMLElement | null) => void; setFloating?: (node: HTMLElement | null) => void };
  floatingStyles: React.CSSProperties;
  placement: string;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

interface DropdownProps {
  children: ReactNode;
  defaultOpen?: boolean;
  trigger?: 'click' | 'hover' | 'both';
}

function Dropdown({ children, defaultOpen = false, trigger = 'click' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const { refs, floatingStyles, placement } = useFloating({
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    placement: 'bottom-start'
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Hover logic: keep open when mouse is over trigger or menu
  const handleMouseEnter = () => {
    if (trigger === 'hover' || trigger === 'both') {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      setIsOpen(true);
    }
  };
  const handleMouseLeave = () => {
    if (trigger === 'hover' || trigger === 'both') {
      hoverTimeout.current = setTimeout(() => setIsOpen(false), 120);
    }
  };

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
  children: ReactNode;
  className?: string;
  asIcon?: boolean;
  showChevron?: boolean;
}

function Trigger({ children, className = '', asIcon = false, showChevron = true }: TriggerProps) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('Dropdown.Trigger must be used within Dropdown');
  const { isOpen, setIsOpen, trigger, refs, handleMouseEnter, handleMouseLeave } = context as any;

  const baseClasses = asIcon
    ? 'p-2 rounded-lg transition-colors'
    : 'flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors';

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (trigger === 'click' || trigger === 'both') {
      setIsOpen(!isOpen);
    }
  };

  return (
    <button
      ref={refs.setReference as (node: HTMLButtonElement | null) => void}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${baseClasses} ${className}`}
      type="button"
    >
      {children}
      {!asIcon && showChevron && <Chevron className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
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
  const { isOpen, refs, floatingStyles, handleMouseEnter, handleMouseLeave } = context as any;

  if (!isOpen) return null;

  return (
    <div
      ref={refs.setFloating as (node: HTMLDivElement | null) => void}
      style={floatingStyles}
      className={`bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

interface ItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

function Item({ children, onClick, className = '' }: ItemProps) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('Dropdown.Item must be used within Dropdown');
  const { setIsOpen } = context;

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    onClick?.();
    setIsOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition-colors ${className}`}
      type="button"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="border-t border-gray-200 my-1" />;
}

// Attach sub-components to main component
Dropdown.Trigger = Trigger;
Dropdown.Menu = Menu;
Dropdown.Item = Item;
Dropdown.Divider = Divider;

export { Dropdown };
