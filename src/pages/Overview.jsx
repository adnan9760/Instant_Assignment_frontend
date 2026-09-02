import { useEffect, useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  Hourglass,
  XCircle,
  IndianRupee,
  Users,
  Wrench,
  Activity,
} from "lucide-react";

import StatCard from "../components/StatCard";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

const currency = (n) =>
  n !== undefined && n !== null
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(n)
    : "—";

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return (
    <>
      {date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })}
      {" · "}
      {date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </>
  );
}

function formatStatus(status) {
  if (!status) return "—";

  return status
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export default function Overview() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/dashboard"
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch dashboard (${response.status})`
          );
        }

        const result = await response.json();

        console.log("Dashboard API:", result);

        setDashboard(result.data || result);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(
          err.message || "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader
          eyebrow="DASHBOARD"
          title="Overview"
          description="Shop-wide performance at a glance."
        />

        <div className="py-12 text-center text-ink-soft">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          eyebrow="DASHBOARD"
          title="Overview"
          description="Shop-wide performance at a glance."
        />

        <div className="border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const stats = dashboard.stats || {};
  const bookingStatus = dashboard.bookingStatus || {};
  const recent = dashboard.recentBookings || [];

  return (
    <div>
      {/* Header */}
      <PageHeader
        eyebrow="DASHBOARD"
        title="Overview"
        description="Shop-wide performance at a glance — updated as jobs move through the bay."
      />

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <StatCard
          label="Total Bookings"
          value={stats.totalBookings ?? 0}
          icon={ClipboardList}
          accent="ink"
        />

        <StatCard
          label="Completed"
          value={stats.completedBookings ?? 0}
          icon={CheckCircle2}
          accent="good"
        />

        <StatCard
          label="Pending"
          value={stats.pendingBookings ?? 0}
          icon={Hourglass}
          accent="pending"
        />

        <StatCard
          label="Cancelled"
          value={bookingStatus.cancelled ?? 0}
          icon={XCircle}
          accent="bad"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Total Revenue"
          value={currency(stats.totalRevenue)}
          icon={IndianRupee}
          accent="amber"
        />

        <StatCard
          label="Customers"
          value={stats.totalCustomers ?? 0}
          icon={Users}
          accent="steel"
        />

        <StatCard
          label="Mechanics"
          value={stats.totalMechanics ?? 0}
          icon={Wrench}
          accent="steel"
        />

        <StatCard
          label="In Progress"
          value={bookingStatus["in-progress"] ?? 0}
          icon={Activity}
          accent="steel"
        />
      </div>

      {/* ================= BOOKING STATUS ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-8">
        {Object.entries(bookingStatus).map(
          ([status, count]) => (
            <div
              key={status}
              className="bg-panel border border-border p-4"
            >
              <div className="text-[11px] uppercase tracking-wide font-semibold text-ink-soft mb-2">
                {formatStatus(status)}
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="font-display font-extrabold text-2xl text-ink">
                  {count}
                </div>

                <StatusBadge
                  status={status}
                />
              </div>
            </div>
          )
        )}
      </div>

      {/* ================= RECENT BOOKINGS ================= */}

      <div className="bg-panel border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-head font-bold text-sm uppercase tracking-wide text-ink">
              Latest Activity
            </h2>

            <p className="text-xs text-ink-soft mt-1">
              Most recent service bookings
            </p>
          </div>

          <span className="font-mono text-[11px] text-ink-soft">
            {recent.length} recent
          </span>
        </div>

        <div className="divide-y divide-border">
          {recent.map((b) => (
            <div
              key={b._id}
              className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-canvas/60"
            >
              {/* Left */}
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-mono text-xs text-ink-soft w-20 shrink-0">
                  {b.bookingNumber}
                </span>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink truncate">
                    {b.customer?.name || "Unknown Customer"}
                  </div>

                  <div className="text-xs text-ink-soft truncate">
                    {b.service || "Service"} ·{" "}
                    {b.vehicle?.brand}{" "}
                    {b.vehicle?.model}
                  </div>

                  <div className="text-[10px] text-ink-soft mt-1">
                    {b.mechanic?.name
                      ? `Mechanic: ${b.mechanic.name}`
                      : "Mechanic not assigned"}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-5 shrink-0">
                <span className="text-xs text-ink-soft hidden md:block">
                  {formatDate(b.scheduledAt)}
                </span>

                <span className="font-mono text-sm font-semibold text-ink w-20 text-right hidden sm:block">
                  {currency(b.amount)}
                </span>

                <StatusBadge status={b.status} />
              </div>
            </div>
          ))}

          {recent.length === 0 && (
            <div className="text-center py-12 text-ink-soft text-sm">
              No recent bookings found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}