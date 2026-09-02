import { useMemo, useState } from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

const currency = (n) =>
  n !== undefined && n !== null
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(n)
    : "—";

const columns = [
  { key: "bookingNumber", label: "Booking ID" },
  { key: "customer", label: "Customer" },
  { key: "vehicle", label: "Vehicle" },
  { key: "service", label: "Service" },
  { key: "mechanic", label: "Mechanic" },
  { key: "status", label: "Status" },
  { key: "amount", label: "Amount" },
  { key: "scheduledAt", label: "Date / Time" },
];

const PAGE_SIZES = [10, 25, 50];

const STATUS_OPTIONS = [
  "All",
  "Completed",
  "Pending",
  "In Progress",
  "Cancelled",
];

export default function BookingsTable({ bookings = [] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [mechanicFilter, setMechanicFilter] = useState("All");
  const [sortKey, setSortKey] = useState("scheduledAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /*
   * Convert API response into values that are easy
   * to search/filter/sort.
   */
  const normalizedBookings = useMemo(() => {
    return bookings.map((b) => ({
      ...b,

      // Booking
      id: b._id,
      bookingNumber: b.bookingNumber || "—",

      // Customer
      customerName: b.customer?.name || "—",
      customerEmail: b.customer?.email || "—",
      customerPhone: b.customer?.phone || "—",

      // Vehicle
      vehicleName: b.vehicle
        ? `${b.vehicle.brand || ""} ${b.vehicle.model || ""}`.trim()
        : "—",

      registrationNumber: b.vehicle?.registrationNumber || "—",
      vehicleYear: b.vehicle?.year || "—",

      // Mechanic
      mechanicName: b.mechanic?.name || "Unassigned",
      mechanicSpecialization: b.mechanic?.specialization || "—",

      // Date
      date: b.scheduledAt ? new Date(b.scheduledAt) : null,
    }));
  }, [bookings]);

  /*
   * Unique mechanics
   */
  const mechanicOptions = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(normalizedBookings.map((b) => b.mechanicName))
      ).sort(),
    ],
    [normalizedBookings]
  );

  /*
   * Search + filters
   */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return normalizedBookings.filter((b) => {
      const matchesQuery =
        !q ||
        b.bookingNumber.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerEmail.toLowerCase().includes(q) ||
        b.customerPhone.toLowerCase().includes(q) ||
        b.vehicleName.toLowerCase().includes(q) ||
        b.registrationNumber.toLowerCase().includes(q) ||
        b.service?.toLowerCase().includes(q) ||
        b.mechanicName.toLowerCase().includes(q);

      const normalizedStatus =
        b.status?.toLowerCase() || "";

      const matchesStatus =
        statusFilter === "All" ||
        normalizedStatus === statusFilter.toLowerCase();

      const matchesMechanic =
        mechanicFilter === "All" ||
        b.mechanicName === mechanicFilter;

      return (
        matchesQuery &&
        matchesStatus &&
        matchesMechanic
      );
    });
  }, [
    normalizedBookings,
    query,
    statusFilter,
    mechanicFilter,
  ]);

  /*
   * Sorting
   */
  const sorted = useMemo(() => {
    const arr = [...filtered];

    arr.sort((a, b) => {
      let av;
      let bv;

      switch (sortKey) {
        case "bookingNumber":
          av = a.bookingNumber;
          bv = b.bookingNumber;
          break;

        case "customer":
          av = a.customerName;
          bv = b.customerName;
          break;

        case "vehicle":
          av = a.vehicleName;
          bv = b.vehicleName;
          break;

        case "mechanic":
          av = a.mechanicName;
          bv = b.mechanicName;
          break;

        case "scheduledAt":
          av = a.date?.getTime() || 0;
          bv = b.date?.getTime() || 0;
          break;

        case "amount":
          av = a.amount || 0;
          bv = b.amount || 0;
          break;

        case "status":
          av = a.status || "";
          bv = b.status || "";
          break;

        default:
          av = a[sortKey];
          bv = b[sortKey];
      }

      if (typeof av === "string") {
        av = av.toLowerCase();
        bv = String(bv).toLowerCase();
      }

      if (av < bv) {
        return sortDir === "asc" ? -1 : 1;
      }

      if (av > bv) {
        return sortDir === "asc" ? 1 : -1;
      }

      return 0;
    });

    return arr;
  }, [filtered, sortKey, sortDir]);

  /*
   * Pagination
   */
  const totalPages = Math.max(
    1,
    Math.ceil(sorted.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  const pageRows = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /*
   * Sorting handler
   */
  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) =>
        d === "asc" ? "desc" : "asc"
      );
    } else {
      setSortKey(key);
      setSortDir("asc");
    }

    setPage(1);
  }

  /*
   * Reset page when filter/search changes
   */
  function resetPage(setter) {
    return (value) => {
      setter(value);
      setPage(1);
    };
  }

  /*
   * Format date
   */
  function formatDate(date) {
    if (!date || Number.isNaN(date.getTime())) {
      return "—";
    }

    return (
      <>
        <div>
          {date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>

        <div className="text-[11px] text-ink-soft">
          {date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </>
    );
  }

  return (
    <div className="bg-panel border border-border">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 px-5 py-4 border-b border-border">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            value={query}
            onChange={(e) =>
              resetPage(setQuery)(e.target.value)
            }
            placeholder="Search booking ID, customer, vehicle, service, mechanic…"
            className="w-full bg-canvas border border-border pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:border-steel"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-ink-soft hidden sm:block" />

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) =>
              resetPage(setStatusFilter)(e.target.value)
            }
            className="bg-canvas border border-border px-3 py-2 text-sm text-ink focus:outline-none focus:border-steel"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Statuses" : s}
              </option>
            ))}
          </select>

          {/* Mechanic */}
          <select
            value={mechanicFilter}
            onChange={(e) =>
              resetPage(setMechanicFilter)(e.target.value)
            }
            className="bg-canvas border border-border px-3 py-2 text-sm text-ink focus:outline-none focus:border-steel"
          >
            {mechanicOptions.map((m) => (
              <option key={m} value={m}>
                {m === "All" ? "All Mechanics" : m}
              </option>
            ))}
          </select>

          {/* Page Size */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="bg-canvas border border-border px-3 py-2 text-sm text-ink focus:outline-none focus:border-steel"
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[1000px]">
          <thead>
            <tr className="border-b border-border bg-canvas/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="text-left px-5 py-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft font-semibold cursor-pointer select-none hover:text-ink"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}

                    {sortKey === col.key &&
                      (sortDir === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {pageRows.map((b) => (
              <tr
                key={b._id}
                className="hover:bg-canvas/50"
              >
                {/* Booking ID */}
                <td className="px-5 py-3">
                  <div className="font-mono text-xs text-ink font-semibold">
                    {b.bookingNumber}
                  </div>

                  <div className="font-mono text-[10px] text-ink-soft mt-1">
                    {b._id}
                  </div>
                </td>

                {/* Customer */}
                <td className="px-5 py-3">
                  <div className="font-semibold text-ink whitespace-nowrap">
                    {b.customerName}
                  </div>

                  <div className="text-[11px] text-ink-soft mt-1">
                    {b.customerPhone}
                  </div>
                </td>

                {/* Vehicle */}
                <td className="px-5 py-3">
                  <div className="text-ink font-medium whitespace-nowrap">
                    {b.vehicleName}
                  </div>

                  <div className="font-mono text-[11px] text-ink-soft mt-1">
                    {b.registrationNumber}
                  </div>

                  <div className="text-[10px] text-ink-soft">
                    {b.vehicleYear}
                  </div>
                </td>

                {/* Service */}
                <td className="px-5 py-3 text-ink whitespace-nowrap">
                  {b.service || "—"}
                </td>

                {/* Mechanic */}
                <td className="px-5 py-3">
                  <div className="text-ink font-medium whitespace-nowrap">
                    {b.mechanicName}
                  </div>

                  <div className="text-[11px] text-ink-soft mt-1">
                    {b.mechanicSpecialization}
                  </div>
                </td>

                {/* Status */}
                <td className="px-5 py-3">
                  <StatusBadge status={b.status} />
                </td>

                {/* Amount */}
                <td className="px-5 py-3 font-mono text-ink whitespace-nowrap">
                  {currency(b.amount)}
                </td>

                {/* Date */}
                <td className="px-5 py-3 text-ink-soft whitespace-nowrap">
                  {formatDate(b.date)}
                </td>
              </tr>
            ))}

            {/* Empty */}
            {pageRows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-12 text-ink-soft text-sm"
                >
                  No bookings match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3.5 border-t border-border">
        <span className="text-xs text-ink-soft">
          Showing{" "}
          <span className="font-semibold text-ink">
            {pageRows.length
              ? (currentPage - 1) * pageSize + 1
              : 0}
            –
            {(currentPage - 1) * pageSize +
              pageRows.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-ink">
            {sorted.length}
          </span>
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setPage((p) => Math.max(1, p - 1))
            }
            disabled={currentPage === 1}
            className="p-1.5 border border-border disabled:opacity-30 hover:bg-canvas"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-mono text-xs text-ink-soft px-2">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() =>
              setPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
            disabled={currentPage === totalPages}
            className="p-1.5 border border-border disabled:opacity-30 hover:bg-canvas"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}