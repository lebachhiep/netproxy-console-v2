import React from 'react';
import { Badge, StatusColor } from '../badge/Badge';
import { Button, ButtonProps } from '../button/Button';
import { ArrowRepeatAll, DataPie, DocumentTable, HourglassHalf } from '../icons';
import { Switch } from '../switch/Switch';

// ============================================================================
// Card Context
// ============================================================================
interface CardContextValue {
  onClick?: () => void;
}

const CardContext = React.createContext<CardContextValue | undefined>(undefined);

const useCardContext = () => {
  const context = React.useContext(CardContext);
  if (!context) {
    throw new Error('Card compound components must be used within Card');
  }
  return context;
};

// ============================================================================
// Card Root Component
// ============================================================================
interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  tag?: { text: string; icon?: React.ReactNode };
}

const CardRoot: React.FC<CardProps> = ({ children, onClick, className = '', tag }) => {
  return (
    <CardContext.Provider value={{ onClick }}>
      <div
        onClick={onClick}
        className={`group cursor-pointer relative w-full h-full rounded-xl border-2 border-border-element bg-bg-primary dark:bg-bg-primary-dark dark:border-border-element-dark hover:bg-bg-secondary dark:hover:bg-bg-secondary-dark hover:shadow-md shadow-xs p-5 flex flex-col gap-4 transition-all hover:border-blue hover:dark:border-blue-dark ${className}`}
      >
        {tag && (
          <span className="absolute -top-3 left-0 flex items-center gap-1  bg-primary text-white text-xs font-semibold pl-1 pr-3 py-1 rounded-[50px_100px_100px_0] shadow">
            {tag.icon && <span className="text-sm">{tag.icon}</span>}
            {tag.text}
          </span>
        )}
        {children}
      </div>
    </CardContext.Provider>
  );
};

// ============================================================================
// Card Tag Component
// ============================================================================
interface CardTagProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const CardTag: React.FC<CardTagProps> = ({ children, icon }) => {
  return (
    <span className="absolute -top-3 left-0 flex items-center gap-1 bg-primary text-white text-xs font-semibold pl-1 pr-3 py-1 rounded-[50px_100px_100px_0] shadow">
      {icon && <span className="text-sm">{icon}</span>}
      {children}
    </span>
  );
};

// ============================================================================
// Card Content Component
// ============================================================================
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`flex flex-col gap-5 text-text-me dark:text-text-me-dark group-hover:text-text-hi group-hover:dark:text-text-hi-dark ${className}`}
    >
      {children}
    </div>
  );
};

// ============================================================================
// Card Header Component
// ============================================================================
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return <div className={`flex items-start justify-between ${className}`}>{children}</div>;
};

// ============================================================================
// Card Title Component
// ============================================================================
interface CardTitleProps {
  children: React.ReactNode;
  status?: { text: string; color?: StatusColor };
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, status, className = '' }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h3 className="text-lg font-semibold font-averta line-clamp-1">{children}</h3>
      {status && <Badge color={status.color}>{status.text}</Badge>}
    </div>
  );
};

// ============================================================================
// Card Action Component
// ============================================================================
interface CardActionProps {
  children?: React.ReactNode;
  onClick?: () => void;
  text?: string;
  variant?: ButtonProps['variant'];
  className?: string;
}

const CardAction: React.FC<CardActionProps> = ({ children, onClick, text = 'Chọn gói', variant = 'default', className = '' }) => {
  const { onClick: cardOnClick } = useCardContext();

  return (
    <Button
      onClick={onClick || cardOnClick}
      variant={variant}
      className={`h-10 group-hover:bg-primary group-hover:dark:bg-primary-dark group-hover:border-primary-border group-hover:dark:border-primary-border-dark group-hover:!border-2 group-hover:text-white ${className}`}
    >
      {children || text}
    </Button>
  );
};

// ============================================================================
// Card List Component
// ============================================================================
interface CardListProps {
  children: React.ReactNode;
  className?: string;
}

const CardList: React.FC<CardListProps> = ({ children, className = '' }) => {
  return <ul className={`flex flex-col gap-4 text-base ${className}`}>{children}</ul>;
};

// ============================================================================
// Card List Item Component
// ============================================================================
interface CardListItemProps {
  icon?: React.ReactNode;
  label?: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const CardListItem: React.FC<CardListItemProps> = ({ icon, label, value, children, className = '' }) => {
  return (
    <li className={`flex items-center gap-2 ${className}`}>
      {icon}
      {children || (
        <div>
          {label && <span className="font-semibold">{label}: </span>}
          <span>{value}</span>
        </div>
      )}
    </li>
  );
};

// ============================================================================
// Card Toggle Component
// ============================================================================
interface CardToggleProps {
  icon?: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const CardToggle: React.FC<CardToggleProps> = ({ icon, label, checked, onChange, className = '' }) => {
  return (
    <div className={`flex items-center justify-between rounded-lg p-2 bg-bg-mute dark:bg-bg-mute-dark ${className}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
};

// ============================================================================
// Export Compound Component
// ============================================================================
export const Card = Object.assign(CardRoot, {
  Tag: CardTag,
  Content: CardContent,
  Header: CardHeader,
  Title: CardTitle,
  Action: CardAction,
  List: CardList,
  ListItem: CardListItem,
  Toggle: CardToggle
});
