// ---- Deterministic mock data for the shop dashboard ----

const customers = [
  "Priya Nair", "Rohan Mehta", "Aisha Khan", "David Coelho", "Sofia Fernandes",
  "Arjun Batra", "Meera Iyer", "Karan Sethi", "Neha Kapoor", "Vikram Rao",
  "Ananya Ghosh", "Farhan Ali", "Ritika Malhotra", "Sanjay Menon", "Divya Pillai",
  "Omar Sheikh", "Tanvi Desai", "Kabir Chawla", "Lakshmi Subramaniam", "Yusuf Ansari",
];

const vehicles = [
  "Honda City 2021", "Maruti Swift 2019", "Hyundai Creta 2022", "Toyota Innova 2020",
  "Tata Nexon 2023", "Mahindra XUV700 2022", "Kia Seltos 2021", "Honda Activa 2020",
  "Royal Enfield Classic 350", "Ford EcoSport 2018", "Volkswagen Polo 2019",
  "Skoda Slavia 2023", "Toyota Fortuner 2021", "Maruti Baleno 2022", "Hyundai i20 2020",
];

const services = [
  "Oil Change", "Brake Inspection", "Tyre Rotation", "AC Service", "Battery Replacement",
  "Wheel Alignment", "Full Service", "Engine Diagnostics", "Clutch Repair", "Denting & Painting",
  "Suspension Check", "Car Wash & Detailing",
];

const serviceCategory = {
  "Oil Change": "Maintenance", "Full Service": "Maintenance", "Tyre Rotation": "Maintenance",
  "Wheel Alignment": "Maintenance", "Car Wash & Detailing": "Cosmetic",
  "Denting & Painting": "Cosmetic", "Brake Inspection": "Safety", "Suspension Check": "Safety",
  "AC Service": "Comfort", "Battery Replacement": "Electrical", "Engine Diagnostics": "Diagnostics",
  "Clutch Repair": "Repair",
};

const servicePrice = {
  "Oil Change": 1400, "Brake Inspection": 900, "Tyre Rotation": 600, "AC Service": 2200,
  "Battery Replacement": 4500, "Wheel Alignment": 1100, "Full Service": 6500,
  "Engine Diagnostics": 1800, "Clutch Repair": 8200, "Denting & Painting": 12000,
  "Suspension Check": 1500, "Car Wash & Detailing": 800,
};

export const mechanics = [
  { id: "MEC-01", name: "Rajesh Kumar", specialty: "Engine & Diagnostics", status: "On Duty" },
  { id: "MEC-02", name: "Suresh Yadav", specialty: "Brakes & Suspension", status: "On Duty" },
  { id: "MEC-03", name: "Imran Sheikh", specialty: "Electrical", status: "Busy" },
  { id: "MEC-04", name: "Manoj Tiwari", specialty: "Bodywork & Paint", status: "On Duty" },
  { id: "MEC-05", name: "Vishal Prajapati", specialty: "General Service", status: "Off Duty" },
  { id: "MEC-06", name: "Deepak Nair", specialty: "Tyres & Alignment", status: "Busy" },
  { id: "MEC-07", name: "Ashok Pillai", specialty: "AC & Cooling", status: "On Duty" },
];

// simple seeded PRNG so the dataset is stable across reloads
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

const statuses = ["Completed", "Pending", "In Progress", "Cancelled"];
const statusWeights = [0.52, 0.18, 0.16, 0.14];
function weightedStatus() {
  const r = rand();
  let acc = 0;
  for (let i = 0; i < statuses.length; i++) {
    acc += statusWeights[i];
    if (r <= acc) return statuses[i];
  }
  return statuses[statuses.length - 1];
}

const today = new Date("2026-09-02T09:00:00");

function daysAgo(n) {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  d.setHours(8 + Math.floor(rand() * 10), Math.floor(rand() * 60), 0, 0);
  return d;
}

export const bookings = Array.from({ length: 180 }, (_, i) => {
  const service = pick(services);
  const dayOffset = Math.floor(rand() * 60); // last 60 days
  const date = dayOffset === 0 && i % 7 === 0 ? new Date(today) : daysAgo(dayOffset);
  const status = dayOffset === 0 ? pick(["Pending", "In Progress", "Completed"]) : weightedStatus();
  const mechanic = pick(mechanics);
  const basePrice = servicePrice[service];
  const amount = Math.round((basePrice + (rand() - 0.3) * basePrice * 0.25) / 10) * 10;

  return {
    id: `BK-${String(1000 + i)}`,
    customer: pick(customers),
    vehicle: pick(vehicles),
    service,
    category: serviceCategory[service],
    mechanic: mechanic.name,
    mechanicId: mechanic.id,
    status,
    amount: status === "Cancelled" ? 0 : amount,
    date,
  };
}).sort((a, b) => b.date - a.date);

// ---- Derived aggregates ----

export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export const stats = (() => {
  const totalBookings = bookings.length;
  const todaysBookings = bookings.filter((b) => isSameDay(b.date, today)).length;
  const completed = bookings.filter((b) => b.status === "Completed").length;
  const pending = bookings.filter((b) => b.status === "Pending" || b.status === "In Progress").length;
  const cancelled = bookings.filter((b) => b.status === "Cancelled").length;
  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const activeMechanics = mechanics.filter((m) => m.status !== "Off Duty").length;

  // "new customers" this month = unique customers whose first-ever booking (in this dataset) is within last 30 days
  const firstSeen = new Map();
  [...bookings].sort((a, b) => a.date - b.date).forEach((b) => {
    if (!firstSeen.has(b.customer)) firstSeen.set(b.customer, b.date);
  });
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - 30);
  const newCustomers = [...firstSeen.values()].filter((d) => d >= cutoff).length;

  return {
    totalBookings,
    todaysBookings,
    completed,
    pending,
    cancelled,
    totalRevenue,
    activeMechanics,
    totalMechanics: mechanics.length,
    newCustomers,
  };
})();

export const bookingsOverTime = (() => {
  const days = 30;
  const buckets = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    return { date: d, label: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), count: 0, revenue: 0 };
  });
  bookings.forEach((b) => {
    const diff = Math.floor((today - b.date) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff < days) {
      const idx = days - 1 - diff;
      buckets[idx].count += 1;
      buckets[idx].revenue += b.amount;
    }
  });
  return buckets;
})();

export const statusBreakdown = statuses.map((s) => ({
  name: s,
  value: bookings.filter((b) => b.status === s).length,
}));

export const categoryBreakdown = (() => {
  const map = new Map();
  bookings.forEach((b) => {
    map.set(b.category, (map.get(b.category) || 0) + 1);
  });
  return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
})();

export const mechanicStats = mechanics.map((m) => {
  const jobs = bookings.filter((b) => b.mechanicId === m.id);
  const completedJobs = jobs.filter((b) => b.status === "Completed").length;
  const sorted = [...jobs].sort((a, b) => b.date - a.date);
  const currentOrLast = sorted.find((b) => b.status === "In Progress" || b.status === "Pending") || sorted[0];
  return {
    ...m,
    jobsCompleted: completedJobs,
    currentBooking: currentOrLast || null,
  };
});

export const today_ = today;
