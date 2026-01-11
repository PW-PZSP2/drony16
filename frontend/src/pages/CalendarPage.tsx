import { useState, useEffect } from "react";
import OrderCalendar from "../components/feature/calendar/OrderCalendar";
import { backendClient } from "../utils/backend_client";

interface CalendarOrder {
  order_id: number;
  deadline: string;
  name: string;
  status: string;
  service_id: number;
}

export default function CalendarPage() {
  const [orders, setOrders] = useState<CalendarOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response =
          await backendClient.get<CalendarOrder[]>("/calendars/orders");
        setOrders(response.data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching calendar orders:", err);
        setError(err.response?.data?.detail || "Nie udało się pobrać zleceń");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <p className="text-gray-600">Ładowanie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Kalendarz zleceń</h1>
          <p className="text-gray-600 mt-2">
            Przeglądaj terminy zleceń w kalendarzu
          </p>
        </div>

        <OrderCalendar orders={orders} />
      </div>
    </div>
  );
}
