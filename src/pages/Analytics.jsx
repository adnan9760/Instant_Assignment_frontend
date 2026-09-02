import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import PageHeader from "../components/PageHeader";

const currency = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(n || 0);

const STATUS_COLORS = {
  Completed: "#3F7D5C",
  completed: "#3F7D5C",

  Pending: "#B8842B",
  pending: "#B8842B",

  "In Progress": "#3E6E8E",
  "in-progress": "#3E6E8E",

  Cancelled: "#B54338",
  cancelled: "#B54338",

  Confirmed: "#565C64",
  confirmed: "#565C64",
};

const CATEGORY_COLORS = [
  "#F2A73B",
  "#3E6E8E",
  "#3F7D5C",
  "#B54338",
  "#8B6BAE",
  "#565C64",
];

function ChartCard({
  title,
  sub,
  children,
  className = "",
}) {
  return (
    <div
      className={`bg-panel border border-border p-5 ${className}`}
    >
      <div className="mb-4">
        <h3 className="font-head font-bold text-sm uppercase tracking-wide text-ink">
          {title}
        </h3>

        {sub && (
          <p className="text-xs text-ink-soft mt-0.5">
            {sub}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

const tooltipStyle = {
  background: "#20242A",
  border: "none",
  borderRadius: 0,
  color: "#F2EFE7",
  fontSize: 12,
  fontFamily: "Inter, sans-serif",
  padding: "8px 12px",
};

function normalizeStatus(status) {
  if (!status) return "Unknown";

  return status
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/analytics"
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch analytics (${response.status})`
          );
        }

        const result = await response.json();

        console.log("Analytics API:", result);

        setAnalytics(result.data || result);
      } catch (err) {
        console.error("Analytics error:", err);

        setError(
          err.message || "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader
          eyebrow="ANALYTICS"
          title="Shop Analytics"
          description="Trends across bookings, revenue, job status, and service mix."
        />

        <div className="py-12 text-center text-ink-soft">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          eyebrow="ANALYTICS"
          title="Shop Analytics"
          description="Trends across bookings, revenue, job status, and service mix."
        />

        <div className="border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const bookingsOverTime =
    analytics.bookingsOverTime || [];

  const statusBreakdown =
    analytics.statusBreakdown || [];

  const categoryBreakdown =
    analytics.categoryBreakdown || [];

  return (
    <div>
      <PageHeader
        eyebrow="ANALYTICS"
        title="Shop Analytics"
        description="Trends across bookings, revenue, job status, and service mix over the last 30 days."
      />

      {/* ================= BOOKINGS + REVENUE ================= */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        {/* Bookings */}
        <ChartCard
          title="Bookings Over Time"
          sub="Daily booking volume, last 30 days"
        >
          <ResponsiveContainer
            width="100%"
            height={260}
          >
            <AreaChart
              data={bookingsOverTime}
              margin={{
                left: -20,
                right: 10,
              }}
            >
              <defs>
                <linearGradient
                  id="bookingsFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#3E6E8E"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="100%"
                    stopColor="#3E6E8E"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#D9D3C3"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                tick={{
                  fontSize: 11,
                  fill: "#565C64",
                }}
                interval={4}
                axisLine={{
                  stroke: "#D9D3C3",
                }}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fontSize: 11,
                  fill: "#565C64",
                }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />

              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{
                  color: "#F2A73B",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              />

              <Area
                type="monotone"
                dataKey="count"
                name="Bookings"
                stroke="#3E6E8E"
                strokeWidth={2}
                fill="url(#bookingsFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue */}
        <ChartCard
          title="Revenue Over Time"
          sub="Daily revenue, last 30 days"
        >
          <ResponsiveContainer
            width="100%"
            height={260}
          >
            <AreaChart
              data={bookingsOverTime}
              margin={{
                left: -10,
                right: 10,
              }}
            >
              <defs>
                <linearGradient
                  id="revenueFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#F2A73B"
                    stopOpacity={0.4}
                  />

                  <stop
                    offset="100%"
                    stopColor="#F2A73B"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#D9D3C3"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                tick={{
                  fontSize: 11,
                  fill: "#565C64",
                }}
                interval={4}
                axisLine={{
                  stroke: "#D9D3C3",
                }}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fontSize: 11,
                  fill: "#565C64",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={currency}
                width={54}
              />

              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{
                  color: "#F2A73B",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
                formatter={(value) =>
                  currency(value)
                }
              />

              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#C9822A"
                strokeWidth={2}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ================= STATUS + CATEGORY ================= */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Status */}
        <ChartCard
          title="Booking Status"
          sub="Share of all bookings by current status"
        >
          <ResponsiveContainer
            width="100%"
            height={280}
          >
            <PieChart>
              <Pie
                data={statusBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={2}
                stroke="#FFFFFF"
                strokeWidth={2}
              >
                {statusBreakdown.map(
                  (entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        STATUS_COLORS[
                          entry.name
                        ] || "#565C64"
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => [
                  value,
                  normalizeStatus(name),
                ]}
              />

              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="square"
                formatter={(value) => (
                  <span
                    style={{
                      color: "#20242A",
                      fontSize: 12,
                    }}
                  >
                    {normalizeStatus(value)}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Categories */}
        <ChartCard
          title="Service Category Breakdown"
          sub="Bookings grouped by service type"
        >
          <ResponsiveContainer
            width="100%"
            height={280}
          >
            <BarChart
              data={categoryBreakdown}
              layout="vertical"
              margin={{
                left: 10,
                right: 20,
              }}
            >
              <CartesianGrid
                stroke="#D9D3C3"
                horizontal={false}
              />

              <XAxis
                type="number"
                tick={{
                  fontSize: 11,
                  fill: "#565C64",
                }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />

              <YAxis
                type="category"
                dataKey="name"
                tick={{
                  fontSize: 12,
                  fill: "#20242A",
                  fontWeight: 500,
                }}
                axisLine={false}
                tickLine={false}
                width={100}
              />

              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{
                  fill: "#20242A0D",
                }}
              />

              <Bar
                dataKey="value"
                name="Bookings"
                radius={[0, 3, 3, 0]}
              >
                {categoryBreakdown.map(
                  (entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={
                        CATEGORY_COLORS[
                          index %
                            CATEGORY_COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}