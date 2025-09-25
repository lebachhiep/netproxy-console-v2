import React from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';

interface DataUsageData {
  period: string;
  averageConcurrency: number;
  bandwidthUsed: number;
  projectedBandwidthUse: number;
}

const data: DataUsageData[] = [
  { period: 'T1', averageConcurrency: 300, bandwidthUsed: 350, projectedBandwidthUse: 360 },
  { period: 'T2', averageConcurrency: 280, bandwidthUsed: 320, projectedBandwidthUse: 340 },
  { period: 'T3', averageConcurrency: 260, bandwidthUsed: 310, projectedBandwidthUse: 330 },
  { period: 'T4', averageConcurrency: 240, bandwidthUsed: 400, projectedBandwidthUse: 420 },
  { period: 'T5', averageConcurrency: 220, bandwidthUsed: 450, projectedBandwidthUse: 480 },
  { period: 'T6', averageConcurrency: 200, bandwidthUsed: 380, projectedBandwidthUse: 400 },
  { period: 'T7', averageConcurrency: 180, bandwidthUsed: 500, projectedBandwidthUse: 540 },
  { period: 'T8', averageConcurrency: 160, bandwidthUsed: 580, projectedBandwidthUse: 620 },
  { period: 'T9', averageConcurrency: 140, bandwidthUsed: 680, projectedBandwidthUse: 730 },
  { period: 'T10', averageConcurrency: 120, bandwidthUsed: 750, projectedBandwidthUse: 800 },
  { period: 'T11', averageConcurrency: 100, bandwidthUsed: 780, projectedBandwidthUse: 840 },
  { period: 'T12', averageConcurrency: 80, bandwidthUsed: 800, projectedBandwidthUse: 880 }
];

// Format Y-axis labels
const formatYAxisLabel = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)} GB`;
  }
  return `${value} MB`;
};

// Custom dot for bandwidth used line
const CustomActiveDot = (props: any) => {
  const { cx, cy } = props;
  return <circle cx={cx} cy={cy} r={4} fill="#22c55e" stroke="#ffffff" strokeWidth={2} />;
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const bandwidthValue = payload.find((p: any) => p.dataKey === 'bandwidthUsed')?.value;
    if (bandwidthValue) {
      return (
        <div className="bg-white border border-gray-200 rounded px-3 py-2 shadow-lg text-sm font-medium text-gray-700">
          {bandwidthValue} MB
        </div>
      );
    }
  }
  return null;
};

const DataUsageChart: React.FC = () => {
  return (
    <div className="w-full">
      <div className="relative border-t-2 border-b-2 p-5">
        <div className="h-[175px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              {/* Grid */}
              <CartesianGrid strokeDasharray="none" stroke="#f3f4f6" horizontal={true} vertical={false} />

              {/* Y-axis reference lines */}
              <ReferenceLine y={256} stroke="#f3f4f6" strokeDasharray="none" />
              <ReferenceLine y={512} stroke="#f3f4f6" strokeDasharray="none" />
              <ReferenceLine y={768} stroke="#f3f4f6" strokeDasharray="none" />
              <ReferenceLine y={1024} stroke="#f3f4f6" strokeDasharray="none" />

              {/* Axes */}
              <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={formatYAxisLabel}
                domain={[0, 1024]}
                ticks={[0, 256, 512, 768, 1024]}
              />

              {/* Custom Tooltip */}
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#22c55e', strokeWidth: 1, strokeDasharray: '4 4' }}
                position={{ y: 0 }}
              />

              {/* Projected bandwidth area (light green fill) */}
              <Area type="monotone" dataKey="projectedBandwidthUse" stroke="none" fill="#bbf7d0" fillOpacity={0.5} />

              {/* Average Concurrency line (light gray, dashed) */}
              <Line type="monotone" dataKey="averageConcurrency" stroke="#d1d5db" strokeWidth={2} dot={false} strokeDasharray="4 4" />

              {/* Bandwidth used line (green, with dots) */}
              <Line
                type="monotone"
                dataKey="bandwidthUsed"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={false}
                activeDot={<CustomActiveDot />}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="flex items-center justify-center space-x-8 mt-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-gray-300 border-dashed"></div>
            <span className="text-gray-600">Average Concurrency</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-green-500"></div>
            <span className="text-gray-600">Bandwidth used</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-3 bg-green-200 opacity-60"></div>
            <span className="text-gray-600">Projected bandwidth use</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUsageChart;
