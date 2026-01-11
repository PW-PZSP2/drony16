import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./OrderCalendar.css";

interface Order {
  order_id: number;
  name: string;
  deadline: string;
  status: string;
  service_id: number;
}

interface OrderCalendarProps {
  orders: Order[];
}

export default function OrderCalendar({ orders }: OrderCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Check if there are orders on a given date
  const hasOrdersOnDate = (date: Date) => {
    return orders.some((order) => {
      const orderDate = new Date(order.deadline);
      return (
        orderDate.getFullYear() === date.getFullYear() &&
        orderDate.getMonth() === date.getMonth() &&
        orderDate.getDate() === date.getDate()
      );
    });
  };

  // Get orders for the selected date
  const getOrdersForDate = (date: Date) => {
    return orders.filter((order) => {
      const orderDate = new Date(order.deadline);
      return (
        orderDate.getFullYear() === date.getFullYear() &&
        orderDate.getMonth() === date.getMonth() &&
        orderDate.getDate() === date.getDate()
      );
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Oczekujące",
      in_progress: "W trakcie",
      completed: "Ukończone",
      cancelled: "Anulowane",
      assigned: "Przypisane",
      interested: "Zainteresowany",
    };
    return statusMap[status] || status;
  };

  const selectedOrders = getOrdersForDate(selectedDate);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Kalendarz */}
      <div className="flex-1">
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          locale="pl-PL"
          tileClassName={({ date }) => {
            if (hasOrdersOnDate(date)) {
              return "has-orders";
            }
            return null;
          }}
        />
      </div>

      {/* Lista zleceń dla wybranej daty */}
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">
            Zlecenia na {selectedDate.toLocaleDateString("pl-PL")}
          </h2>

          {selectedOrders.length === 0 ? (
            <p className="text-gray-500 italic">Brak zleceń w tym dniu</p>
          ) : (
            <div className="space-y-3">
              {selectedOrders.map((order) => (
                <div
                  key={order.order_id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {order.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Deadline:{" "}
                        {new Date(order.deadline).toLocaleDateString("pl-PL")}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "in_progress" ||
                              order.status === "assigned"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
