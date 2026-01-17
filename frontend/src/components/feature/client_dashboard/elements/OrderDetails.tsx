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
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 font-medium">Ładowanie zgłoszeń operatorów...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {applicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-xl">
                          {applicant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 text-lg mb-1">
                          {applicant.name}
                        </h5>
                        <p className="text-sm text-gray-500">
                          Operator ID: #{applicant.id}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="ri-mail-line text-blue-600 text-sm"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Email</p>
                        <p className="text-sm text-gray-800">{applicant.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="ri-phone-line text-green-600 text-sm"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Telefon</p>
                        <p className="text-sm text-gray-800">{applicant.phone_number}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <i className="ri-map-pin-line text-red-600 text-sm"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Lokalizacja</p>
                        <p className="text-sm text-gray-800">{applicant.localisation}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <i className="ri-compass-line text-purple-600 text-sm"></i>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Zasięg działania</p>
                        <p className="text-sm text-gray-800">{applicant.area} km</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <i className="ri-shield-check-line mr-1"></i>
                        Dostępny
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <i className="ri-user-line mr-1"></i>
                        Operator
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSelectOperator(applicant.id)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <i className="ri-user-add-line mr-2"></i>
                      Wybierz operatora
                    </Button>
                  </div>
                </div>
              ))}
              {applicants.length === 0 && (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <i className="ri-user-search-line text-4xl text-gray-400"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Brak zgłoszeń</h3>
                  <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                    Nie ma jeszcze żadnych zgłoszeń od operatorów dla tego zlecenia. Operatorzy mogą zgłaszać się w każdej chwili.
                  </p>
                  <div className="mt-6">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                      <i className="ri-time-line mr-2"></i>
                      Oczekiwanie na zgłoszenia
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
