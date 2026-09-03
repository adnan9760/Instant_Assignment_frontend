import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import BookingsTable from "../components/BookingsTable";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://instantbackend.work.gd/api/bookings"
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();

        console.log("Bookings API response:", result);

        // If API returns an array
        if (Array.isArray(result)) {
          setBookings(result);
        }
        // If API returns { data: [...] }
        else if (Array.isArray(result.data)) {
          setBookings(result.data);
        }
        // If API returns { bookings: [...] }
        else if (Array.isArray(result.bookings)) {
          setBookings(result.bookings);
        } else {
          throw new Error("Invalid bookings API response");
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError(err.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="OPERATIONS"
        title="Bookings"
        description="Manage service bookings, customers, vehicles, mechanics, and scheduled work."
      />

      {loading && (
        <div className="py-10 text-center text-ink-soft">
          Loading bookings...
        </div>
      )}

      {error && (
        <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <BookingsTable bookings={bookings} />
      )}
    </div>
  );
}
