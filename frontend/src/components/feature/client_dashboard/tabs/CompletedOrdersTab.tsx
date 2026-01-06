import { useState } from "react";

import { Button } from "@/components/ui/button";
import RatingModal from "@/components/feature/client_dashboard/elements/RatingModal";

export default function CompletedOrdersTab() {
  const [showRatingModal, setShowRatingModal] = useState<number | null>(null);

  const completedOrders = [
    {
      id: 3,
      title: "Inspekcja dachu",
      service: "Inspekcje",
      location: "Gdańsk, ul. Morska 67",
      completedDate: "2024-01-15",
      operator: "SkyTech Drones",
      rating: 0,
    },
    {
      id: 4,
      title: "Chmura punktów terenu",
      service: "Chmura punktów",
      location: "Wrocław, ul. Polna 89",
      completedDate: "2024-01-10",
      operator: "AerialPro",
      rating: 5,
    },
  ];

  return (
    <div className="space-y-4">
      {completedOrders.map((order) => (
        <div key={order.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {order.title}
              </h3>
              <p className="text-sm text-gray-600">{order.service}</p>
              <p className="text-sm text-gray-500">
                Wykonane przez: {order.operator}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Zakończone
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <i className="ri-map-pin-line mr-2"></i>
              {order.location}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <i className="ri-calendar-check-line mr-2"></i>
              {order.completedDate}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {order.rating > 0 ? (
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">
                    Twoja ocena:
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`ri-star-${star <= order.rating ? "fill" : "line"} text-yellow-400`}
                      ></i>
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
              {order.rating === 0 && (
                <Button size="sm" onClick={() => setShowRatingModal(order.id)}>
                  Oceń pracę
                </Button>
              )}
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
  );
}
