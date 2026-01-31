import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
interface DataPoint {
  label: string;
  value: number;
}
interface ChartProps {
  data: DataPoint[];
  type?: 'line' | 'bar';
  height?: number;
  color?: string;
  formatValue?: (value: number) => string;
  showGrid?: boolean;
}
export function Chart({
  data,
  type = 'line',
  height = 200,
  color = '#149499',
  formatValue = (v) => v.toLocaleString(),
  showGrid = true
}: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  // Calculate nice Y-axis values
  const yAxisSteps = 4;
  const stepValue = Math.ceil(maxValue / yAxisSteps / 1000) * 1000;
  const yAxisValues = Array.from(
    {
      length: yAxisSteps + 1
    },
    (_, i) => i * stepValue
  );
  const chartMax = yAxisValues[yAxisValues.length - 1] || maxValue;
  // Responsive width tracking
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  // Chart dimensions
  const padding = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 60
  };
  const chartWidth = Math.max(
    containerWidth - padding.left - padding.right,
    100
  );
  const chartHeight = height - padding.top - padding.bottom;
  // Calculate point positions
  const getX = (index: number) => {
    const step = chartWidth / (data.length - 1 || 1);
    return padding.left + index * step;
  };
  const getY = (value: number) => {
    const ratio = value / chartMax;
    return padding.top + chartHeight * (1 - ratio);
  };
  // Generate path for line chart
  const linePath = data.
  map((point, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(point.value)}`).
  join(' ');
  const areaPath = `
    M ${getX(0)} ${padding.top + chartHeight}
    L ${getX(0)} ${getY(data[0]?.value || 0)}
    ${data.
  slice(1).
  map((point, i) => `L ${getX(i + 1)} ${getY(point.value)}`).
  join(' ')}
    L ${getX(data.length - 1)} ${padding.top + chartHeight}
    Z
  `;
  if (type === 'bar') {
    const barWidth = Math.min(40, chartWidth / data.length * 0.6);
    const barGap = (chartWidth - barWidth * data.length) / (data.length + 1);
    return (
      <div
        ref={containerRef}
        className="w-full"
        style={{
          height
        }}>

        <div className="relative h-full">
          {/* Y-axis labels */}
          {showGrid &&
          <div className="absolute left-0 top-0 bottom-10 w-12 flex flex-col justify-between text-right pr-2">
              {[...yAxisValues].reverse().map((val, i) =>
            <span key={i} className="text-[10px] text-gray-400 font-medium">
                  {val >= 1000 ? `${val / 1000}k` : val}
                </span>
            )}
            </div>
          }

          {/* Chart area */}
          <div className="absolute left-12 right-0 top-0 bottom-0 flex flex-col">
            {/* Bars container */}
            <div className="flex-1 flex items-end justify-around px-2 relative">
              {/* Grid lines */}
              {showGrid &&
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {yAxisValues.map((_, i) =>
                <div key={i} className="border-t border-gray-100 w-full" />
                )}
                </div>
              }

              {data.map((point, index) => {
                const heightPercentage = point.value / chartMax * 100;
                const isHovered = hoveredIndex === index;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 relative z-10"
                    style={{
                      width: barWidth
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}>

                    <div className="relative w-full flex-1 flex items-end">
                      <motion.div
                        initial={{
                          height: 0
                        }}
                        animate={{
                          height: `${heightPercentage}%`
                        }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.08,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                        className="w-full rounded-t-lg cursor-pointer transition-all duration-200"
                        style={{
                          backgroundColor: isHovered ? color : `${color}cc`,
                          boxShadow: isHovered ?
                          `0 4px 12px ${color}40` :
                          'none'
                        }} />


                      {/* Tooltip */}
                      {isHovered &&
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 5
                        }}
                        animate={{
                          opacity: 1,
                          y: 0
                        }}
                        className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1.5 px-2.5 rounded-lg whitespace-nowrap z-20 shadow-lg">

                          <span className="font-semibold">
                            {formatValue(point.value)}
                          </span>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                        </motion.div>
                      }
                    </div>
                  </div>);

              })}
            </div>

            {/* X-axis labels */}
            <div className="h-10 flex justify-around items-start pt-2 px-2">
              {data.map((point, i) =>
              <span
                key={i}
                className={`text-[11px] font-medium transition-colors ${hoveredIndex === i ? 'text-gray-900' : 'text-gray-400'}`}
                style={{
                  width: barWidth,
                  textAlign: 'center'
                }}>

                  {point.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>);

  }
  // Line chart
  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{
        height
      }}>

      {containerWidth > 0 &&
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${containerWidth} ${height}`}
        className="overflow-visible">

          <defs>
            <linearGradient
            id={`gradient-${color.replace('#', '')}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1">

              <stop offset="0%" stopColor={color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {showGrid &&
        yAxisValues.map((val, i) => {
          const y = getY(val);
          return (
            <g key={i}>
                  <line
                x1={padding.left}
                y1={y}
                x2={containerWidth - padding.right}
                y2={y}
                stroke="#f3f4f6"
                strokeWidth="1" />

                  <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] fill-gray-400 font-medium">

                    {val >= 1000 ? `$${val / 1000}k` : `$${val}`}
                  </text>
                </g>);

        })}

          {/* Area fill */}
          <motion.path
          d={areaPath}
          fill={`url(#gradient-${color.replace('#', '')})`}
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            duration: 0.8
          }} />


          {/* Line */}
          <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{
            pathLength: 0
          }}
          animate={{
            pathLength: 1
          }}
          transition={{
            duration: 1.2,
            ease: 'easeOut'
          }} />


          {/* Data points and labels */}
          {data.map((point, i) => {
          const x = getX(i);
          const y = getY(point.value);
          const isHovered = hoveredIndex === i;
          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer">

                {/* Hover area */}
                <rect
                x={x - 20}
                y={padding.top}
                width={40}
                height={chartHeight}
                fill="transparent" />


                {/* Vertical hover line */}
                {isHovered &&
              <motion.line
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                x1={x}
                y1={padding.top}
                x2={x}
                y2={padding.top + chartHeight}
                stroke={color}
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.3" />

              }

                {/* Point */}
                <motion.circle
                cx={x}
                cy={y}
                r={isHovered ? 6 : 4}
                fill="white"
                stroke={color}
                strokeWidth={isHovered ? 3 : 2}
                initial={{
                  scale: 0
                }}
                animate={{
                  scale: 1
                }}
                transition={{
                  delay: 0.8 + i * 0.1,
                  type: 'spring',
                  stiffness: 300
                }}
                style={{
                  filter: isHovered ?
                  `drop-shadow(0 2px 4px ${color}40)` :
                  'none'
                }} />


                {/* Tooltip */}
                {isHovered &&
              <motion.g
                initial={{
                  opacity: 0,
                  y: 5
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}>

                    <rect
                  x={x - 35}
                  y={y - 38}
                  width={70}
                  height={28}
                  rx={6}
                  fill="#111827" />

                    <polygon
                  points={`${x - 5},${y - 10} ${x + 5},${y - 10} ${x},${y - 5}`}
                  fill="#111827" />

                    <text
                  x={x}
                  y={y - 20}
                  textAnchor="middle"
                  className="text-[11px] fill-white font-semibold">

                      ${(point.value / 1000).toFixed(0)}k
                    </text>
                  </motion.g>
              }

                {/* X-axis label */}
                <text
                x={x}
                y={height - 10}
                textAnchor="middle"
                className={`text-[11px] font-medium transition-colors ${isHovered ? 'fill-gray-900' : 'fill-gray-400'}`}>

                  {point.label}
                </text>
              </g>);

        })}
        </svg>
      }
    </div>);

}