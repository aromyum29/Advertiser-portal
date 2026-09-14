/**
 * The chart plots whichever metric card is selected, so the cards above it and
 * the curve below it can never disagree.
 */
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { compact } from "../../domain/format";
import type { MetricDefinition, PerformancePoint } from "../../domain/performance";

export function PerformanceChart({
  series,
  metric,
}: {
  series: readonly PerformancePoint[];
  metric: MetricDefinition;
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={[...series]} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="perfArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BDDCEE" stopOpacity={0.75} />
              <stop offset="100%" stopColor="#EDD8F8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            strokeOpacity={0.5}
            vertical={false}
          />
          <XAxis
            dataKey="label"
            stroke="#9ca3af"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={58}
            tickFormatter={(value: number) => compact(value)}
          />
          <Tooltip
            cursor={{ stroke: "#9CA8E8", strokeWidth: 1, strokeDasharray: "4 4" }}
            formatter={(value: number | string) => [metric.format(Number(value)), metric.axis]}
            contentStyle={{
              background: "var(--popover)",
              color: "var(--popover-foreground)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              fontSize: 13,
            }}
          />
          <Area
            type="monotone"
            dataKey={metric.key}
            stroke="#7DB1D5"
            strokeWidth={2}
            fill="url(#perfArea)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Per-booking detail: visits and orders on their own axes, over the run. */
export function BookingResultChart({
  series,
}: {
  series: readonly { label: string; visits: number; orders: number }[];
}) {
  return (
    <>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={[...series]} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="bookingArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#BDDCEE" stopOpacity={0.75} />
                <stop offset="100%" stopColor="#EDD8F8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              strokeOpacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              yAxisId="visits"
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={46}
              tickFormatter={(value: number) => compact(value)}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={34}
            />
            <Tooltip
              cursor={{ stroke: "#9CA8E8", strokeWidth: 1, strokeDasharray: "4 4" }}
              formatter={(value: number | string, name: string) => [
                Number(value).toLocaleString("en-US"),
                name === "visits" ? "Store visits" : "Orders",
              ]}
              contentStyle={{
                background: "var(--popover)",
                color: "var(--popover-foreground)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                fontSize: 13,
              }}
            />
            <Area
              yAxisId="visits"
              type="monotone"
              dataKey="visits"
              stroke="#7DB1D5"
              strokeWidth={2}
              fill="url(#bookingArea)"
              dot={false}
              isAnimationActive={false}
            />
            <Area
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              stroke="#0f7b3d"
              strokeWidth={2}
              fill="none"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center gap-5">
        <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#7DB1D5]" />
          Store visits
        </span>
        <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#0f7b3d]" />
          Orders
        </span>
      </div>
    </>
  );
}
