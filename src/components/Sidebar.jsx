import { LayoutGrid, LineChart, ClipboardList, Wrench, Gauge } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Overview", icon: LayoutGrid },
  { to: "/analytics", label: "Analytics", icon: LineChart },
  { to: "/bookings", label: "Bookings", icon: ClipboardList },
  { to: "/mechanics", label: "Mechanics", icon: Wrench },
];

export default function Sidebar() {
  return (
    <aside className="w-full md:w-60 shrink-0 bg-charcoal text-white flex md:flex-col md:h-screen md:sticky md:top-0">
      <div className="hidden md:flex items-center gap-2.5 px-6 py-6 border-b border-border-dark">
        <div className="w-8 h-8 bg-amber flex items-center justify-center">
          <Gauge className="w-5 h-5 text-charcoal" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <div className="font-display font-extrabold text-lg tracking-tight">TORQUE</div>
          <div className="font-mono text-[10px] text-amber tracking-widest">SHOP OPS</div>
        </div>
      </div>

      <nav className="flex md:flex-col w-full md:py-4 md:px-3 gap-1 overflow-x-auto md:overflow-visible">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 md:px-3 py-3.5 md:py-2.5 text-sm font-medium whitespace-nowrap border-l-2 md:border-l-2 transition-colors ${
                isActive
                  ? "bg-charcoal-soft text-white border-amber"
                  : "text-white/55 border-transparent hover:text-white hover:bg-charcoal-soft/60"
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="hidden md:block mt-auto px-6 py-5 border-t border-border-dark">
        <div className="font-mono text-[10px] text-white/40 leading-relaxed">
          BAY STATUS: <span className="text-good">OPERATIONAL</span><br />
          Rangewood Service Center
        </div>
      </div>
    </aside>
  );
}
