import { useState } from "react";

import { Button } from "@/components/ui/button";
import RatingModal from "@/components/feature/client_dashboard/elements/RatingModal";
import { useLoadData } from "@/hooks/useLoadData";
import { fetch_completed_orders } from "@/services/client_service";
import { Star, X } from "lucide-react";

export default function CompletedOrdersTab() {
  const [showRatingModal, setShowRatingModal] = useState<number | null>(null);

  const { isLoading, data, error } = useLoadData({
    fetchFn: fetch_completed_orders,
  });

  return (
    <>
      {isLoading && <p>Ładowanie zakończonych zleceń...</p>}
      {error && (
        <p className="text-red-600">Błąd ładowania zleceń: {error.message}</p>
      )}
      {data && (
        <div className="space-y-4">
          {data.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {order.title}
                  </h3>
                  <p className="text-sm text-gray-600">{order.service}</p>
                  <p className="text-sm text-gray-500">
                    Wykonane przez: {order.selectedOperator}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "W trakcie"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {order.status === "W trakcie" ? "W trakcie" : "Zakończone"}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <i className="ri-map-pin-line mr-2"></i>
                  {order.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="ri-calendar-check-line mr-2"></i>
                  {order.status === "W trakcie"
                    ? `Deadline: ${order.deadline}`
                    : order.completedDate}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {order.rating && order.rating > 0 ? (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">
                        Twoja ocena:
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className="text-yellow-400"
                            fill={
                              order.rating && star <= order.rating
                                ? "currentColor"
                                : "none"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-orange-600">
                      Oczekuje na ocenę
                    </span>
                  )}
                </div>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    onClick={() => setShowRatingModal(order.id)}
                    disabled={Boolean(order.rating && order.rating > 0)}
                  >
                    Oceń pracę
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {showRatingModal && (
            <RatingModal
              orderId={showRatingModal}
              onClose={() => setShowRatingModal(null)}
            />
          )}
        </div>
      )}
    </>
  );
}
