import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const CHART_CLASS =
  "my-2 h-[440px] w-full [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-neutral-500/10 dark:[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-white/10";

type BaseProps = {
  data: Record<string, string | number>[];
  dataKey: string;
  tooltip: React.ComponentProps<typeof ChartTooltip>["content"];
  yAxisWidth?: number;
  className?: string;
  /** Set to false for charts of whole numbers like member counts */
  allowDecimals?: boolean;
  /** Fixed range for the value axis, e.g. [0, 3]. Recharts picks a rounded range by default */
  valueDomain?: [number, number];
};

type ColumnsProps = BaseProps & {
  orientation?: "columns";
  yAxisFormatter?: (v: number) => string;
};

type BarsProps = BaseProps & {
  orientation: "bars";
  xAxisFormatter?: (v: number) => string;
};

type AppBarChartProps = ColumnsProps | BarsProps;

export const AppBarChart = (props: AppBarChartProps) => {
  const { data, dataKey, tooltip, className } = props;
  const config = { [dataKey]: { label: dataKey } } satisfies ChartConfig;

  const bar = (
    <Bar
      dataKey={dataKey}
      fill="#d31f3c"
      isAnimationActive
      animationDuration={400}
      radius={4}
    />
  );

  if (props.orientation === "bars") {
    return (
      <ChartContainer config={config} className={cn(CHART_CLASS, className)}>
        <BarChart layout="vertical" data={data}>
          <CartesianGrid horizontal={false} />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickCount={6}
            tickFormatter={props.xAxisFormatter}
            allowDecimals={props.allowDecimals}
            domain={props.valueDomain}
            allowDataOverflow={props.valueDomain !== undefined}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={props.yAxisWidth ?? 100}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip content={tooltip} />
          {bar}
        </BarChart>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer config={config} className={cn(CHART_CLASS, className)}>
      <BarChart data={data} margin={{ bottom: 20 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          angle={-30}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tickCount={6}
          tickFormatter={props.yAxisFormatter}
          allowDecimals={props.allowDecimals}
          domain={props.valueDomain}
          allowDataOverflow={props.valueDomain !== undefined}
          width={props.yAxisWidth}
        />
        <ChartTooltip content={tooltip} />
        {bar}
      </BarChart>
    </ChartContainer>
  );
};
