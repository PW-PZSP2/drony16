import { useState } from "react";

import ServiceParameters from "@/components/feature/client_dashboard/elements/ServiceParameters";
import { create_order } from "@/services/client_service";
import type { OrderData } from "@/services/client_service";

import { Button } from "@/components/ui/button";

export default function CreateOrderTab() {
  const [formData, setFormData] = useState({
    title: "",
    service: "",
    description: "",
    location: "",
    deadlineType: "flight", // 'flight' lub 'completion'
    deadline: "",
    parameters: {} as any,
  });

  const handleParametersChange = (newParameters: any) => {
    setFormData({ ...formData, parameters: newParameters });
  };

  // Reset parameters when service changes
  const handleServiceChange = (serviceId: string) => {
    setFormData({ ...formData, service: serviceId, parameters: {} });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    { id: "Ortofotomapa", name: "Ortofotomapa", icon: "ri-map-2-line" },
    {
      id: "Numeryczne Modele Terenu",
      name: "Numeryczne Modele Terenu",
      icon: "ri-landscape-line",
    },
    {
      id: "Chmura Punktów",
      name: "Chmura Punktów",
      icon: "ri-bubble-chart-line",
    },
    { id: "Modele 3D", name: "Modele 3D", icon: "ri-3d-view-line" },
    {
      id: "Scanning Laserowy",
      name: "Scanning Laserowy",
      icon: "ri-scanner-line",
    },
    { id: "Film", name: "Film", icon: "ri-search-eye-line" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    create_order(formData as OrderData).then((response) => {
      setIsSubmitting(false);
      if (response.success) {
        alert(
          `Zlecen÷e zostało utworzone pomyślnie! ID zlecenia: ${response.orderId}`,
        );
      } else {
        alert(`Błąd podczas tworzenia zlecenia: ${response.message}`);
      }
    });
  };

  return (
    <>
      {isSubmitting && (
        <div className="flex justify-center p-8">
          <div className="text-emerald-700">Wysyłanie...</div>
        </div>
      )}
      {!isSubmitting && (
        <div className="overflow-hidden rounded-3xl border-gray-100 shadow-lg bg-white mt-6">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tytuł zlecenia
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="np. Ortofotomapa działki budowlanej"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Typ terminu
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="deadlineType"
                        value="flight"
                        checked={formData.deadlineType === "flight"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            deadlineType: e.target.value,
                          })
                        }
                        className="mr-3 h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Termin nalotu
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="deadlineType"
                        value="completion"
                        checked={formData.deadlineType === "completion"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            deadlineType: e.target.value,
                          })
                        }
                        className="mr-3 h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Termin zakończenia
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rodzaj usługi
                </label>
                <div className="grid md:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <label
                      key={service.id}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-sm ${
                        formData.service === service.id
                          ? "border-emerald-500 bg-emerald-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={service.id}
                        checked={formData.service === service.id}
                        onChange={(e) => handleServiceChange(e.target.value)}
                        className="sr-only"
                      />
                      <div className="w-8 h-8 flex items-center justify-center mr-3">
                        <i
                          className={`${service.icon} text-lg ${
                            formData.service === service.id
                              ? "text-emerald-600"
                              : "text-gray-400"
                          }`}
                        ></i>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          formData.service === service.id
                            ? "text-emerald-600"
                            : "text-gray-700"
                        }`}
                      >
                        {service.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokalizacja
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Wpisz adres lub współrzędne"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-map-pin-line"></i>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Możesz wpisać adres, nazwę miejsca lub współrzędne GPS.
                  Rekomendujemy użycie pełnych danych(miejscowość, kod pocztowy,
                  ulica..) dla dokładności.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.deadlineType === "flight"
                    ? "Termin nalotu"
                    : "Termin zakończenia"}
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opis zlecenia
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                  placeholder="Opisz szczegóły zlecenia, wymagania techniczne, oczekiwania..."
                  required
                />
              </div>

              {formData.service && (
                <ServiceParameters
                  service={formData.service}
                  parameters={formData.parameters}
                  onParametersChange={handleParametersChange}
                />
              )}

              <div className="flex justify-end space-x-4 pt-4 border-t bg-gray-50/50 -mx-8 px-8 py-6 mt-8">
                <Button
                  variant="outline"
                  type="button"
                  className="rounded-full px-6 font-medium"
                >
                  Zapisz jako szkic
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 font-medium"
                >
                  Opublikuj zlecenie
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
