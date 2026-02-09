"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { ProgressLog } from "@/lib/types";

// Compute colors in JS, not CSS variables
const CHART_COLORS = {
  primary: "#0d9668",
  blue: "#0ea5e9",
  yellow: "#eab308",
  muted: "#6b7280",
  grid: "#1e293b",
};

export function ProgressCharts({ logs }: { logs: ProgressLog[] }) {
  const chartData = logs.map((log) => ({
    date: new Date(log.logged_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    weight: log.weight_kg ? Number(log.weight_kg) : null,
    bodyFat: log.body_fat_pct ? Number(log.body_fat_pct) : null,
    energy: log.energy_level,
    sleep: log.sleep_hours ? Number(log.sleep_hours) : null,
    mood: log.mood,
  }));

  const weightData = chartData.filter((d) => d.weight !== null);
  const wellnessData = chartData.filter(
    (d) => d.energy !== null || d.mood !== null
  );
  const sleepData = chartData.filter((d) => d.sleep !== null);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Weight Trend */}
      {weightData.length > 0 && (
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-card-foreground">Weight Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weightData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_COLORS.grid}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
                  stroke={CHART_COLORS.grid}
                />
                <YAxis
                  domain={["dataMin - 2", "dataMax + 2"]}
                  tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
                  stroke={CHART_COLORS.grid}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS.primary, r: 4 }}
                  name="Weight (kg)"
                />
                {weightData.some((d) => d.bodyFat !== null) && (
                  <Line
                    type="monotone"
                    dataKey="bodyFat"
                    stroke={CHART_COLORS.yellow}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS.yellow, r: 4 }}
                    name="Body Fat %"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Energy & Mood */}
      {wellnessData.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Energy & Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={wellnessData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_COLORS.grid}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
                  stroke={CHART_COLORS.grid}
                />
                <YAxis
                  domain={[0, 5]}
                  tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
                  stroke={CHART_COLORS.grid}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                  }}
                />
                <Bar
                  dataKey="energy"
                  fill={CHART_COLORS.primary}
                  radius={[4, 4, 0, 0]}
                  name="Energy"
                />
                <Bar
                  dataKey="mood"
                  fill={CHART_COLORS.blue}
                  radius={[4, 4, 0, 0]}
                  name="Mood"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Sleep */}
      {sleepData.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Sleep Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sleepData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_COLORS.grid}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
                  stroke={CHART_COLORS.grid}
                />
                <YAxis
                  domain={[0, 12]}
                  tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
                  stroke={CHART_COLORS.grid}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                  }}
                />
                <Bar
                  dataKey="sleep"
                  fill={CHART_COLORS.blue}
                  radius={[4, 4, 0, 0]}
                  name="Sleep (hrs)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
