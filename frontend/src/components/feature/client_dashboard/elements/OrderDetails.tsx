import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  fetch_order_applicants,
  select_operator,
} from "@/services/client_service";
import type { Order, Applicant } from "@/services/client_service";

export default function OrderDetails({
  order,
  onBack,
}: {
  order: Order;
  onBack: () => void;
}) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadApplicants = async () => {
      setIsLoading(true);
      try {
        const data = await fetch_order_applicants(order.id);
        setApplicants(data);
      } catch (error) {
        console.error("Failed to load applicants", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (order.id) {
      loadApplicants();
    }
  }, [order.id]);

  const handleSelectOperator = async (operatorId: number) => {
    try {
      const result = await select_operator(order.id, operatorId);
      if (result.success) {
        window.alert("Operator został wybrany pomyślnie.");
        onBack();
      } else {
        window.alert(
          result.message || "Wystąpił błąd podczas wybierania operatora.",
        );
      }
    } catch (error) {
      console.error("Selection error", error);
      window.alert("Wystąpił niespodziewany błąd.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <i className="ri-arrow-left-line mr-2"></i>
          Powrót do listy
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{order.title}</h2>
            <p className="text-gray-600">{order.service}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Oczekuje wyboru
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">
              Szczegóły zlecenia
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <i className="ri-map-pin-line mr-2"></i>
                {order.location}
              </div>
              <div className="flex items-center text-gray-600">
                <i className="ri-calendar-line mr-2"></i>
                {order.deadlineType === "flight"
                  ? "Nalot do: "
                  : "Zakończenie do: "}
                {order.deadline}
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Opis</h4>
            <p className="text-sm text-gray-600">{order.description}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-4">
            Zgłoszenia operatorów ({applicants.length})
          </h4>
          {isLoading ? (
            <p>Ładowanie zgłoszeń...</p>
          ) : (
            <div className="space-y-4">
              {applicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-medium text-gray-800">
                        {applicant.name}
                      </h5>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <i className="ri-star-fill text-yellow-400 mr-1"></i>
                          {applicant.rating}
                        </div>
                        <span>{applicant.completedJobs} zleceń</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {applicant.description}
                  </p>

                  <div className="mb-4">
                    <h6 className="text-xs font-medium text-gray-700 mb-2">
                      Sprzęt:
                    </h6>
                    <div className="flex flex-wrap gap-2">
                      {applicant.equipment &&
                        applicant.equipment.map((item, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
                          >
                            {item}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleSelectOperator(applicant.id)}
                    >
                      Wybierz operatora
                    </Button>
                  </div>
                </div>
              ))}
              {applicants.length === 0 && (
                <p className="text-gray-500">
                  Brak zgłoszeń dla tego zlecenia.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
