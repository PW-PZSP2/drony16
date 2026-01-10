import { useState, useEffect } from "react";
import OrderCalendar from "../components/feature/calendar/OrderCalendar";

// TODO: Replace mock data with API data
const mockOrders = [
  {
    id: 1,
    title: "Dostawa paczki - Warszawa Centrum",
    deadline: new Date(2026, 0, 15, 14, 30),
    status: "pending",
  },
  {
    id: 2,
    title: "Transport materiałów - Mokotów",
    deadline: new Date(2026, 0, 15, 16, 0),
    status: "in_progress",
  },
  {
    id: 3,
    title: "Dostawa dokumentów - Wilanów",
    deadline: new Date(2026, 0, 18, 10, 0),
    status: "pending",
  },
  {
    id: 4,
    title: "Inspekcja drona - Serwis",
    deadline: new Date(2026, 0, 20, 12, 0),
    status: "completed",
  },
];

export default function CalendarPage() {
  const [orders, setOrders] = useState(mockOrders);

  // TODO: Add fetching real data from the backend
  // useEffect(() => {
  //   fetch('/api/orders')
  //     .then(res => res.json())
  //     .then(data => setOrders(data));
  // }, []);

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
