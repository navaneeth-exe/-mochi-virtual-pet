import React from 'react';

interface SegmentGaugeProps {
  label: string;
  value: number; // 0 to 100
  icon?: React.ReactNode;
}

export const SegmentGauge: React.FC<SegmentGaugeProps> = ({ label, value, icon }) => {
  // 5 discrete segments: 0-20, 21-40, 41-60, 61-80, 81-100
  const totalSegments = 5;
  const activeSegments = Math.ceil((Math.max(0, Math.min(100, value)) / 100) * totalSegments);

  return (
    <div className="flex flex-col gap-1 w-full max-w-[130px]">
      <div className="flex items-center justify-between text-[10px] font-bold text-[#111111] uppercase tracking-wider">
        <span className="flex items-center gap-1">
          {icon}
          {label}
        </span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="flex gap-1 h-3.5 p-0.5 bg-[#FFFFFF] border-2 border-[#111111] rounded shadow-[1px_1px_0px_#111111]">
        {Array.from({ length: totalSegments }).map((_, idx) => (
          <div
            key={idx}
            className={`flex-1 rounded-sm transition-all duration-300 ${
              idx < activeSegments
                ? 'bg-[#111111]'
                : 'bg-[#D4D4CE] opacity-40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

