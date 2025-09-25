import React from 'react';

interface ColorBoxProps {
  colorClass: string;
  label: string;
}

const ColorBox: React.FC<ColorBoxProps> = ({ colorClass, label }) => (
  <div className="flex flex-col items-center gap-1">
    <div className={`w-10 h-10 rounded ${colorClass}`} />
    <span className="text-xs text-text-me dark:text-text-me-dark">{label}</span>
  </div>
);

interface ColorGroupProps {
  title: string;
  colors: { className: string; label: string }[];
}

const ColorGroup: React.FC<ColorGroupProps> = ({ title, colors }) => (
  <div className="flex flex-col gap-2">
    <span className="font-medium text-text-hi dark:text-text-hi-dark">{title}</span>
    <div className="flex items-center gap-3">
      {colors.map((c, idx) => (
        <ColorBox key={idx} colorClass={c.className} label={c.label} />
      ))}
    </div>
  </div>
);

export const ColorPalette = () => {
  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Main */}
      <div className="flex flex-col gap-6">
        <span className="text-lg font-semibold text-text-hi dark:text-text-hi-dark">Main</span>
        <ColorGroup
          title="Primary"
          colors={[
            { className: 'bg-primary', label: '1st' },
            { className: 'bg-primary-border', label: 'Border' },
            { className: 'bg-primary-bg', label: 'BG' }
          ]}
        />
      </div>

      {/* Other */}
      <div className="flex flex-col gap-6">
        <span className="text-lg font-semibold text-text-hi dark:text-text-hi-dark">Other</span>
        <ColorGroup
          title=""
          colors={[
            { className: 'bg-black', label: 'Black' },
            { className: 'bg-white border border-border', label: 'White' },
            { className: 'bg-border', label: 'Border' }
          ]}
        />
      </div>

      {/* Status */}
      <div className="col-span-2 flex flex-col gap-6">
        <span className="text-lg font-semibold text-text-hi dark:text-text-hi-dark">Status</span>

        <ColorGroup
          title="Blue"
          colors={[
            { className: 'bg-blue', label: '1st' },
            { className: 'bg-blue-border', label: 'Border' },
            { className: 'bg-blue-bg', label: 'BG' }
          ]}
        />

        <ColorGroup
          title="Yellow"
          colors={[
            { className: 'bg-yellow', label: '1st' },
            { className: 'bg-yellow-border', label: 'Border' },
            { className: 'bg-yellow-bg', label: 'BG' }
          ]}
        />

        <ColorGroup
          title="Green"
          colors={[
            { className: 'bg-green', label: '1st' },
            { className: 'bg-green-border', label: 'Border' },
            { className: 'bg-green-bg', label: 'BG' }
          ]}
        />
        <ColorGroup
          title="Red"
          colors={[
            { className: 'bg-red', label: '1st' },
            { className: 'bg-red-border', label: 'Border' },
            { className: 'bg-red-bg', label: 'BG' }
          ]}
        />
      </div>
    </div>
  );
};
