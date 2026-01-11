import { useState } from "react";

import { Button } from "@/components/ui/button";
import OrderDetails from "@/components/feature/client_dashboard/elements/OrderDetails";
import { useLoadData } from "@/hooks/useLoadData";
import { fetch_current_orders } from "@/services/client_service";

export default function SelectOperatorTab() {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const { data, isLoading, error } = useLoadData({
    fetchFn: fetch_current_orders,
  });

  if (selectedOrder) {
    const order = data?.find((o) => o.id === selectedOrder);
    if (!order) return null;

    return (
      <OrderDetails
        order={order}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <>
      {error && (
        <div className="text-red-600">
          Błąd ładowania zleceń skontaktuj się z administratorem.
        </div>
      )}
      {isLoading && <div>Ładowanie zleceń...</div>}
      {data && (
        <div className="space-y-4">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Zlecenia oczekujące na wybór operatora
            </h3>
            <p className="text-gray-600">
              Wybierz najlepszego operatora spośród zgłoszeń do Twoich zleceń
            </p>
          </div>

          {data.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {order.title}
                  </h3>
                  <p className="text-sm text-gray-600">{order.service}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Oczekuje wyboru
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <i className="ri-map-pin-line mr-2"></i>
                  {order.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="ri-calendar-line mr-2"></i>
                  {order.deadlineType === "flight"
                    ? "Nalot do: "
                    : "Zakończenie do: "}
                  {order.deadline}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  <i className="ri-user-line mr-1"></i>
                  {order.applicants} zgłoszeń operatorów
                </span>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order.id)}
                  >
                    Zobacz szczegóły
                  </Button>
                  <Button size="sm" onClick={() => setSelectedOrder(order.id)}>
                    Wybierz operatora
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {data.length === 0 && (
            <div className="text-center py-12">
              <i className="ri-search-line text-4xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Brak zleceń oczekujących
              </h3>
              <p className="text-gray-500">
                Wszystkie Twoje zlecenia mają już wybranych operatorów lub nie
                mają jeszcze zgłoszeń.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
