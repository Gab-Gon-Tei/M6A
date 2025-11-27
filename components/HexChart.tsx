import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Attributes } from '../types';

interface HexChartProps {
  attributes: Attributes;
  color?: string;
  compareAttributes?: Attributes;
  compareColor?: string;
}

const HexChart: React.FC<HexChartProps> = ({
  attributes,
  color = "#00ff9d",
  compareAttributes,
  compareColor = "#ef4444"
}) => {
  const data = [
    { subject: 'DEFENSE', A: attributes.defense, B: compareAttributes?.defense || 0, fullMark: 100 },
    { subject: 'ATTACK', A: attributes.attack, B: compareAttributes?.attack || 0, fullMark: 100 },
    { subject: 'PHYSICAL', A: attributes.physical, B: compareAttributes?.physical || 0, fullMark: 100 },
    { subject: 'MENTALITY', A: attributes.mentality, B: compareAttributes?.mentality || 0, fullMark: 100 },
    { subject: 'TECHNIQUE', A: attributes.technique, B: compareAttributes?.technique || 0, fullMark: 100 },
    { subject: 'TALENT', A: attributes.talent, B: compareAttributes?.talent || 0, fullMark: 100 },
  ];

  return (
    <div className="w-full h-80 relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Entity A"
            dataKey="A"
            stroke={color}
            strokeWidth={3}
            fill={color}
            fillOpacity={0.3}
          />
          {compareAttributes && (
            <Radar
              name="Entity B"
              dataKey="B"
              stroke={compareColor}
              strokeWidth={3}
              fill={compareColor}
              fillOpacity={0.3}
            />
          )}
          <Tooltip
            contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HexChart;