'use client';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import type { TemperatureData } from '@/lib/data';

const chartConfig = {
  temperature: {
    label: 'Temperature',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

interface DataChartProps {
  data: TemperatureData[];
}

export function DataChart({ data }: DataChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTemperature" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={value => value}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={['dataMin - 10', 'dataMax + 10']}
          tickFormatter={value => `${value}°C`}
        />
        <Tooltip
          cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 2, strokeDasharray: '3 3' }}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="temperature"
          type="monotone"
          fill="url(#colorTemperature)"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
