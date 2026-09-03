import { useEffect, useState } from "react";
import {
  Wrench,
  Star,
  Phone,
  Mail,
  BriefcaseBusiness,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Mechanics() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        setLoading(true);

        const response = await fetch("https://instantbackend.work.gd/api/mechanics/");

        if (!response.ok) {
          throw new Error("Failed to fetch mechanics");
        }

        const data = await response.json();
        setMechanics(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Mechanics API error:", err);
        setError(err.message || "Unable to load mechanics");
      } finally {
        setLoading(false);
      }
    };

    fetchMechanics();
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="TEAM"
        title="Mechanics"
        description="Bay staffing, technician experience, and mechanic availability."
      />

      {/* Loading */}
      {loading && (
        <div className="py-10 text-center text-ink-soft">
          Loading mechanics...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && mechanics.length === 0 && (
        <div className="py-10 text-center text-ink-soft">
          No mechanics found.
        </div>
      )}

      {/* Mechanics */}
      {!loading && !error && mechanics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {mechanics.map((m) => (
            <div
              key={m._id}
              className="bg-panel border border-border flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-charcoal text-white flex items-center justify-center font-head font-bold text-sm shrink-0">
                    {initials(m.name)}
                  </div>

                  <div className="min-w-0">
                    <div className="font-semibold text-ink truncate">
                      {m.name}
                    </div>

                    <div className="text-xs text-ink-soft truncate">
                      {m.specialization || "General Mechanic"}
                    </div>
                  </div>
                </div>

                <StatusBadge status={m.status} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
                <div className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-ink-soft text-[11px] uppercase tracking-wide font-semibold mb-1">
                    <BriefcaseBusiness className="w-3.5 h-3.5" />
                    Experience
                  </div>

                  <div className="font-display font-extrabold text-2xl text-ink">
                    {m.experience ?? 0}
                    <span className="text-sm font-semibold ml-1">
                      yrs
                    </span>
                  </div>
                </div>

                <div className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-ink-soft text-[11px] uppercase tracking-wide font-semibold mb-1">
                    <Star className="w-3.5 h-3.5" />
                    Rating
                  </div>

                  <div className="font-display font-extrabold text-2xl text-ink">
                    {m.rating ?? "—"}
                  </div>
                </div>
              </div>

              {/* Mechanic Information */}
              <div className="px-5 py-4 flex-1">
                <div className="text-[11px] uppercase tracking-wide font-semibold text-ink-soft mb-3">
                  Mechanic Information
                </div>

                <div className="space-y-3">
                  {/* ID */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-ink-soft">
                      Mechanic ID
                    </span>

                    <span className="font-mono text-xs text-ink">
                      {m._id}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-ink-soft" />

                    <span className="text-xs text-ink truncate">
                      {m.email || "—"}
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-ink-soft" />

                    <span className="text-xs text-ink">
                      {m.phone || "—"}
                    </span>
                  </div>

                  {/* Specialization */}
                  <div className="flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-ink-soft" />

                    <span className="text-xs text-ink">
                      Specialization:{" "}
                      <span className="font-semibold">
                        {m.specialization || "General"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
