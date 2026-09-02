import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Overview from "./pages/Overview";
import Analytics from "./pages/Analytics";
import Bookings from "./pages/Bookings";
import Mechanics from "./pages/Mechanics";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col md:flex-row bg-canvas">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 md:px-8 py-6 md:py-8">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/mechanics" element={<Mechanics />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
