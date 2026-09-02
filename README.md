# Torque — Shop Operations Dashboard

A React + Vite dashboard for a vehicle service/mechanic shop: overview stats, analytics charts, a searchable/filterable/sortable bookings table, and a mechanics roster. Built with React Router, Tailwind CSS v4, and Recharts. Data is mocked locally in `src/data/mockData.js` — swap it for real API calls when you're ready.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

I can't push to your Vercel account for you (no access to your account), but either of these gets you live in under a minute:

### Option A — Vercel CLI (fastest)
```bash
npm i -g vercel
cd mechanic-dashboard
vercel        # first deploy, follow the prompts
vercel --prod # promote to production
```
Vercel auto-detects Vite. Framework preset: **Vite**, Build command: `npm run build`, Output directory: `dist`.

### Option B — GitHub + Vercel dashboard
1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com/new and import the repo.
3. Vercel auto-detects the Vite settings above — just click **Deploy**.

`vercel.json` is already included so client-side routing (`/analytics`, `/bookings`, `/mechanics`) works correctly on refresh/direct links.

## Project structure

```
src/
  data/mockData.js       seeded mock dataset (bookings, mechanics, aggregates)
  components/            Sidebar, StatCard, StatusBadge, BookingsTable, PageHeader
  pages/                 Overview, Analytics, Bookings, Mechanics
  App.jsx                routes + layout
```

## Wiring up a real backend

Replace the exports in `src/data/mockData.js` with fetch calls (e.g. React Query) to your API. The pages already consume plain arrays/objects (`bookings`, `mechanics`, `stats`, `bookingsOverTime`, `statusBreakdown`, `categoryBreakdown`), so as long as your API returns the same shapes, no component code needs to change.
